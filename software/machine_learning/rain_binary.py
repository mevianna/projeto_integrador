"""
***************************************************************************
 * File name: final_dataset_rain_binary.py
 * Description: Preprocessing script to generate the final binary rain dataset
 *              used in downstream machine learning models.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * *************************************************************************** 
 * Description:
 * This script loads a historical weather dataset containing precipitation
 * values, cleans and converts the precipitation column, and produces a new
 * binary target variable ("rain") indicating whether precipitation occurred.
 * The script outputs a clean, ready-to-use CSV dataset for model training.
 *
 * Workflow:
 * 1. Load the input dataset:
 *        - datetime timestamps
 *        - precipitation measurements (precip_mm)
 *        - other weather attributes
 * 2. Clean the precip_mm column:
 *        - Strip whitespace
 *        - Convert values to float
 * 3. Create a binary rain column:
 *        - rain = 1 when precip_mm > 0
 *        - rain = 0 otherwise
 * 4. Save the processed dataset as "final_dataset_rain_binary.csv".
 * 5. Print the first few rows for inspection.
 *
 * Input file:
 *   - "cloudcover_inmet_3_years.csv"
 *       Required columns:
 *         - datetime (parseable)
 *         - precip_mm (string or numeric)
 *         - additional weather features (any)
 *
 * Output file:
 *   - "final_dataset_rain_binary.csv": cleaned dataset with binary target
 *   - Console preview of the processed DataFrame (`df.head()`)
 *
 * Requirements:
 *   - Python 3.10+
 *   - pandas >= 1.5
 ***************************************************************************/
"""

import pandas as pd

# Load input dataset
df = pd.read_csv("cloudcover_inmet_3_years_merged.csv", parse_dates=["datetime"])

# Clean and convert precipitation
df["precip_mm"] = df["precip_mm"].astype(str).str.strip().astype(float)

# Create binary rain column
df["rain"] = (df["precip_mm"] > 0).astype(int)

# Save final processed dataset
df.to_csv("final_dataset_rain_binary.csv", index=False)

print(df.head())
