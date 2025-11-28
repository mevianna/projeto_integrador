"""
***************************************************************************
 * File name: merge_cloudcover_and_inmet_3_years.py
 * Description: Script to merge the cleaned INMET dataset (2022–2024) with the
 *              combined cloud cover dataset from Open-Meteo, aligning both
 *              by timestamp and producing a unified three-year dataset.
 *
 * Overview:
 * This script loads:
 *     - inmet_3_years.csv       -> cleaned meteorological observations from INMET  
 *     - cloudcover_3_years.csv  -> multi-year cloud-cover data from Open-Meteo  
 *
 * Both datasets contain an aligned timestamp column (`datetime`), enabling a
 * precise temporal merge to create a single hourly dataset. Only timestamps
 * present in *both* datasets are preserved (inner join).
 *
 * Workflow:
 * 1. Load the 3-year INMET dataset.
 * 2. Load the 3-year cloud-cover dataset.
 * 3. Merge both DataFrames on the `datetime` column using an inner join.
 * 4. Sort chronologically for consistency.
 * 5. Save the final combined dataset as cloudcover_inmet_3_years_merged.csv.
 * 6. Print the first few rows for verification.
 *
 * Input files (included in this folder):
 *   - inmet_3_years.csv
 *   - cloudcover_3_years.csv
 *
 * Output file:
 *   - cloudcover_inmet_3_years_merged.csv
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
***************************************************************************
"""

import pandas as pd
from pathlib import Path

# ======================================================================
# SCRIPT TO MERGE CLOUDCOVER + INMET (2022–2024)
# ======================================================================

# Get the directory where this script is located
BASE_DIR = Path(__file__).parent

print("--- Reading files ---")
df_inmet = pd.read_csv(BASE_DIR / "inmet_3_years.csv", parse_dates=["datetime"])
df_cloud = pd.read_csv(BASE_DIR / "cloudcover_3_years.csv", parse_dates=["datetime"])

# Merge by datetime (inner = only where both datasets have data)
df = pd.merge(df_inmet, df_cloud, on="datetime", how="inner")

# Sort just to ensure correct ordering
df = df.sort_values("datetime").reset_index(drop=True)

# Save final merged file in the same folder as this script
output_filename = BASE_DIR / "cloudcover_inmet_3_years_merged.csv"
df.to_csv(output_filename, index=False)

print(f"--- File saved: {output_filename.name} ---")
print(df.head())
