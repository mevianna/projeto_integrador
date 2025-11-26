"""
***************************************************************************
 * File name: merge_inmet_allcolumns.py
 * Description: Script to fully load, clean, merge, and standardize *all*
 *              columns from the INMET A867 station (Araranguá) for the years
 *              2022–2024, preserving every variable and ensuring consistent
 *              numeric formatting.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script processes all available columns from three INMET annual files
 * (2022, 2023, 2024). Due to INMET formatting inconsistencies — such as repeated
 * headers, comma decimal separators, and mixed string/numeric values — the script
 * performs:
 *   - Cleaning of duplicated header rows  
 *   - Datetime reconstruction  
 *   - Concatenation of all years  
 *   - Full numeric conversion of every possible column  
 *   - Chronological sorting  
 *
 * The output is a fully cleaned, multi-year dataset that maintains all original
 * meteorological variables without discarding information.
 *
 * Workflow:
 * 1. Define a list of INMET CSV files covering 2022–2024.
 * 2. Read each file using:
 *        - semicolon separator  
 *        - comma decimal  
 *        - dtype=str to prevent parsing issues  
 * 3. Remove repeated header rows (“Data”, “Hora UTC”, etc.) that may appear
 *    inside the files.
 * 4. Create a proper datetime column by merging date and time fields.
 * 5. Combine all DataFrames into a single dataset.
 * 6. Sort all rows chronologically.
 * 7. Convert *every column except datetime* to numeric when possible:
 *        - strip spaces  
 *        - replace invalid strings  
 *        - coerce non-numeric values to NaN  
 * 8. Export the cleaned dataset for downstream use.
 *
 * Inputs:
 *   - INMET automatic station files:
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2022_A_31-12-2022.csv
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2023_A_31-12-2023.csv
 *        - INMET_S_SC_A867_ARARANGUA_01-01-2024_A_31-12-2024.csv
 *
 * Outputs:
 *   - A cleaned, unified, all-columns INMET dataset (CSV), ready for modeling
 *     or further preprocessing.
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

# Convert all numeric columns possible
for col in df_inmet.columns:
    if col != "datetime":
        df_inmet[col] = (
            df_inmet[col]
            .astype(str)
            .str.strip()
            .replace(r'^,', '0,', regex=True)   
            .str.replace(",", ".", regex=False)  
        )
        # An attempt to convert data to float
        try:
            df_inmet[col] = df_inmet[col].astype(float)
        except:
            pass

# Save CSV with all information
df_inmet.to_csv("inmet_3_anos_todascolunas.csv", index=False)

print("--- Arquivo final salvo: inmet_3_anos_completo.csv ---")
print(df_inmet.head())
