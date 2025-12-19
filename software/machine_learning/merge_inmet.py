"""
***************************************************************************
 * File name: merge_inmet_3_years.py
 * Description: Script to read, clean, merge, and standardize INMET weather 
 *              data for the years 2022–2024, producing a unified 
 *              chronological dataset with consistent column names.
 * Author:
 * Creation date:
 * Last modified:
 * Contact:
 * ***************************************************************************
 * Overview:
 * This script processes three annual CSV files from the INMET automatic 
 * weather station in Araranguá (A867). INMET raw files contain repeated 
 * header lines, mixed separators, and non-standard formats, so the script 
 * performs header cleaning, datetime reconstruction, column renaming, 
 * and chronological ordering before exporting a clean dataset.
 *
 * Workflow:
 * 1. Define the input INMET files for 2022, 2023, and 2024.
 * 2. Read each file using:
 *        - semicolon separator  
 *        - comma as decimal separator  
 *        - all values as strings (to avoid parsing issues)
 * 3. Remove spurious header lines that appear inside the file.
 * 4. Build a proper `datetime` column by combining “Data” + “Hora UTC”.
 * 5. Concatenate the yearly DataFrames.
 * 6. Sort the full dataset chronologically.
 * 7. Select the relevant meteorological variables 
 *    (precipitation, pressure, temperature, humidity, wind).
 * 8. Standardize column names.
 * 9. Export the cleaned dataset for downstream processing.
 *
 * Input files (included in this folder):
 *   - INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv
 *   - INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv
 *   - INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv
 *
 * Output:
 *   - inmet_3_years.csv (cleaned and standardized dataset)
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
***************************************************************************
"""

import pandas as pd
from pathlib import Path

# ======================================================================
# SETUP
# ======================================================================

# Directory where this script is located
BASE_DIR = Path(__file__).parent

print("--- Reading and cleaning INMET files ---")

# Input files (read from the same folder as this script)
inmet_files = [
    BASE_DIR / "INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv",
    BASE_DIR / "INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv",
    BASE_DIR / "INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv"
]

dfs = []

# ======================================================================
# PROCESS EACH YEAR
# ======================================================================

for file in inmet_files:
    # Read fully as text to avoid parsing mistakes
    df = pd.read_csv(file, sep=";", decimal=",", dtype=str)

    # Remove repeated header lines inside the file
    df = df[df["Data"] != "Data"]

    # Create proper datetime
    df["datetime"] = pd.to_datetime(
        df["Data"] + " " + df["Hora UTC"].str.replace(" UTC", ""),
        format="%Y/%m/%d %H%M"
    )

    dfs.append(df)

# ======================================================================
# CONCATENATE + SORT
# ======================================================================

df_inmet = pd.concat(dfs, ignore_index=True)
df_inmet = df_inmet.sort_values("datetime").reset_index(drop=True)

# ======================================================================
# SELECT AND RENAME COLUMNS
# ======================================================================

keep = {
    "PRECIPITACAO TOTAL, HORARIO (mm)": "precip_mm",
    "PRESSAO ATMOSFERICA AO NIVEL DA ESTACAO, HORARIA (mB)": "pressure_mB",
    "TEMPERATURA DO AR - BULBO SECO, HORARIA (graus C)": "temp_C",
    "UMIDADE RELATIVA DO AR, HORARIA (%)": "rh_pct",
    "VENTO, DIRECAO HORARIA (gr) ( (gr))": "wind_dir_deg",
    "VENTO, VELOCIDADE HORARIA (m/s)": "wind_speed_m_s"
}

df_inmet = df_inmet[["datetime"] + list(keep.keys())]
df_inmet = df_inmet.rename(columns=keep)

# ======================================================================
# CONVERT STRINGS TO FLOATS
# ======================================================================

for col in ["pressure_mB", "temp_C", "wind_speed_m_s"]:
    df_inmet[col] = (
        df_inmet[col]
        .astype(str)
        .str.replace(",", ".", regex=False)
        .replace("", "0")
        .astype(float)
    )

df_inmet["precip_mm"] = (
    df_inmet["precip_mm"]
    .astype(str)
    .str.strip()
    .replace(r'^,', '0,', regex=True)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# ======================================================================
# SAVE OUTPUT IN THE SAME FOLDER
# ======================================================================

output_file = BASE_DIR / "inmet_3_years.csv"
df_inmet.to_csv(output_file, index=False)

print(f"--- File saved: {output_file.name} ---")
print(df_inmet.head())
