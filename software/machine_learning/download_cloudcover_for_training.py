"""
***************************************************************************
 * File name: download_cloudcover_training.py
 * Description: Script to download hourly cloud cover data from the 
 *              Open-Meteo historical API and save it as a CSV file.
 * Author: Maria Eduarda Vianna
 * Creation date: 10-05-2025
 * Last modified: 11-27-2025
 * Contact: mewmvianna@gmail.com
 * ***************************************************************************
 * Description:
 * This script fetches one full year of hourly cloud-cover data from the
 * Open-Meteo Archive API.  It was used to
 * download the datasets for the years 2022, 2023, and 2024 by adjusting
 * the start_date and end_date parameters.
 *
 * Workflow:
 * 1. Define the API endpoint with:
 *        - latitude & longitude  
 *        - start_date & end_date  
 *        - hourly variables (cloudcover)  
 *        - timezone
 * 2. Send an HTTP GET request to the API.
 * 3. Parse the returned JSON data.
 * 4. Extract hourly timestamps and cloud-cover values into a DataFrame.
 * 5. Save the output to "cloudcover_2022.csv".
 * 6. Print a confirmation message.
 *
 * Inputs:
 *   - None (data is obtained directly from the API).
 *
 * Outputs:
 *   - "cloudcover_2022.csv": CSV file saved in the same folder as this script,
 *       containing:
 *           - datetime (ISO timestamps)
 *           - cloudcover (0–100%)
 *
 *   - The same script was also used to generate "cloudcover_2023.csv" and
 *     "cloudcover_2024.csv" by adjusting only the start_date and end_date.
 *
 * Requirements:
 *   - Python 3.8+
 *   - Libraries:
          - os
 *        - requests
 *        - pandas
 ***************************************************************************
"""
import os
import requests
import pandas as pd

# Prints the current working directory (where Python is running from)
print("Working directory:", os.getcwd())

# URL for the API
url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=-28.951476920243184&longitude=-49.4671919955338"
    "&start_date=2022-01-01&end_date=2022-12-31"
    "&hourly=cloudcover&timezone=UTC"
)

# Send request
response = requests.get(url)
data = response.json()

# Extract cloud cover data
df = pd.DataFrame({
    "datetime": data["hourly"]["time"],
    "cloudcover": data["hourly"]["cloudcover"]
})

# Save to CSV in the same folder as the script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "cloudcover_2022.csv")

# Save to CSV
df.to_csv(output_path, index=False)
print("cloudcover_2022.csv saved!")