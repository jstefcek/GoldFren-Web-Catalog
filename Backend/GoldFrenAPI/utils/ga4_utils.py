# Google Analytics 4 - Utilites
# ------------------------------------------------------------------

# Libraries
# ------------------------------------------------------------------
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest, OrderBy
from datetime import datetime, timedelta

# Functions
# ------------------------------------------------------------------
def prepare_request(property_id: str, 
                    dimension_name: str, 
                    metrics_name: list[str],
                    start_date: str, 
                    end_date: str,
                    order_by_metric: str | None = None,
                    limit: int | None = None,
                    order_by_dimension: bool = False,
                    desc: bool = True,
                    ) -> RunReportRequest:
    """
    Function would prepare request, that would be called inside GA4 API
    
    Params: 
        property_id (str): GA4 unique ID
        dimension_name (str): Name of the dimension we are calling
        metrics_name (List[str]): List of metrics to get from dimension
        start_date (str): From which date we want to get metric
        end_date (str): To which date we want to get metric
        limit (int): Limit how many records would be returned
        order_by_dimension (bool): Whetere the data should be order by dimension itself (default = True)
        desc (bool): If the data should be ordered by descending (default = False)
    """
    # Prepare order by metric
    order_bys: list[OrderBy] = []
    if order_by_dimension:
        order_bys.append(
            OrderBy(
                dimension=OrderBy.DimensionOrderBy(dimension_name=dimension_name),
                desc=desc,
            )
        )
    # Otherwise order by metric (only if provided)
    elif order_by_metric:
        order_bys.append(
            OrderBy(
                metric=OrderBy.MetricOrderBy(metric_name=order_by_metric),
                desc=desc,
            )
        )
            
    # Optionaly add limit
    if limit and limit > 0:
        limit = limit

    # Build request kwargs
    req_kwargs = {
        "property": f"properties/{property_id}",
        "date_ranges": [DateRange(start_date=start_date, end_date=end_date)],
        "dimensions": [Dimension(name=dimension_name)],
        "metrics": [Metric(name=m) for m in metrics_name],
        "order_bys": order_bys,
    }

    # Optionally include limit
    if isinstance(limit, int) and limit > 0:
        req_kwargs["limit"] = limit
    
    # Return prepared request
    return RunReportRequest(**req_kwargs)