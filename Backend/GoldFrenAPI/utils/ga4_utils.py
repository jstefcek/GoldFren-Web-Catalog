# Google Analytics 4 - Utilites
# ------------------------------------------------------------------

# Libraries
# ------------------------------------------------------------------
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest, FilterExpression, Filter, OrderBy

# Functions
# ------------------------------------------------------------------
def prepare_request(property_id: str, 
                    dimension_name: str, 
                    metrics_name: str, 
                    start_date: str, 
                    end_date: str,
                    limit: int) -> RunReportRequest:
    """
    Function would prepare request, that would be called inside GA4 API
    
    Params: 
        GA4_PROPERTY_ID (str): GA4 unique ID
        dimension_name (str): Name of the dimension we are calling
        metrics_name (str): Name of the metrics we want to get
        start_date (str): From which date we want to get metric
        limit (int): Limit how many records would be returned
    """
    # Prepare request object
    req = RunReportRequest(
        property=f"properties/{property_id}",
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        dimensions=[Dimension(name=dimension_name)],
        metrics=[Metric(name=metrics_name)],
        order_bys=[
            OrderBy(metric=OrderBy.MetricOrderBy(metric_name=metrics_name),
                    desc=True,
            )
        ],
        limit=limit,
    )
    
    # Return prepared request
    return req