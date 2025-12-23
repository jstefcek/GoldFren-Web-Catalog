# Business logic for the Google Analytics Service
# ------------------------------------------------------------------

# Libraries
# ------------------------------------------------------------------
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from Components.GA4 import connect
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest, FilterExpression, Filter, OrderBy
from GoldFrenAPI.utils.ga4_utils import prepare_request

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
            
    # Calculate date ranges based on GA4 timezone
    last_30_days_start = (now_tz - timedelta(days=30)).strftime("%Y-%m-%d")
    last_30_days_end = now_tz.strftime("%Y-%m-%d")

    # Build GA4 report request for country breakdown this month
    req_countries = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[
            DateRange(start_date=last_30_days_start, end_date=last_30_days_end),
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

def get_visitor_metrics(limit: int = 1, days: int = 30):
    """
    Function would return number of visitors for the specific date
    For default, it returns one record for the last 30 days
    """

def get_countries_metrics(limit: int = 10, days: int = 30):
    """
    Function would return countires with most viewed users on web
    For default, it returns top 10 countries for the last 30 days
    """

def get_top_searched_manufacturers(limit: int = 20, days: int = 30) -> dict:
    """
    Function returned top searched manufacturers from Google Analytics 4.
    For default, it returns top 20 manufacturers for the last 30 days,
    """
    # Connect to GA4
    CLIENT: BetaAnalyticsDataClient
    GA4_PROPERTY_ID: str
    GA4_TIMEZONE: str
    CLIENT, GA4_PROPERTY_ID, GA4_TIMEZONE = connect()
    
    # Current time localized to GA4 timezone
    now_tz = datetime.now(ZoneInfo(GA4_TIMEZONE))
    
    # Calculate date ranges based on GA4 timezone
    start_date = (now_tz - timedelta(days=days)).strftime("%Y-%m-%d")
    end_date = now_tz.strftime("%Y-%m-%d")
    
    # Prepare GA4 request
    req = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimensions=[Dimension(name="customEvent:vyrobce")],
        metrics=[Metric(name="eventCount")],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="eventName",
                string_filter=Filter.StringFilter(value="vehicle_search"),
            )
        ),
        order_bys=[
            OrderBy(
                metric=OrderBy.MetricOrderBy(metric_name="eventCount"),
                desc=True,
            )
        ],
        limit=limit,
    )
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "manufacturers": {}
    }
    
    for row in res.rows:
        vyrobce = (row.dimension_values[0].value or "").strip()
        count_raw = row.metric_values[0].value or "0"
        
        # Safely convert count to integer
        try:
            searches = int(float(count_raw))
        except ValueError:
            searches = 0

        # Add to manufacturers dictionary
        result["manufacturers"][vyrobce] = searches
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return compiled manufacturers data    
    return result

def get_sessions_manual_source(limit: int = 10, days: int = 7) -> dict:
    """
    Return sessions by manual source for the last X days from GA4 with X limit of results.
    By default, it returns data for the last 7 days but can be adjusted via the 'days' parameter
    and limit the results via the 'limit' parameter with default value of 10.
    """
    # Connect to GA4
    CLIENT: BetaAnalyticsDataClient
    GA4_PROPERTY_ID: str
    GA4_TIMEZONE: str
    CLIENT, GA4_PROPERTY_ID, GA4_TIMEZONE = connect()
    
    # Current time localized to GA4 timezone
    now_tz = datetime.now(ZoneInfo(GA4_TIMEZONE))
    
    # Calculate date ranges based on GA4 timezone
    start_date = (now_tz - timedelta(days=days)).strftime("%Y-%m-%d")
    end_date = now_tz.strftime("%Y-%m-%d")
    
    # Prepare GA4 request
    req = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimensions=[Dimension(name="sessionManualSource")],
        metrics=[Metric(name="screenPageViews")],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionManualSource",
                string_filter=Filter.StringFilter(value=".+", match_type=Filter.StringFilter.MatchType.FULL_REGEXP),
            )
        ),
        order_bys=[
            OrderBy(
                metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"),
                desc=True,
            )
        ],
        limit=limit,
    )
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "sources": {}
    }
    for row in res.rows:
        source = (row.dimension_values[0].value or "").strip()
        count_raw = row.metric_values[0].value or "0"
        
        # Safely convert count to integer
        try:
            sessions = int(float(count_raw))
        except ValueError:
            sessions = 0
            
        # Handle empty or not set sources
        if not source or source.lower() == "(not set)":
            source = "Direct visit"

        # Add to manual sources dictionary
        result["sources"][source] = sessions
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_language_sessions(limit: int = 10, days: int = 7) -> dict:
    """
    Return sessions by language for the last X days from GA4 with X limit of results.
    By default, it returns data for the last 7 days but can be adjusted via the 'days' parameter
    and limit the results via the 'limit' parameter with default value of 10.
    """
    # Connect to GA4
    CLIENT: BetaAnalyticsDataClient
    GA4_PROPERTY_ID: str
    GA4_TIMEZONE: str
    CLIENT, GA4_PROPERTY_ID, GA4_TIMEZONE = connect()
    
    # Current time localized to GA4 timezone
    now_tz = datetime.now(ZoneInfo(GA4_TIMEZONE))
    
    # Calculate date ranges based on GA4 timezone
    start_date = (now_tz - timedelta(days=days)).strftime("%Y-%m-%d")
    end_date = now_tz.strftime("%Y-%m-%d")
    
    # Prepare GA4 request
    req = prepare_request(property_id=GA4_PROPERTY_ID, 
                          dimension_name="language",
                          metrics_name="ActiveUsers",
                          start_date=start_date,
                          end_date=end_date,
                          limit=limit)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "languages": {}
    }
    for row in res.rows:
        language = (row.dimension_values[0].value or "").strip()
        count_raw = row.metric_values[0].value or "0"
        
        # Safely convert count to integer
        try:
            sessions = int(float(count_raw))
        except ValueError:
            sessions = 0

        # Add to languages dictionary
        result["languages"][language] = sessions
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_top_view_pages(limit: int = 10, days: int = 7) -> dict:
    """
    Return top viewed pages for the last X days from GA4 with X limit of results.
    By default, it returns data for the last 7 days but can be adjusted via the 'days' parameter
    and limit the results via the 'limit' parameter with default value of 10.
    """
    # Connect to GA4
    CLIENT: BetaAnalyticsDataClient
    GA4_PROPERTY_ID: str
    GA4_TIMEZONE: str
    CLIENT, GA4_PROPERTY_ID, GA4_TIMEZONE = connect()
    
    # Current time localized to GA4 timezone
    now_tz = datetime.now(ZoneInfo(GA4_TIMEZONE))
    
    # Calculate date ranges based on GA4 timezone
    start_date = (now_tz - timedelta(days=days)).strftime("%Y-%m-%d")
    end_date = now_tz.strftime("%Y-%m-%d")
    
    # Prepare GA4 request
    req = prepare_request(property_id=GA4_PROPERTY_ID, 
                          dimension_name="pagePath",
                          metrics_name="screenPageViews",
                          start_date=start_date,
                          end_date=end_date,
                          limit=limit)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "pages": {}
    }
    for row in res.rows:
        page_path = (row.dimension_values[0].value or "").strip()
        count_raw = row.metric_values[0].value or "0"
        
        # Safely convert count to integer
        try:
            views = int(float(count_raw))
        except ValueError:
            views = 0
            
        # Replace / to home page
        if page_path == "/":
            page_path = "Home page"
        
        # Remove leading slash
        if page_path.startswith("/"):
            page_path = page_path[1:]
            
        # Renamed old php index page name
        if page_path == "index.php":
            page_path = "Old Web Catalog Page"

        # Add to pages dictionary
        result["pages"][page_path] = views
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result