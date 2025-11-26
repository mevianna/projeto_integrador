"""
***************************************************************************
 * File name: binary_rain.py
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
 * 1. Load the original dataset containing:
 *        - datetime timestamps
 *        - precipitation measurements (precip_mm)
 *        - other weather attributes
 * 2. Clean the precip_mm column:
 *        - Strip whitespace
 *        - Convert values to float
 * 3. Create a binary rain column:
 *        - rain = 1 when precip_mm > 0
 *        - rain = 0 otherwise
 * 4. Save the processed dataset as "dataset_final_rain_binario.csv".
 * 5. Print the first few rows for inspection.
 *
 * Inputs:
 *   - CSV file: "cloudcover_e_inmet_3_anos.csv"
 *       Required columns:
 *         - datetime (parseable)
 *         - precip_mm (string or numeric)
 *         - additional weather features (any)
 *
 * Outputs:
 *   - "dataset_final_rain_binario.csv": cleaned dataset with binary target
 *   - Console preview of the processed DataFrame (`df.head()`)
 *
 * Requirements:
 *   - Python 3.10+
 *   - pandas >= 1.5
 ***************************************************************************/
"""

import pandas as pd

df = pd.read_csv("cloudcover_e_inmet_3_anos.csv", parse_dates=["datetime"])

# Remove empty spaces and convert to Float
df["precip_mm"] = df["precip_mm"].astype(str).str.strip().astype(float)

# Creation of the colum "binary rain"
df["rain"] = (df["precip_mm"] > 0).astype(int)

df.to_csv("dataset_final_rain_binario.csv", index=False)

print(df.head())

