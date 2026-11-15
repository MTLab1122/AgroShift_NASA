from typing import List, Optional
from collections import defaultdict
from app.modules.nasa_data.schemas import DailyClimateRecord, MonthlyAggregate, OverallAggregate

def calc_mean(values: List[Optional[float]]) -> Optional[float]:
    valid = [v for v in values if v is not None]
    if not valid:
        return None
    return round(sum(valid) / len(valid), 2)

def calc_sum(values: List[Optional[float]]) -> Optional[float]:
    valid = [v for v in values if v is not None]
    if not valid:
        return None
    return round(sum(valid), 2)

def compute_monthly_aggregates(records: List[DailyClimateRecord]) -> List[MonthlyAggregate]:
    """
    Groups records by YYYY-MM and calculates monthly stats.
    Never substitutes missing values with 0.
    """
    month_groups = defaultdict(list)
    for r in records:
        month_key = r.date[:7]
        month_groups[month_key].append(r)

    aggregates: List[MonthlyAggregate] = []
    for month in sorted(month_groups.keys()):
        group = month_groups[month]
        total_days = len(group)
        
        # Valid days where at least T2M is not None
        valid_days = sum(1 for r in group if r.t2m is not None)
        
        t2m_vals = [r.t2m for r in group]
        t2m_max_vals = [r.t2m_max for r in group]
        t2m_min_vals = [r.t2m_min for r in group]
        prec_vals = [r.prectotcorr for r in group]
        rh_vals = [r.rh2m for r in group]
        rad_vals = [r.allsky_sfc_sw_dwn for r in group]

        aggregates.append(
            MonthlyAggregate(
                month=month,
                days_in_month=total_days,
                valid_days=valid_days,
                t2m_mean=calc_mean(t2m_vals),
                t2m_max_mean=calc_mean(t2m_max_vals),
                t2m_min_mean=calc_mean(t2m_min_vals),
                prectotcorr_sum=calc_sum(prec_vals),
                prectotcorr_daily_mean=calc_mean(prec_vals),
                rh2m_mean=calc_mean(rh_vals),
                allsky_sfc_sw_dwn_mean=calc_mean(rad_vals),
            )
        )
    return aggregates

def compute_overall_aggregate(records: List[DailyClimateRecord]) -> OverallAggregate:
    """
    Calculates overall summary stats for the whole query period.
    """
    total_days = len(records)
    if total_days == 0:
        return OverallAggregate(
            total_days=0,
            t2m_mean=None,
            t2m_max_mean=None,
            t2m_min_mean=None,
            prectotcorr_sum=None,
            prectotcorr_daily_mean=None,
            rh2m_mean=None,
            allsky_sfc_sw_dwn_mean=None
        )

    t2m_vals = [r.t2m for r in records]
    t2m_max_vals = [r.t2m_max for r in records]
    t2m_min_vals = [r.t2m_min for r in records]
    prec_vals = [r.prectotcorr for r in records]
    rh_vals = [r.rh2m for r in records]
    rad_vals = [r.allsky_sfc_sw_dwn for r in records]

    return OverallAggregate(
        total_days=total_days,
        t2m_mean=calc_mean(t2m_vals),
        t2m_max_mean=calc_mean(t2m_max_vals),
        t2m_min_mean=calc_mean(t2m_min_vals),
        prectotcorr_sum=calc_sum(prec_vals),
        prectotcorr_daily_mean=calc_mean(prec_vals),
        rh2m_mean=calc_mean(rh_vals),
        allsky_sfc_sw_dwn_mean=calc_mean(rad_vals),
    )
