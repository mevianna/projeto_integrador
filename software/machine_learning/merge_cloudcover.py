"""
***************************************************************************
 * File name: merge_cloudcover.py
 * Description: Script that loads the hourly cloud-cover CSV files for 
 *              three separate years, merges them into a single dataset,
 *              sorts the records chronologically, and saves the final
 *              combined output in the same directory as this script.
 *
 * Author: Maria Eduarda Vianna
 * Creation date: 10-05-2025
 * Last modified: 11-28-2025
 * Contact: mewmvianna@gmail.com
 * *************************************************************************
 * Description:
 * This script reads three CSV files containing hourly cloud-cover data 
 * for the years 2022, 2023, and 2024. It concatenates them into a single 
 * pandas DataFrame, converts the timestamps to datetime objects, sorts 
 * them in chronological order, and exports the final combined dataset as 
 * "cloudcover_3_years.csv".
 *
 * Workflow:
 * 1. Define a list containing the input CSV filenames.
 * 2. Load each CSV into an individual DataFrame.
 * 3. Concatenate all DataFrames into one structure.
 * 4. Convert the 'datetime' column into a proper datetime type.
 * 5. Sort the full dataset chronologically.
 * 6. Save the final merged dataset to "cloudcover_3years.csv" in the same 
 *    directory where this script is located.
 * 7. Display:
 *        - Total number of combined rows
 *        - First few records
 *        - Last few records
 *
 * Inputs:
 *   - The following CSV files must be located in the same folder as this script:
 *        - cloudcover_2022.csv
 *        - cloudcover_2023.csv
 *        - cloudcover_2024.csv
 *
 * Outputs:
 *   - "cloudcover_3_years.csv": consolidated 3-year cloud-cover dataset.
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
 ***************************************************************************
"""

import os
import pandas as pd

# List with the names of the files
files = ["cloudcover_2022.csv", "cloudcover_2023.csv", "cloudcover_2024.csv"]

# List to store the data from each file
dataframes_list = []

print("Reading and merging cloud cover files...")
for file in files:
    df = pd.read_csv(file)
    dataframes_list.append(df)

# Merge all dataframes into one
combined_cloudcover_df = pd.concat(dataframes_list, ignore_index=True)

# Ensure datetime is properly sorted
combined_cloudcover_df["datetime"] = pd.to_datetime(combined_cloudcover_df["datetime"])
combined_cloudcover_df = combined_cloudcover_df.sort_values(by="datetime")

# Save in the same folder as the script
output_filename = "cloudcover_3_years.csv"
script_dir = os.path.dirname(os.path.abspath(__file__))   # folder of the script
output_path = os.path.join(script_dir, output_filename)   # final path

combined_cloudcover_df.to_csv(output_path, index=False)

print(f"\nFile '{output_filename}' created successfully!")
print(f"Saved at: {output_path}")
print(f"Total combined records: {len(combined_cloudcover_df)}")
print("\nBeginning of combined data:")
print(combined_cloudcover_df.head())
print("\nEnd of combined data:")
print(combined_cloudcover_df.tail())
