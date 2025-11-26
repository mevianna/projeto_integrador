"""
***************************************************************************
 * File name: merge_cloudcover_and_inmet_3_years.py
 * Description: Script to merge the cleaned INMET dataset (2022–2024) with the
 *              combined cloud cover dataset from Open-Meteo, aligning both
 *              by timestamp and producing a unified three-year dataset.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Overview:
 * This script loads:
 *     - inmet_3_anos.csv  -> cleaned meteorological observations from INMET  
 *     - cloudcover_3_anos.csv -> multi-year cloud-cover data from Open-Meteo  
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
 * 5. Save the final combined dataset as cloudcover_e_inmet_3_anos.csv.
 * 6. Print the first few rows for verification.
 *
 * Input files:
 *   - inmet_3_anos.csv
 *   - cloudcover_3_anos.csv
 *
 * Output file:
 *   - cloudcover_e_inmet_3_anos.csv
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
***************************************************************************
"""
# IMPORTS
import pandas as pd

print("--- Lendo arquivos ---")
df_inmet = pd.read_csv("inmet_3_anos.csv", parse_dates=["datetime"])
df_cloud = pd.read_csv("cloudcover_3_anos.csv", parse_dates=["datetime"])

# Merge data
df = pd.merge(df_inmet, df_cloud, on="datetime", how="inner")

# Organize values
df = df.sort_values("datetime").reset_index(drop=True)

# Save final file
df.to_csv("cloudcover_e_inmet_3_anos.csv", index=False)

print("--- Arquivo salvo: cloudcover_e_inmet_3_anos.csv ---")
print(df.head())
