import sys
import json
import xgboost as xgb
import os

# Caminho absoluto para o modelo na mesma pasta que o script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_xgb.bin")  # ou .json se estiver em JSON

# Lê a entrada do Node (features)
try:
    input_str = sys.stdin.read()
    data = json.loads(input_str)
    features = data["features"]
except Exception as e:
    print(json.dumps({"error": f"Erro ao ler entrada: {e}"}))
    sys.exit(1)

# Carrega o modelo
try:
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
except Exception as e:
    print(json.dumps({"error": f"Erro ao carregar modelo: {e}"}))
    sys.exit(1)

# Faz a predição
try:
    pred_prob = model.predict_proba([features])
    print(json.dumps({"prediction": pred_prob.tolist()}))
except Exception as e:
    print(json.dumps({"error": f"Erro ao predizer: {e}"}))
    sys.exit(1)