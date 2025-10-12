"""
Django settings for GoldFren project.
"""
from dotenv import load_dotenv
import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _

# Load environment variables
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# SECURITY WARNING: update this when you have the production host
ALLOWED_HOSTS = [
    'localhost', 
    '127.0.0.1', 
    'localhost:8000',
    '127.0.0.1:8000',
    'goldfren_frontend',
    'goldfren_nginx',
    'catalog.goldfren.cz',
    'catalog.goldfren.com',
    'katalog.goldfren.cz',
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'GoldFren',
    'GoldFrenAPI',
]

# Middleware configuration
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL configuration
ROOT_URLCONF = 'GoldFren.urls'

# Template settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# File cache settings
CACHE_LOCATION = os.getenv("DJANGO_CACHE_LOCATION", "/tmp/django_cache")
CACHE_ENTRIES = int(os.getenv("DJANGO_CACHE_ENTRIES", "100000"))
CACHE_TIMEOUT = int(os.getenv("DJANGO_CACHE_TIMEOUT", str(60 * 60 * 24)))

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': CACHE_LOCATION,
        'TIMEOUT': CACHE_TIMEOUT,
        'OPTIONS': {
            'MAX_ENTRIES': CACHE_ENTRIES,
        },
    }
}

# WSGI application
WSGI_APPLICATION = 'GoldFren.wsgi.application'

# Production-only Django security settings
if not DEBUG:
    # Cookie security
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Trust nginx proxy headers
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Enhanced CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://catalog.goldfren.cz",
    "https://catalog.goldfren.cz",
    "http://catalog.goldfren.com",
    "https://catalog.goldfren.com",
    "http://185.80.30.44",
    "https://185.80.30.44",
]

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    "http://catalog.goldfren.cz",
    "https://catalog.goldfren.cz",
    "http://catalog.goldfren.com",
    "https://catalog.goldfren.com",
    "http://185.80.30.44",
    "https://185.80.30.44",
]

MIGRATION_MODULES = {
    'GoldFrenAPI': None, 
}

# Django REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ),
    'DEFAULT_THROTTLE_RATES': {
        'anon': '60/min',
        'user': '120/min',
        'login': '10/min',
    },
}

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv("MYSQL_ROOT_NAME"),
        'USER': os.getenv("MYSQL_ROOT_USER"),
        'PASSWORD': os.getenv("MYSQL_ROOT_PASSWORD"),
        'HOST': os.getenv("MYSQL_HOSTNAME"),
        'PORT': os.getenv("MYSQL_PORT"),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'cs'
TIME_ZONE = 'Europe/Prague'

# Enables Django’s translation system
USE_I18N = True
USE_L10N = True

# Enables time zone support
USE_TZ = True

# Define available languages
LANGUAGES = [
    ('cs', _('Czech')),   # Default
    ('en', _('English')),
]

# Where to look for translations
LOCALE_PATHS = [
    BASE_DIR / 'GoldFren' / 'localizations', 
]

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'staticfiles'),  
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Media files
MEDIA_URL = '/GoldFren_Media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'GoldFren_Media')

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{levelname}] {asctime} {name} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '[{levelname}] {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'maxBytes': 10 * 1024 * 1024,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'error_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django_errors.log'),
            'maxBytes': 10 * 1024 * 1024,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
            'level': 'ERROR',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['error_file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'GoldFrenAPI': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}

# Create logs directory if it doesn't exist yet
os.makedirs(os.path.join(BASE_DIR, 'logs'), exist_ok=True)