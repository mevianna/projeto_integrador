""" 
* **************************************************************************
* File name: server.py
* Description: Prediction script using an XGBoost model.
*
* Author: Rafaela Fernandes Savaris
* Creation date: 10/29/2025
* Last modification: 10/29/2025
* Contact: savarisf.rafaela@gmail.com
* **************************************************************************
* Description:
* This script reads JSON data from standard input (`stdin`), loads a trained
* model (`modelo_xgb.json`), and returns the prediction probability in JSON format.
*
* Flow:
* 1. Reads and validates the input data.
* 2. Loads the XGBoost model from the specified path.
* 3. Executes the prediction and returns the probability.
* 
* Inputs:
*    - JSON via stdin, with the key "features" containing the list of attributes.
*
* Outputs:
*    - JSON with the key "prediction", containing the probabilities.
*    - In case of error, JSON with the key "error" and the error description.
*
* Error handling:
*    - Invalid input reading: prints {"error": "..."} and exits with code 1.
*    - Failure to load model: prints {"error": "..."} and exits with code 1.
*    - Prediction failure: prints {"error": "..."} and exits with code 1.
* 
* Requirements:
*   - Python 3.13.1
*   - Libraries:
*       - json: works with JSON data;
*       - os: interacts with the operating system;
*       - sys: handles the execution environment and input/output;
*       - xgboost: implements the XGBoost algorithm.
* **************************************************************************
"""

import json
import os
import sys
import xgboost as xgb

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_xgb.json")

# Reads input data and extracts features
try:
    input_str = sys.stdin.read()
    data = json.loads(input_str)
    features = data["features"]
except Exception as e:
    print(json.dumps({"error": f"Erro ao ler entrada: {e}"}))
    sys.exit(1)

# Loads the XGBoost model saved at the specified location
try:
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
except Exception as e:
    print(json.dumps({"error": f"Erro ao carregar modelo: {e}"}))
    sys.exit(1)

# Performs prediction and returns the result in JSON format
try:
    pred_prob = model.predict_proba([features])
    print(json.dumps({"prediction": pred_prob.tolist()}))
except Exception as e:
    print(json.dumps({"error": f"Erro ao predizer: {e}"}))
    sys.exit(1)