"""
***************************************************************************
 * File name: merge_inmet.py
 * Description: Script to read, clean, merge, and standardize INMET weather 
 *              data for the years 2022–2024, producing a unified chronological
 *              dataset with consistent column names.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script processes three annual CSV files from the INMET automatic 
 * weather station in Araranguá (A867). Because INMET files contain repeated 
 * headers, mixed separators, and non-standard formats, this script performs 
 * cleaning, datetime reconstruction, column renaming, and chronological 
 * ordering before exporting a clean dataset.
 *
 * Workflow:
 * 1. Define the input INMET files for the years 2022, 2023, and 2024.
 * 2. Read each file with:
 *        - semicolon separator  
 *        - comma as decimal separator  
 *        - all values as strings (to avoid parsing issues)
 * 3. Remove spurious header lines that may appear inside the file.
 * 4. Construct a proper datetime column combining “Data” and “Hora UTC”.
 * 5. Concatenate all yearly DataFrames.
 * 6. Sort the final dataset chronologically.
 * 7. Select relevant meteorological variables (precipitation, pressure, 
 *    temperature, humidity, wind speed, etc.).
 * 8. Rename the selected columns to standardized English-friendly names.
 * 9. Export the cleaned dataset for downstream processing.
 *
 * Inputs:
 *   - Raw INMET CSV files:
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv
 *
 * Outputs:
 *   - A cleaned and standardized DataFrame (typically saved to CSV in the 
 *     following steps of the pipeline).
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
***************************************************************************
"""
# IMPORTS
import pandas as pd

print("--- Lendo e processando os arquivos do INMET ---")

inmet_files = [
    "INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv",
    "INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv",
    "INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv"
]

dfs = []
for file in inmet_files:
    # Read as text to evade problems
    df = pd.read_csv(file, sep=";", decimal=",", dtype=str)
    
    # Remove possible duplicates
    df = df[df["Data"] != "Data"]

    # create colum datetime by merging Date + Hour
    df["datetime"] = pd.to_datetime(
        df["Data"] + " " + df["Hora UTC"].str.replace(" UTC", ""),
        format="%Y/%m/%d %H%M"
    )

    dfs.append(df)

df_inmet = pd.concat(dfs, ignore_index=True)
df_inmet = df_inmet.sort_values("datetime").reset_index(drop=True)

# Select most relevant columns
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

# Convert strings with commas -> floats
for col in ["pressure_mB", "temp_C", "wind_speed_m_s"]:
    df_inmet[col] = (
        df_inmet[col]
        .astype(str)                   
        .str.replace(",", ".", regex=False) 
        .replace("", "0")              
        .astype(float)                 
    )

# Convert and correct precip_mm
df_inmet["precip_mm"] = (
    df_inmet["precip_mm"]
    .astype(str)
    .str.strip()
    .replace(r'^,', '0,', regex=True)   
    .str.replace(",", ".", regex=False) 
    .astype(float)
)

# Save corrected CSV
df_inmet.to_csv("inmet_3_anos.csv", index=False)

print("--- Arquivo final salvo: inmet_3_anos.csv ---")
print(df_inmet.head())

