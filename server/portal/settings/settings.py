"""
Django settings for portal project.

Generated by 'django-admin startproject' using Django 1.10.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""


import os
import logging
# import settings_secret
from kombu import Exchange, Queue
from portal.settings import settings_secret
# CMS
from django.core.urlresolvers import reverse_lazy
from cmsplugin_cascade.utils import format_lazy


# pylint: disable=protected-access
# pylint: disable=invalid-name
logger = logging.getLogger(__file__)
gettext = lambda s: s  # noqa:E731
# pylint: enable=invalid-name

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = settings_secret._SECRET_KEY
# SECURITY WARNING: don't run with debug turned on in production!
# Cookie name. this can be whatever you want
SESSION_COOKIE_NAME = 'sessionid'  # use the sessionid in your views code
# the module to store sessions data
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
# age of cookie in seconds (default: 2 weeks)
SESSION_COOKIE_AGE = 24*60*60*7  # the number of seconds for only 7 for example
# whether a user's session cookie expires when the web browser is closed
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
# whether the session cookie should be secure (https:// only)
SESSION_COOKIE_SECURE = False

ALLOWED_HOSTS = ['*']

# Custom Portal Template Assets
PORTAL_ICON_FILENAME=settings_secret._PORTAL_ICON_FILENAME
PORTAL_LOGO_FILENAME=settings_secret._PORTAL_LOGO_FILENAME
PORTAL_NAVBAR_BACKGROUND_FILENAME=settings_secret._PORTAL_NAVBAR_BACKGROUND_FILENAME

# Application definition

ROOT_URLCONF = 'portal.urls'

INSTALLED_APPS = [
    'djangocms_admin_style',  # Order-dependent requirement for CMS. Must precede 'django.contrib.admin'.

    # Core Django.
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sessions.middleware',
    'django.contrib.admin',
    'django.contrib.sites',                         # CMS
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',
    'django.contrib.messages',

    # Django CMS.
    # CMS plugins that must be before 'cms'.
    'cmsplugin_cascade',

    # - CMS minimum requirements.
    'cms',
    'menus',
    'sekizai',
    'treebeard',

    # - CMS remaining plugins.
    'djangocms_text_ckeditor',

    # 'forms_builder.forms',                          # django-forms-builder


    'aldryn_bootstrap3',
    'captcha',                                        # Aldryn-forms
    'filer',
    'easy_thumbnails',

    'djangocms_audio',
    'djangocms_forms',
    'djangocms_googlemap',
    'djangocms_snippet',
    'djangocms_style',
    'djangocms_youtube',
    'djangocms_video',

    'cmsplugin_filer_file',
    'cmsplugin_filer_folder',
    'cmsplugin_filer_link',
    'cmsplugin_filer_image',
    'cmsplugin_filer_teaser',
    'cmsplugin_filer_video',
    'cmsplugin_iframe',  # edit template here: /usr/lib/python2.7/site-packages/cmsplugin_iframe/templates/cms/plugins
    'cmsplugin_socialsharekit',

    # Django recaptcha.
    'snowpenguin.django.recaptcha2',

    # Pipeline.
    'mptt',
    'bootstrap3',
    'termsandconditions',
    'impersonate',

    # Websockets.
    'ws4redis',

    # Haystack integration.
    'haystack',

    # Custom apps.
    'portal.apps.accounts',
    'portal.apps.auth',
    'portal.apps.data_depot',
    'portal.apps.workspace',
    'portal.apps.signals',
    'portal.apps.search',
    'portal.apps.workbench',
    'portal.apps.djangoRT',
    'portal.apps.projects',
    'portal.apps.licenses',
    'portal.apps.notifications',
]

MIDDLEWARE = [
    'cms.middleware.utils.ApphookReloadMiddleware',    # Django CMS, must be at start of Middleware list.

    # Default middleware.
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'portal.apps.auth.middleware.AgaveTokenRefreshMiddleware',   # Custom Portal Auth Check.
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Django CMS.
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
    'cms.middleware.utils.ApphookReloadMiddleware',

    # Throws an Error.
    # 'portal.middleware.PortalTermsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        # 'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.template.context_processors.csrf',   # Needed?
                'django.template.context_processors.tz',
                'django.template.context_processors.static',
                'django_settings_export.settings_export',
                'cms.context_processors.cms_settings',      # Django CMS.
                'sekizai.context_processors.sekizai',       # CMS Static Files.
                'ws4redis.context_processors.default',
                'portal.utils.contextprocessors.analytics',
                'portal.utils.contextprocessors.debug',
                'portal.utils.contextprocessors.messages',
            ],
            'loaders': [  # New block
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
                'django.template.loaders.eggs.Loader'
            ],
            'libraries':{
                'sd2e_nav_tags': 'portal.templatetags.sd2e_nav_tags',
            }
        },
    },
]

WSGI_APPLICATION = settings_secret._WSGI_APPLICATION

AUTHENTICATION_BACKENDS = ['portal.apps.auth.backends.AgaveOAuthBackend',
                           'django.contrib.auth.backends.ModelBackend']

# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'UserAttributeSimilarityValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'MinimumLengthValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'CommonPasswordValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'NumericPasswordValidator'),
    },
]

IMPERSONATE_REQUIRE_SUPERUSER = True

LOGIN_REDIRECT_URL = '/index/'

# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

# LANGUAGE_CODE = 'en-us'
LANGUAGE_CODE = 'en'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# LANGUAGES = [
#     ('en-us', 'US English')
# ]

LANGUAGES = (
    ## Customize this
    ('en', gettext('en')),
)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = os.path.join(BASE_DIR, '../static')
MEDIA_ROOT = os.path.join(BASE_DIR, '../media')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '../../', 'client'),
    ('vendor', os.path.join(BASE_DIR, '../../client/node_modules')),
]

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

"""
SETTINGS: LOCAL
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEBUG = settings_secret._DEBUG

# database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': settings_secret._DJANGO_DB_ENGINE,
        'NAME': settings_secret._DJANGO_DB_NAME,
        'USER': settings_secret._DJANGO_DB_USER,
        'PASSWORD': settings_secret._DJANGO_DB_PASSWORD,
        'HOST': settings_secret._DJANGO_DB_HOST,
        'PORT': settings_secret._DJANGO_DB_PORT
    }
}

WS4REDIS_CONNECTION = {
    'host': settings_secret._RESULT_BACKEND_HOST,
}
WEBSOCKET_URL = '/ws/'

WEBHOOK_POST_URL = settings_secret._WEBHOOK_POST_URL

# TAS Authentication.
TAS_URL = settings_secret._TAS_URL
TAS_CLIENT_KEY = settings_secret._TAS_CLIENT_KEY
TAS_CLIENT_SECRET = settings_secret._TAS_CLIENT_SECRET

# Redmine Tracker Authentication.
RT_HOST = settings_secret._RT_HOST
RT_UN = settings_secret._RT_UN
RT_PW = settings_secret._RT_PW
RT_QUEUE = settings_secret._RT_QUEUE

# Recaptcha Authentication.
RECAPTCHA_PUBLIC_KEY = settings_secret._RECAPTCHA_PUBLIC_KEY
RECAPTCHA_PRIVATE_KEY = settings_secret._RECAPTCHA_PRIVATE_KEY
RECAPTCHA_USE_SSL = settings_secret._RECAPTCHA_USE_SSL

# Google Analytics.
GOOGLE_ANALYTICS_PROPERTY_ID = settings_secret._GOOGLE_ANALYTICS_PROPERTY_ID
GOOGLE_ANALYTICS_PRELOAD = settings_secret._GOOGLE_ANALYTICS_PRELOAD

"""
SETTINGS: LOGGING
"""

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[DJANGO] %(levelname)s %(asctime)s %(module)s '
                      '%(name)s.%(funcName)s:%(lineno)s: %(message)s'
        },
        'agave': {
            'format': '[AGAVE] %(levelname)s %(asctime)s %(module)s '
                      '%(name)s.%(funcName)s:%(lineno)s: %(message)s'
        },
        'metrics': {
            'format': '[METRICS] %(levelname)s %(module)s %(name)s.'
                      '%(funcName)s:%(lineno)s: %(message)s '
                      'user=%(user)s sessionId=%(sessionId)s '
                      'op=%(operation)s info=%(info)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/portal/portal.log',
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'default',
        },
        'metrics_console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'metrics',
        },
        'metrics_file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/portal.log',
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'metrics',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'portal': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
        'metrics': {
            'handlers': ['metrics_console', 'metrics_file'],
            'level': 'INFO',
        },
        'paramiko': {
            'handlers': ['console'],
            'level': 'DEBUG'
        }
    },
}

"""
SETTINGS: AGAVE
"""

# Agave Tenant.
AGAVE_TENANT_ID = settings_secret._AGAVE_TENANT_ID
AGAVE_TENANT_BASEURL = settings_secret._AGAVE_TENANT_BASEURL

# Agave Client Configuration
AGAVE_CLIENT_KEY = settings_secret._AGAVE_CLIENT_KEY
AGAVE_CLIENT_SECRET = settings_secret._AGAVE_CLIENT_SECRET
AGAVE_SUPER_TOKEN = settings_secret._AGAVE_SUPER_TOKEN
AGAVE_STORAGE_SYSTEM = settings_secret._AGAVE_STORAGE_SYSTEM
AGAVE_COMMUNITY_DATA_SYSTEM = settings_secret._AGAVE_COMMUNITY_DATA_SYSTEM

PORTAL_ADMIN_USERNAME = settings_secret._PORTAL_ADMIN_USERNAME

"""
SETTINGS: DJANGO CMS
"""

SITE_ID = settings_secret._SITE_ID
FILER_DEBUG = True
FILER_ENABLE_LOGGING = True
DJANGOCMS_FORMS_WIDGET_CSS_CLASSES = {'__all__': ('form-control', ) }

CMS_LANGUAGES = {
    ## Customize this
    'default': {
        'public': True,
        'hide_untranslated': False,
        'redirect_on_fallback': True,
    },
    1: [
        {
            'public': True,
            'code': 'en',
            'hide_untranslated': False,
            'name': gettext('en-us'),  # 'en'
            'redirect_on_fallback': True,
        },
    ],
}

CMS_TEMPLATES = (
    ('cms_page.html', 'Main Site Page'),
)

CMS_PERMISSION = True

CMS_PLACEHOLDER_CONF = {}

CMSPLUGIN_CASCADE_PLUGINS = ['cmsplugin_cascade.bootstrap3']
CMSPLUGIN_CASCADE_PLUGINS.append('cmsplugin_cascade.link')
SELECT2_CSS = 'node_modules/select2/dist/css/select2.min.css'  # PATH?
SELECT2_JS = 'node_modules/select2/dist/js/select2.min.js'     # PATH?


CMSPLUGIN_FILER_IMAGE_STYLE_CHOICES = (
    ('default', 'Default'),
)
CMSPLUGIN_FILER_IMAGE_DEFAULT_STYLE = 'default'

TEXT_SAVE_IMAGE_FUNCTION='cmsplugin_filer_image.integrations.ckeditor.create_image_plugin'

THUMBNAIL_HIGH_RESOLUTION = True

THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters',
    'easy_thumbnails.processors.background'
)

# CKEDITOR_SETTINGS = {
#     'language': '{{ language }}',
#     'toolbar_CMS': [
#         ['Undo', 'Redo'],
#         ['cmsplugins', '-', 'ShowBlocks'],
#         ['Format', 'Styles'],
#     ],
#     'skin': 'moono-lisa',
#     'contentsCss': [
#         'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
#         # '/css/mysitestyles.css',
#     ],
# }

CKEDITOR_SETTINGS = {
    'language': '{{ language }}',
    'skin': 'moono-lisa',
    'toolbar': 'CMS',
}

# CMS Forms.
ALDRYN_BOILERPLATE_NAME='bootstrap3'

DJANGOCMS_FORMS_RECAPTCHA_PUBLIC_KEY = RECAPTCHA_PUBLIC_KEY
DJANGOCMS_FORMS_RECAPTCHA_SECRET_KEY = RECAPTCHA_PRIVATE_KEY
# DJANGOCMS_FORMS_PLUGIN_MODULE = _('Generic')
# DJANGOCMS_FORMS_PLUGIN_NAME = _('Form')
# DJANGOCMS_FORMS_DEFAULT_TEMPLATE = 'djangocms_forms/form_template/default.html'  # Path?
# DJANGOCMS_FORMS_TEMPLATES = (
#     ('djangocms_forms/form_template/default.html', _('Default')),
# )
# DJANGOCMS_FORMS_USE_HTML5_REQUIRED = False
# DJANGOCMS_FORMS_WIDGET_CSS_CLASSES = {'__all__': ('form-control', ) }
# DJANGOCMS_FORMS_REDIRECT_DELAY = 10000  # 10 seconds. Default is 1 second.
# instance.redirect_delay > DJANGOCMS_FORMS_REDIRECT_DELAY > 1000 (default)  # per form delay.

# Media Plugins.
DJANGOCMS_AUDIO_ALLOWED_EXTENSIONS = ['mp3', 'ogg', 'wav']
# DJANGOCMS_AUDIO_TEMPLATES = [
#     # ('default', _('Default Version')),
#     ('feature', _('Featured Version')),
# ]

#DJANGOCMS_EMBED_API_KEY = ""    # Requires an embed.ly account to use.

DJANGOCMS_VIDEO_ALLOWED_EXTENSIONS = ['mp4', 'webm', 'ogv']
# DJANGOCMS_VIDEO_TEMPLATES = [
#     ('feature', _('Featured Version')),
# ]
# Requires registering portal app on youtube: https://developers.google.com/youtube/registering_an_application
# DJANGOCMS_YOUTUBE_API_KEY = '<youtube_data_api_server_key>'


"""
SETTINGS: CELERY
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_BROKER_URL_PROTOCOL = 'amqp://'
_BROKER_URL_USERNAME = settings_secret._BROKER_URL_USERNAME
_BROKER_URL_PWD = settings_secret._BROKER_URL_PWD
_BROKER_URL_HOST = settings_secret._BROKER_URL_HOST
_BROKER_URL_PORT = settings_secret._BROKER_URL_PORT
_BROKER_URL_VHOST = settings_secret._BROKER_URL_VHOST

CELERY_BROKER_URL = ''.join(
    [
        _BROKER_URL_PROTOCOL, _BROKER_URL_USERNAME, ':',
        _BROKER_URL_PWD, '@', _BROKER_URL_HOST, ':',
        _BROKER_URL_PORT, '/', _BROKER_URL_VHOST
    ]
)

_RESULT_BACKEND_PROTOCOL = 'redis://'
_RESULT_BACKEND_USERNAME = settings_secret._RESULT_BACKEND_USERNAME
_RESULT_BACKEND_PWD = settings_secret._RESULT_BACKEND_PWD
_RESULT_BACKEND_HOST = settings_secret._RESULT_BACKEND_HOST
_RESULT_BACKEND_PORT = settings_secret._RESULT_BACKEND_PORT
_RESULT_BACKEND_DB = settings_secret._RESULT_BACKEND_DB

CELERY_RESULT_BACKEND = ''.join(
    [
        _RESULT_BACKEND_PROTOCOL,
        _RESULT_BACKEND_HOST, ':', _RESULT_BACKEND_PORT,
        '/', _RESULT_BACKEND_DB
    ]
)

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERYD_HIJACK_ROOT_LOGGER = False
CELERYD_LOG_FORMAT = ('[DJANGO] $(processName)s %(levelname)s %(asctime)s '
                      '%(module)s %(name)s.%(funcName)s:%(lineno)s: '
                      '%(message)s')

CELERY_DEFAULT_EXCHANGE_TYPE = 'direct'
CELERY_QUEUES = (
    Queue(
        'default',
        Exchange('default'),
        routing_key='default',
        queue_arguments={
            'x-max-priority': 10
        }
    ),
    # Use to queue indexing tasks
    Queue(
        'indexing',
        Exchange('indexing'),
        routing_key='indexing',
        queue_arguments={
            'x-max-priority': 10
        }
    ),
    # Use to queue tasks which handle files
    Queue(
        'files',
        Exchange('files'),
        routing_key='files',
        queue_arguments={
            'x-max-priority': 10
        }
    ),
    # Use to queue tasks which mainly call external APIs
    Queue(
        'api',
        Exchange('api'),
        routing_key='api',
        queue_arguments={
            'x-max-priority': 10
        }
    ),
    # Use to queue tasks handling onboarding
    Queue(
        'onboard',
        Exchange('onboard'),
        routing_key='onboard',
        queue_arguments={
            'x-max-priority': 10
        }
    ),
    )
CELERY_TASK_DEFAULT_QUEUE = 'default'
CELERY_TASK_DEFAULT_EXCHANGE = 'default'
CELERY_TASK_DEFAULT_ROUTING_KEY = 'default'

"""
SETTINGS: DATA DEPOT
"""

PORTAL_DATA_DEPOT_MANAGERS = {
    'my-data': 'portal.apps.data_depot.managers.private_data.FileManager',
    'shared': 'portal.apps.data_depot.managers.shared.FileManager',
    'my-projects': 'portal.apps.data_depot.managers.projects.FileManager'
}

PORTAL_SEARCH_MANAGERS = {
    'my-data': 'portal.apps.search.api.managers.private_data_search.PrivateDataSearchManager',
    'shared': 'portal.apps.search.api.managers.shared_search.SharedSearchManager',
    'cms': 'portal.apps.search.api.managers.cms_search.CMSSearchManager', 
    # 'my-projects': 'portal.apps.data_depot.managers.projects.FileManager'
}

PORTAL_DATA_DEPOT_PAGE_SIZE = 100

PORTAL_WORKSPACE_MANAGERS = {
    'private': 'portal.apps.workspace.managers.private.FileManager',
    'shared': 'portal.apps.workspace.managers.shared.FileManager',
}
PORTAL_WORKSPACE_PAGE_SIZE = 100

TOOLBAR_OPTIONS = {
    'trash_enabled': True,
    'share_enabled': True,
    'preview_enabled': True,
    'preview_images_enabled': True,
    'copy_enabled': True,
    'move_enabled': True,
    'rename_enabled': True,
    'tag_enabled': True,
}

AGAVE_DEFAULT_TRASH_NAME = '.Trash'

PORTAL_DATA_DEPOT_USER_SYSTEM_PREFIX = settings_secret.\
    _PORTAL_DATA_DEPOT_USER_SYSTEM_PREFIX

PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_ABS_PATH = settings_secret.\
    _PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_ABS_PATH

PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_REL_PATH = settings_secret.\
    _PORTAL_DATA_DEPOT_DEFAULT_HOME_DIR_REL_PATH

PORTAL_DATA_DEPOT_STORAGE_HOST = settings_secret.\
    _PORTAL_DATA_DEPOT_STORAGE_HOST

PORTAL_DATA_DEPOT_PROJECT_SYSTEM_PREFIX = settings_secret.\
    _PORTAL_DATA_DEPOT_PROJECT_SYSTEM_PREFIX

PORTAL_USER_HOME_MANAGER = settings_secret.\
    _PORTAL_USER_HOME_MANAGER

PORTAL_KEYS_MANAGER = settings_secret.\
    _PORTAL_KEYS_MANAGER

PORTAL_USER_ACCOUNT_SETUP_STEPS = settings_secret.\
    _PORTAL_USER_ACCOUNT_SETUP_STEPS

PORTAL_NAMESPACE = settings_secret.\
    _PORTAL_NAMESPACE

PORTAL_DATA_DEPOT_WORK_HOME_DIR_FS = settings_secret.\
    _PORTAL_DATA_DEPOT_WORK_HOME_DIR_FS

PORTAL_DATA_DEPOT_WORK_HOME_DIR_EXEC_SYSTEM = settings_secret.\
    _PORTAL_DATA_DEPOT_WORK_HOME_DIR_EXEC_SYSTEM

PORTAL_APPS_METADATA_NAMES = settings_secret._PORTAL_APPS_METADATA_NAMES

"""
SETTINGS: ELASTICSEARCH
"""

ES_HOSTS = settings_secret._ES_HOSTS
ES_DEFAULT_INDEX = "files"
ES_DEFAULT_INDEX_ALIAS = "default"
ES_PUBLIC_INDEX = "publications"
ES_PUBLIC_INDEX_ALIAS = "public"
ES_FILES_DOC_TYPE = "files"
ES_PROJECTS_DOC_TYPE = "projects"
ES_PUBLICATIONS_INDEX = "publications"
ES_METADATA_DOC_TYPE = "metadata"
ES_CMS_INDEX = "cms"

HAYSTACK_CONNECTIONS = settings_secret._HAYSTACK_CONNECTIONS
HAYSTACK_ROUTERS = ['aldryn_search.router.LanguageRouter', ]

ALDRYN_SEARCH_DEFAULT_LANGUAGE = 'en'
ALDRYN_SEARCH_REGISTER_APPHOOK = True

"""
SETTINGS: EXPORTS
"""

SETTINGS_EXPORT = [
    'PORTAL_ICON_FILENAME',
    'PORTAL_LOGO_FILENAME',
    'PORTAL_NAVBAR_BACKGROUND_FILENAME',
    'DEBUG',
    'GOOGLE_ANALYTICS_PRELOAD',
    'GOOGLE_ANALYTICS_PROPERTY_ID',
    'PORTAL_NAMESPACE'
]
