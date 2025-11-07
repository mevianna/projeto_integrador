import sys
import json
import xgboost as xgb
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_xgb.json")

features = [1000, 20, 85, 10, 180, 100]

try:
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
except Exception as e:
    print(json.dumps({"error": f"Erro ao carregar modelo: {e}"}))
    sys.exit(1)

try:
    pred_prob = model.predict_proba([features])
    print(json.dumps({"prediction": pred_prob.tolist()}))
except Exception as e:
    print(json.dumps({"error": f"Erro ao predizer: {e}"}))
    sys.exit(1)