export interface MissingDataStats {
  missing_days_count: number;
  total_days_count: number;
  missing_percentage: number;
  parameters_with_gaps: string[];
}

export interface DailyClimateRecord {
  date: string;
  t2m: number | null;
  t2m_max: number | null;
  t2m_min: number | null;
  prectotcorr: number | null;
  rh2m: number | null;
  allsky_sfc_sw_dwn: number | null;
}

export interface MonthlyAggregate {
  month: string;
  days_in_month: number;
  valid_days: number;
  t2m_mean: number | null;
  t2m_max_mean: number | null;
  t2m_min_mean: number | null;
  prectotcorr_sum: number | null;
  prectotcorr_daily_mean: number | null;
  rh2m_mean: number | null;
  allsky_sfc_sw_dwn_mean: number | null;
}

export interface OverallAggregate {
  total_days: number;
  t2m_mean: number | null;
  t2m_max_mean: number | null;
  t2m_min_mean: number | null;
  prectotcorr_sum: number | null;
  prectotcorr_daily_mean: number | null;
  rh2m_mean: number | null;
  allsky_sfc_sw_dwn_mean: number | null;
}

export interface ClimateSummary {
  source: string;
  dataset_or_endpoint: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  parameters: string[];
  parameter_units: Record<string, string>;
  retrieved_at: string;
  missing_data: MissingDataStats;
  coverage_note: string;
  is_demo_data: boolean;
  overall: OverallAggregate;
  monthly: MonthlyAggregate[];
}

export interface ClimateHistory {
  source: string;
  dataset_or_endpoint: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  parameters: string[];
  parameter_units: Record<string, string>;
  retrieved_at: string;
  missing_data: MissingDataStats;
  coverage_note: string;
  is_demo_data: boolean;
  records: DailyClimateRecord[];
}
