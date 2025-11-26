"""
***************************************************************************
 * File name: download_cloudcover_training.py
 * Description: Script to download hourly cloud cover data from the 
 *              Open-Meteo historical API and save it as a CSV file.
 * Author: 
 * Creation date: 
 * Last modified: 
 * Contact: 
 * ***************************************************************************
 * Description:
 * This script fetches one full year of hourly cloud-cover data from the
 * Open-Meteo Archive API using geographical coordinates and a specified
 * date range. The response is converted into a pandas DataFrame and saved
 * locally as a CSV file for later analysis or model training.
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
 *   - "cloudcover_2022.csv": CSV file containing:
 *        - datetime (ISO timestamps)
 *        - cloudcover (0–100%)
 *
 * Requirements:
 *   - Python 3.8+
 *   - Libraries:
 *        - requests
 *        - pandas
 ***************************************************************************
"""
import requests
import pandas as pd

# API URL
url = (
    "https://archive-api.open-meteo.com/v1/archive?"
    "latitude=-28.951476920243184&longitude=-49.4671919955338"
    "&start_date=2022-01-01&end_date=2022-12-31"
    "&hourly=cloudcover&timezone=UTC"
)

# Make requisition
response = requests.get(url)
data = response.json()

# Extract data from Cloudcover
df = pd.DataFrame({
    "datetime": data["hourly"]["time"],
    "cloudcover": data["hourly"]["cloudcover"]
})

# Save on CSV
df.to_csv("cloudcover_2022.csv", index=False)
print("Arquivo cloudcover_2022.csv salvo!")
