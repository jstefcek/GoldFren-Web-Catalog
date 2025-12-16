# Google Analytics Connector

# Libraries
import os
from typing import Tuple
from google.oauth2 import service_account
from google.analytics.data_v1beta import BetaAnalyticsDataClient

def connect() -> Tuple[BetaAnalyticsDataClient, str, str]:
    """
    Connect to GA4 API and return open connection
    """
    # Get environment variable
    GA4_PROPERTY_ID = os.getenv("GA4_PROPERTY_ID")
    GA4_JSON_KEY_FILE_PATH = os.getenv("GA4_JSON_KEY_FILE_PATH")
    GA4_TIMEZONE = os.getenv("GA4_TIMEZONE", "Europe/Prague")
    
    # Get credentials
    creds = service_account.Credentials.from_service_account_file(
        GA4_JSON_KEY_FILE_PATH,
        scopes=["https://www.googleapis.com/auth/analytics.readonly"],
    )
    
    # Prepare client
    client = BetaAnalyticsDataClient(credentials=creds)
    
    # Return client, property ID and timezone
    return client, GA4_PROPERTY_ID, GA4_TIMEZONE