from portal.apps.onboarding.steps.abstract import AbstractStep
from portal.apps.onboarding.state import SetupState
from portal.apps.webhooks.callback import WebhookCallback
from portal.apps.auth.tasks import get_user_storage_systems
from portal.apps.system_creation.utils import (
    call_reactor,
    substitute_user_variables
)
from portal.apps.onboarding.execute import (
    execute_setup_steps,
    load_setup_step
)
from django.conf import settings
import json
import logging


class SystemCreationStep(AbstractStep):
    logger = logging.getLogger(__name__)

    def __init__(self, user):
        """
        Call super class constructor
        """
        super(SystemCreationStep, self).__init__(user)

    def display_name(self):
        return "Creating storage systems"

    def prepare(self):
        self.state = SetupState.PENDING
        self.log("Awaiting storage system creation")

    def process(self):
        storage_systems = get_user_storage_systems(
            self.user.username,
            settings.PORTAL_DATA_DEPOT_LOCAL_STORAGE_SYSTEMS
        )
        self.logger.debug("Unpacking systems to create: {}".format(storage_systems))

        # Create a list of tuples of systemId, variables from substitute_user_variables
        substituted = [
            substitute_user_variables(self.user, v['systemId'], v) for k, v in storage_systems.items()
        ]

        # Convert list of tuples to dictionary
        systems = {
            systemId: variables for systemId, variables in substituted
        }
        self.logger.debug("System variables substituted: {}".format(systems))

        # Store requested systemIds
        data = {
            'requested': list(systems.keys()),
            'failed': [],
            'successful': []
        }

        for systemId, variables in substituted:
            result = call_reactor(
                self.user,
                systemId,
                'wma-storage',
                variables,
                force=True,
                dryrun=False,
                callback="portal.apps.onboarding.steps.system_creation.SystemCreationCallback",
                callback_data={"expected": systemId}
            )
            self.logger.debug(
                "System creation reactor for {} has executionId {}".format(
                    systemId,
                    result['executionId']
                )
            )

        self.log("Creating systems {}".format(str(data['requested'])), data=data)
    
    def mark_system(self, systemId, status):
        """
        Process callbacks from system creation reactor
        """
        self.logger.debug("System creation for {} {}".format(systemId, status))
        data = self.last_event.data
        try:
            data['requested'].remove(systemId)
            data[status].append(systemId)
            self.log("System creation for {} {}".format(systemId, status), data=data)
        except ValueError:
            self.logger.error(
                "System creation service unexpectedly reported creation of {}".format(systemId)
            )
            # Handle a success report for system creation after a failure report
            if systemId in data['failed'] and status == "successful":
                data['failed'].remove(systemId)
                data['successful'].append(systemId)
                self.log("Retry successful for system creation of {}".format(systemId), data=data) 
                self.logger.info("Retry successful for system creation of {}".format(systemId))

        if len(data['requested']) == 0:
            if len(data['failed']) == 0:
                self.complete("System creation complete", data=data)
            else:
                self.fail("System creation failed for one or more systems.", data=data)

            # Re-initiate onboarding event processing sequence
            self.logger.info("Continuing onboarding for {}".format(self.user.username))
            execute_setup_steps.apply_async(args=[self.user.username])


class SystemCreationCallback(WebhookCallback):
    logger = logging.getLogger(__name__)

    def __init__(self):
        super(WebhookCallback, self).__init__()

    def callback(self, external_call, webhook_request):
        response = json.loads(webhook_request.body)
        expected = external_call.callback_data['expected']
        step = SystemCreationStep(external_call.user)
        if response['result'] == 'success' and response['system']['id'] == expected:
            step.mark_system(expected, 'successful')
        else:
            self.logger.error('System creation reactor callback reported failure')
            self.logger.error("{}".format(response))
            step.mark_system(expected, 'failed')

