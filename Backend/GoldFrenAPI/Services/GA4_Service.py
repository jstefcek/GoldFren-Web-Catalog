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
        },
        "yesterday": {
            "date_ranges": [{"start_date": yesterday, "end_date": yesterday}],
        },
        "this_month": {
            "date_ranges": [{"start_date": this_month_start, "end_date": this_month_end}],
        },
        "last_month": {
            "date_ranges": [{"start_date": last_month_start, "end_date": last_month_end}],
        },
    }

    # Execute GA4 report requests
    results = {}
    for period, params in requests.items():
        # Build GA4 report request
        req = RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            date_ranges=[DateRange(start_date=params["date_ranges"][0]["start_date"], end_date=params["date_ranges"][0]["end_date"],)],
            metrics=[Metric(name="screenPageViews")],
            order_bys=[
                OrderBy(
                    metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"),
                    desc=True,
                )
            ],
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
        order_bys=[
            OrderBy(
                metric=OrderBy.MetricOrderBy(metric_name="activeUsers"),
                desc=True,
            )
        ],
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

def get_top_searched_manufacturers(limit: int = 10, days: int = 30) -> dict:
    """
    Function returned top searched manufacturers from Google Analytics 4.
    For default, it returns top 10 manufacturers for the last 30 days,
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
        # Extract values
        vyrobce = (row.dimension_values[0].value or "").strip()
        count_raw = row.metric_values[0].value or "0"
        
        # Safely convert values
        searches = int(float(count_raw)) if count_raw else 0

        # Add to manufacturers dictionary
        result["manufacturers"][vyrobce] = searches
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return compiled manufacturers data    
    return result

def get_sessions_manual_source(days: int) -> dict:
    """
    Return sessions by manual source for the last X days from GA4.
    By default, it returns data for the last 30 days but can be adjusted via the 'days' parameter.
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
                          dimension_name="sessionManualSource",
                          metrics_name=["sessions", "engagementRate"],
                          order_by_metric="sessions",
                          start_date=start_date,
                          end_date=end_date,
                          limit=10,
                          desc=True)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "sessions": []
    }
    for row in res.rows:
        # Extract values
        sessions_name_str = row.dimension_values[0].value or ""
        sessions_raw = row.metric_values[0].value or "0"
        engagement_rate_raw = row.metric_values[1].value or "0"
        
        # Safely convert values
        sessions = int(float(sessions_raw)) if sessions_raw else 0
        engagement_rate = round(float(engagement_rate_raw) * 100.0, 2) if engagement_rate_raw else 0
            
        # Rename not set value to direct
        if sessions_name_str == "(not set)":
            sessions_name_str = "Direct"

        # Append to result list
        result["sessions"].append({
            "name": sessions_name_str,
            "sessions": sessions,
            "engagementRate": engagement_rate,
        })
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_language_sessions(limit: int = 10, days: int = 30) -> dict:
    """
    Return sessions by language for the last X days from GA4 with X limit of results.
    By default, it returns data for the last 30 days but can be adjusted via the 'days' parameter
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
                          metrics_name=["screenPageViews", "ActiveUsers"],
                          order_by_metric="screenPageViews",
                          start_date=start_date,
                          end_date=end_date,
                          limit=limit,
                          desc=True)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "languages": []
    }
    for row in res.rows:
        # Extract values
        language = (row.dimension_values[0].value or "").strip()
        screen_page_views_raw = row.metric_values[0].value or "0"
        active_users_raw = row.metric_values[1].value or "0"
        
        # Safely convert values
        screen_page_views = int(float(screen_page_views_raw)) if screen_page_views_raw else 0
        active_users = int(float(active_users_raw)) if active_users_raw else 0

        # Add to languages dictionary
        result["languages"].append({
            "name": language,
            "screenPageViews": screen_page_views,
            "activeUsers": active_users,
        })
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_top_view_pages(limit: int = 10, days: int = 30) -> dict:
    """
    Return top viewed pages for the last X days from GA4 with X limit of results.
    By default, it returns data for the last 30 days but can be adjusted via the 'days' parameter
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
                          metrics_name=["screenPageViews", "activeUsers", "averageSessionDuration"],
                          order_by_metric="screenPageViews",
                          start_date=start_date,
                          end_date=end_date,
                          limit=limit,
                          desc=True)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "pages": []
    }
    for row in res.rows:
        # Extract values
        page_path = (row.dimension_values[0].value or "").strip()
        screen_page_views_raw = row.metric_values[0].value or "0"
        active_users_raw = row.metric_values[1].value or "0"
        average_session_duration_raw = row.metric_values[2].value or "0"
        
        # Safely convert values
        screen_page_views = int(float(screen_page_views_raw)) if screen_page_views_raw else 0
        active_users = int(float(active_users_raw)) if active_users_raw else 0
        average_session_duration = round(float(average_session_duration_raw), 2) if average_session_duration_raw else 0
            
        # Replace / to home page
        if page_path == "/":
            page_path = "Home Page"
            
        # Renamed old php index page name
        if page_path == "/index.php":
            continue

        # Add to pages dictionary
        result["pages"].append({
            "name": page_path,
            "screenPageViews": screen_page_views,
            "activeUsers": active_users,
            "averageSessionDuration": average_session_duration,
        })
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_web_stats_summary(days: int) -> dict:
    """
    Return a summary of web statistics from GA4 including active users, sessions,
    screen page views, engagement rate, new users and average session duration for the last 30 days.
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
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="engagementRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="newUsers"),
        ],
    )
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "activeUsers": 0,
        "sessions": 0,
        "screenPageViews": 0,
        "engagementRate": 0.0,
        "averageSessionDuration": 0.0,
        "newUsers": 0,
        "generated_at": now_tz.isoformat(),
    }

    # If no rows returned, return default result
    if not res.rows:
        return result

    # Extract metric values from the first row
    vals = res.rows[0].metric_values
    result["activeUsers"] = int(float(vals[0].value or 0))
    result["sessions"] = int(float(vals[1].value or 0))
    result["screenPageViews"] = int(float(vals[2].value or 0))
    result["engagementRate"] = round(float(vals[3].value or 0.0) * 100.0, 2) # Convert to percentage
    result["averageSessionDuration"] = round(float(vals[4].value or 0.0), 2) # In seconds
    result["newUsers"] = int(float(vals[5].value or 0))

    # Return the result
    return result

def get_traffic_over_time(days: int) -> dict:
    """
    Return traffic over time from GA4 for the last X days.
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
                          dimension_name="date",
                          metrics_name=["activeUsers", "sessions", "screenPageViews"],
                          start_date=start_date,
                          end_date=end_date,
                          order_by_dimension=True,
                          desc=False)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "traffic_over_time": []
    }
    for row in res.rows:
        # Extract values
        date_str = row.dimension_values[0].value or ""
        active_users_raw = row.metric_values[0].value or "0"
        sessions_raw = row.metric_values[1].value or "0"
        screen_page_views_raw = row.metric_values[2].value or "0"
        
        # Safely convert values
        active_users = int(float(active_users_raw)) if active_users_raw else 0
        sessions = int(float(sessions_raw)) if sessions_raw else 0
        screen_page_views = int(float(screen_page_views_raw)) if screen_page_views_raw else 0
        date_formatted = datetime.strptime(date_str, "%Y%m%d").strftime("%Y-%m-%d") if date_str else date_str

        # Append to result list
        result["traffic_over_time"].append({
            "date": date_formatted,
            "activeUsers": active_users,
            "sessions": sessions,
            "screenPageViews": screen_page_views,
        })
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_engagment_quality(days: int) -> dict:
    """
    Return Engagement Quality metrics from GA4.
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
                          dimension_name="date",
                          metrics_name=["engagementRate", "averageSessionDuration"],
                          start_date=start_date,
                          end_date=end_date,
                          order_by_dimension=True,
                          desc=False)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "engagment_quality": []
    }
    for row in res.rows:
        # Extract values
        date_str = row.dimension_values[0].value or ""
        engagement_rate_raw = row.metric_values[0].value or "0"
        average_session_duration_raw = row.metric_values[1].value or "0"
        
        # Safely convert values
        engagement_rate = round(float(engagement_rate_raw) * 100.0, 2) if engagement_rate_raw else 0.0
        average_session_duration = round(float(average_session_duration_raw), 2) if average_session_duration_raw else 0.0
        date_formatted = datetime.strptime(date_str, "%Y%m%d").strftime("%Y-%m-%d") if date_str else date_str

        # Append to result list
        result["engagment_quality"].append({
            "date": date_formatted,
            "engagementRate": engagement_rate,
            "averageSessionDuration": average_session_duration,
        })
        
    # Add generated timestamp info
    result["generated_at"] = now_tz
    
    # Return data    
    return result

def get_device_engagment(days: int) -> dict:
    """
    Return device engagement metrics from GA4.
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
                          dimension_name="deviceCategory",
                          metrics_name=["sessions", "engagementRate", "averageSessionDuration"],
                          order_by_metric="sessions",
                          start_date=start_date,
                          end_date=end_date,
                          desc=True)
    
    # Run report
    res = CLIENT.run_report(req)
    
    # Extract response data
    result = {
        "device_engagement": [],
        "generated_at": now_tz.isoformat(),
    }
    for row in res.rows or []:
        # Extract values
        device_category = row.dimension_values[0].value or "unknown"
        sessions_raw = row.metric_values[0].value or "0"
        engagement_rate_raw = row.metric_values[1].value or "0"
        avg_session_duration_raw = row.metric_values[2].value or "0"

        # Safely convert values
        sessions = int(float(sessions_raw)) if sessions_raw else 0
        engagement_rate_pct = round(float(engagement_rate_raw) * 100.0, 2) if engagement_rate_raw else 0.0
        avg_session_duration_sec = round(float(avg_session_duration_raw), 2) if avg_session_duration_raw else 0.0

        # Append to result list
        result["device_engagement"].append({
            "deviceCategory": device_category,
            "sessions": sessions,
            "engagementRate": engagement_rate_pct,
            "averageSessionDuration": avg_session_duration_sec,
        })

    # Return data
    return result