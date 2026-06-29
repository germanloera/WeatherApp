// ---------------------------------------------------------------------------
// weather.gov API — Enumerations
// ---------------------------------------------------------------------------

/**
 * 16-point compass direction used in forecast periods.
 * Example: "N", "SSW", "ENE"
 */
export type WindDirection =
  | 'N' | 'NNE' | 'NE' | 'ENE'
  | 'E' | 'ESE' | 'SE' | 'SSE'
  | 'S' | 'SSW' | 'SW' | 'WSW'
  | 'W' | 'WNW' | 'NW' | 'NNW';

/**
 * Temperature unit (deprecated in favor of QuantitativeValue).
 * Example: "F" or "C"
 */
export type TemperatureUnit = 'F' | 'C';

/**
 * Non-diurnal temperature trend for a forecast period.
 * Example: "rising" or "falling"
 */
export type TemperatureTrend = 'rising' | 'falling' | null;

/**
 * Alert severity per CAP specification.
 * Example: "Extreme", "Severe", "Moderate", "Minor", "Unknown"
 */
export type AlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';

/**
 * Alert urgency per CAP specification.
 * Example: "Immediate", "Expected", "Future", "Past", "Unknown"
 */
export type AlertUrgency = 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown';

/**
 * Alert certainty per CAP specification.
 * Example: "Observed", "Likely", "Possible", "Unlikely", "Unknown"
 */
export type AlertCertainty = 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown';

/**
 * Alert status per CAP specification.
 * Example: "Actual", "Exercise", "System", "Test", "Draft"
 */
export type AlertStatus = 'Actual' | 'Exercise' | 'System' | 'Test' | 'Draft';

/**
 * Alert message type per CAP specification.
 * Example: "Alert", "Update", "Cancel", "Ack", "Error"
 */
export type AlertMessageType = 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error';

/**
 * Alert category per CAP specification.
 * Example: "Met", "Geo", "Safety", "Fire", "Health", "Other"
 */
export type AlertCategory =
  | 'Met' | 'Geo' | 'Safety' | 'Security' | 'Rescue'
  | 'Fire' | 'Health' | 'Env' | 'Transport' | 'Infra'
  | 'CBRNE' | 'Other';

/**
 * Recommended response type from alert.
 * Example: "Shelter", "Evacuate", "Prepare", "Monitor", "None"
 */
export type AlertResponse =
  | 'Shelter' | 'Evacuate' | 'Prepare' | 'Execute'
  | 'Avoid' | 'Monitor' | 'Assess' | 'AllClear' | 'None';

/**
 * Alert scope per CAP specification.
 * Example: "Public", "Restricted", "Private"
 */
export type AlertScope = 'Public' | 'Restricted' | 'Private';

/**
 * Quality control flag from MADIS.
 * Ref: https://madis.ncep.noaa.gov/madis_sfc_qc_notes.shtml
 * Example: "Z" (passed all QC), "V" (failed gross), "X" (failed spatial)
 */
export type QualityControlFlag = 'Z' | 'C' | 'S' | 'V' | 'X' | 'Q' | 'G' | 'B' | 'T';

/**
 * MADIS sky-coverage code.
 * Example: "CLR", "FEW", "SCT", "BKN", "OVC"
 */
export type MetarSkyCoverage = string;

/**
 * Weather phenomenon enum from the raw grid data.
 * Example: "rain", "snow", "thunderstorms", "fog"
 */
export type WeatherPhenomenon =
  | 'blowing_dust' | 'blowing_sand' | 'blowing_snow'
  | 'drizzle' | 'fog' | 'freezing_fog' | 'freezing_drizzle'
  | 'freezing_rain' | 'freezing_spray' | 'frost' | 'hail'
  | 'haze' | 'ice_crystals' | 'ice_fog' | 'rain' | 'rain_showers'
  | 'sleet' | 'smoke' | 'snow' | 'snow_showers'
  | 'thunderstorms' | 'volcanic_ash' | 'water_spouts';

/**
 * Weather coverage qualifier.
 * Example: "slight_chance", "chance", "likely", "definite", "isolated", "scattered", "numerous", "widespread"
 */
export type WeatherCoverage =
  | 'areas' | 'brief' | 'chance' | 'definite' | 'few'
  | 'frequent' | 'intermittent' | 'isolated' | 'likely'
  | 'numerous' | 'occasional' | 'patchy' | 'periods'
  | 'scattered' | 'slight_chance' | 'widespread';

/**
 * Weather intensity qualifier.
 * Example: "very_light", "light", "moderate", "heavy"
 */
export type WeatherIntensity = 'very_light' | 'light' | 'moderate' | 'heavy';

/**
 * Hazard attributes (e.g. "damaging_wind", "heavy_rain", "tornadoes").
 */
export type WeatherAttribute =
  | 'damaging_wind' | 'dry_thunderstorms' | 'flooding'
  | 'gusty_wind' | 'heavy_rain' | 'large_hail'
  | 'small_hail' | 'tornadoes';

/**
 * Point type (land vs marine).
 * Example: "land", "marine"
 */
export type PointType = 'land' | 'marine';

/**
 * NWS zone type.
 * Example: "land", "marine", "forecast", "county", "fire"
 */
export type NWSZoneType = string;

/**
 * ISO-8601 duration string.
 * Example: "PT3H", "P1DT12H"
 */
export type ISO8601Duration = string;
