# Business logic for the Google Analytics Service
# ------------------------------------------------------------------

# Libraries
# ------------------------------------------------------------------
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from Components.GA4 import connect
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
import logging

def get_home_page_metrics() -> dict:
    """
    Return today's, yesterday's, this month's, and last month's page metrics from GA4 
    using the GA4 property's timezone, plus country breakdown for this month.
    """
    # Connect to GA4
    CLIENT: BetaAnalyticsDataClient
    GA4_PROPERTY_ID: str
    GA4_TIMEZONE: str
    CLIENT, GA4_PROPERTY_ID, GA4_TIMEZONE = connect()

    # Define metrics to query
    metrics = ["screenPageViews"]

    # Current time localized to GA4 timezone
    now_tz = datetime.now(ZoneInfo(GA4_TIMEZONE))

    # Calculate date ranges based on GA4 timezone
    today = now_tz.strftime("%Y-%m-%d")
    yesterday = (now_tz - timedelta(days=1)).strftime("%Y-%m-%d")

    this_month_start = now_tz.replace(day=1).strftime("%Y-%m-%d")
    this_month_end = now_tz.strftime("%Y-%m-%d")

    last_month_end_dt = now_tz.replace(day=1) - timedelta(days=1)
    last_month_start_dt = last_month_end_dt.replace(day=1)
    last_month_start = last_month_start_dt.strftime("%Y-%m-%d")
    last_month_end = last_month_end_dt.strftime("%Y-%m-%d")

    # Prepare date range definitions
    requests = {
        "today": {
            "date_ranges": [{"start_date": today, "end_date": today}],
            "metrics": metrics,
        },
        "yesterday": {
            "date_ranges": [{"start_date": yesterday, "end_date": yesterday}],
            "metrics": metrics,
        },
        "this_month": {
            "date_ranges": [{"start_date": this_month_start, "end_date": this_month_end}],
            "metrics": metrics,
        },
        "last_month": {
            "date_ranges": [{"start_date": last_month_start, "end_date": last_month_end}],
            "metrics": metrics,
        },
    }

    # Execute GA4 report requests
    results = {}
    for period, params in requests.items():
        # Build GA4 report request
        req = RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            date_ranges=[DateRange(start_date=params["date_ranges"][0]["start_date"], end_date=params["date_ranges"][0]["end_date"],)],
            metrics=[Metric(name=metric) for metric in metrics],
        )
        
        # Run report
        res = CLIENT.run_report(request=req)

        # Extract metric value safely
        if res.rows and res.rows[0].metric_values:
            results[period] = int(res.rows[0].metric_values[0].value)
        else:
            results[period] = 0

    # Build GA4 report request for country breakdown this month
    req_countries = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[
            DateRange(start_date=this_month_start, end_date=this_month_end),
        ],
        dimensions=[Dimension(name="country")],
        metrics=[Metric(name="activeUsers")],
    )
    
    # Run report for country breakdown
    res_countries = CLIENT.run_report(request=req_countries)

    # Extract country data
    countries = []
    for row in res_countries.rows:
        country_name = row.dimension_values[0].value if row.dimension_values else "Unknown"
        active_users = int(row.metric_values[0].value) if row.metric_values else 0
        countries.append({
            "country": country_name,
            "activeUsers": active_users
        })
    
    # Add countries to results
    results["countries"] = countries
    
    # Add generated timestamp info
    results["generated_at"] = now_tz

    # Return compiled results
    return results