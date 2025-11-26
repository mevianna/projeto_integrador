"""
***************************************************************************
 * File name: count_nans_allcolumns.py
 * Description: Script to analyze missing values (NaNs) across all columns in the
 *              combined INMET 3-year dataset, reporting both absolute counts and
 *              percentage of missing data per column.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script inspects the dataset `inmet_3_anos_todascolunas.csv` and calculates:
 *     - total number of missing values per column  
 *     - percentage of missing values relative to dataset size  
 *     - a sorted table (descending) to easily identify fields with more gaps  
 *
 * The output is printed as a pandas DataFrame, allowing quick diagnostics of
 * data quality before feature engineering or machine learning.
 *
 * Workflow:
 * 1. Load the full INMET dataset produced previously.
 * 2. Compute the total NaN count for each column using df.isna().sum().
 * 3. Compute the percentage of missing values relative to the dataset length.
 * 4. Combine both into a summary table.
 * 5. Sort the table so columns with the highest proportion of missing data
 *    appear first.
 * 6. Print the result for inspection.
 *
 * Inputs:
 *   - inmet_3_anos_todascolunas.csv : full cleaned/merged INMET dataset.
 *
 * Outputs:
 *   - A printed DataFrame listing missing_count and missing_percent per column.
 *
 * Requirements:
 *   - Python 3.8+
 *   - pandas
***************************************************************************
"""
# IMPORTS
import pandas as pd

df = pd.read_csv("inmet_3_anos_todascolunas.csv")

# Count NaNs
n_missing = df.isna().sum()

# Percentage of NaNs
perc_missing = 100 * n_missing / len(df)

# Uses a Dataframe for better visualization
missing_table = pd.DataFrame({
    "missing_count": n_missing,
    "missing_percent": perc_missing
}).sort_values("missing_percent", ascending=False)

print(missing_table)
