"""
***************************************************************************
 * File name: merge_cloudcover.py
 * Description: Script to load, combine, sort, and export multiple years of
 *              cloud-cover data into a single consolidated dataset.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script reads three separate CSV files containing hourly cloud-cover
 * measurements for different years, merges them into a single DataFrame,
 * sorts the data chronologically, and saves the final dataset as a new CSV.
 * It also prints summary information about the combined dataset.
 *
 * Workflow:
 * 1. Define a list of input CSV files (one per year).
 * 2. Load each file into a DataFrame and store them in a list.
 * 3. Concatenate all DataFrames into a single structure.
 * 4. Convert the datetime column to a proper datetime type.
 * 5. Sort the entire dataset chronologically.
 * 6. Save the final merged dataset to "cloudcover_3_anos.csv".
 * 7. Display:
 *        - Total number of combined rows  
 *        - First records  
 *        - Last records  
 *
 * Inputs:
 *   - CSV files:
 *        - cloudcover_2022.csv
 *        - cloudcover_2023.csv
 *        - cloudcover_2024.csv
 *
 * Outputs:
 *   - "cloudcover_3_anos.csv": a 3-year combined cloud-cover dataset
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
 ***************************************************************************
"""
# IMPORTS
import pandas as pd

files = ["cloudcover_2022.csv", "cloudcover_2023.csv", "cloudcover_2024.csv"]

lista_de_dataframes = []

print("Lendo e combinando os arquivos de nuvens...")
for file in files:
    df = pd.read_csv(file)
    lista_de_dataframes.append(df)

# Merge all dataframes in just one dataframe
df_nuvens_combinado = pd.concat(lista_de_dataframes, ignore_index=True)

# Organize data by date
df_nuvens_combinado['datetime'] = pd.to_datetime(df_nuvens_combinado['datetime'])
df_nuvens_combinado = df_nuvens_combinado.sort_values(by='datetime')

# Save the result on a new CSV
output_filename = "cloudcover_3_anos.csv"
df_nuvens_combinado.to_csv(output_filename, index=False)

print(f"\nArquivo '{output_filename}' criado com sucesso!")
print(f"Total de registros combinados: {len(df_nuvens_combinado)}")
print("\nInício dos dados combinados:")
print(df_nuvens_combinado.head())
print("\nFinal dos dados combinados:")
print(df_nuvens_combinado.tail())