from mock import patch
from django.test import TestCase
from django.contrib.auth import get_user_model
from portal.apps.auth.models import AgaveOAuthToken
from pytas.http import TASClient
from portal.apps.users.utils import get_allocations


class AttrDict(dict):

    def __getattr__(self, key):
        return self[key]

    def __setattr__(self, key, value):
        self[key] = value


class TestUserApiViews(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.mock_client_patcher = patch('portal.apps.auth.models.AgaveOAuthToken.client')
        cls.mock_client = cls.mock_client_patcher.start()

    @classmethod
    def tearDownClass(cls):
        cls.mock_client_patcher.stop()

    def setUp(self):
        User = get_user_model()
        user = User.objects.create_user('test', 'test@test.com', 'test')
        token = AgaveOAuthToken(
            token_type="bearer",
            scope="default",
            access_token="1234fsf",
            refresh_token="123123123",
            expires_in=14400,
            created=1523633447)
        token.user = user
        token.save()
        user.is_staff = False
        user.save()

    def test_auth_view(self):
        self.client.login(username='test', password='test')
        resp = self.client.get("/api/users/auth/", follow=True)
        data = resp.json()
        self.assertEqual(resp.status_code, 200)
        # should only return user data system and community
        self.assertTrue(data["username"] == 'test')
        self.assertTrue(data["email"] == "test@test.com")
        self.assertFalse(data["isStaff"])

    def test_auth_view_noauth(self):
        resp = self.client.get("/api/users/auth/", follow=True)
        self.assertEqual(resp.status_code, 401)
        # should only return user data system and community

    @patch('portal.apps.users.views.IndexedFile')
    def test_usage_view(self, mocked_file):
        # TODO: this is hideous, there must be a better way to write that or
        # re-write the route to be less disgusting.
        mocked_file.search.return_value.filter.return_value.extra.return_value.execute.return_value.to_dict.return_value = {
            "aggregations": {
                "total_storage_bytes": {"value": 10}
            }
        }
        self.client.login(username='test', password='test')
        resp = self.client.get("/api/users/usage/", follow=True)
        data = resp.json()
        self.assertTrue(data["total_storage_bytes"] == 10)

    def test_usage_view_noauth(self):
        # TODO: API routes should return a 401 not a 302 that redirects to login
        resp = self.client.get("/api/users/usage/")
        self.assertTrue(resp.status_code == 302)


class TestGetAllocations(TestCase):
    def setUp(self):
        super(TestGetAllocations, self).setUp()
        self.mock_tas_patcher = patch(
            'portal.apps.users.utils.TASClient',
            spec=TASClient
        )
        self.mock_tas = self.mock_tas_patcher.start()

    def tearDown(self):
        super(TestGetAllocations, self).tearDown()
        self.mock_tas_patcher.stop()

    def test_allocations_returned(self):
        self.mock_tas.return_value.projects_for_user.return_value = [
            {
                "title": "Big Project",
                "chargeCode": "Big-Proj",
                "pi": {
                    "firstName": "Test",
                    "lastName": "User"
                },
                "allocations": [
                    {
                        "status": "Active",
                        "resource": "Frontera"
                    }
                ]
            },
            {
                "title": "Old Proj",
                "chargeCode": "Proj-Old",
                "pi": {
                    "firstName": "Old",
                    "lastName": "User"
                },
                "allocations": [
                    {
                        "status": "Inactive",
                        "resource": "Stampede4"
                    }
                ]
            },
            {
                "title": "A Proj",
                "chargeCode": "Proj-Code",
                "pi": {
                    "firstName": "Another",
                    "lastName": "User"
                },
                "allocations": [
                    {
                        "status": "Active",
                        "resource": "Rodeo2"
                    }
                ]
            }
        ]
        active_expected = [
            {
                "projectId": "Big-Proj",
                "systems": [
                    {
                        'allocation': {'resource': 'Frontera', 'status': 'Active'},
                        'host': 'frontera.tacc.utexas.edu',
                        'name': 'Frontera',
                        'type': 'HPC'
                    }
                ],
                "title": "Big Project",
                "pi": "Test User"
            },
            {
                "projectId": "Proj-Code",
                "systems": [
                    {
                        'allocation': {'resource': 'Rodeo2', 'status': 'Active'},
                        'host': 'rodeo.tacc.utexas.edu',
                        'name': 'Rodeo',
                        'type': 'STORAGE'
                    }
                ],
                "title": "A Proj",
                "pi": "Another User"
            }
        ]

        inactive_expected = [
            {
                "title": "Old Proj",
                "chargeCode": "Proj-Old",
                "pi": {
                    "firstName": "Old",
                    "lastName": "User"
                },
                "allocations": [
                    {
                        "status": "Inactive",
                        "resource": "Stampede4"
                    }
                ]
            }
        ]

        active_result, inactive_result = get_allocations("username")
        self.assertEqual(active_result, active_expected)
        self.assertEqual(inactive_result, inactive_expected)
