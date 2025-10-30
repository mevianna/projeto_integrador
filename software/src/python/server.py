import sys
import json
import xgboost as xgb
import numpy as np

try:
    input_str = sys.stdin.read()
    data = json.loads(input_str)
    features = data["features"]
except Exception as e:
    print(json.dumps({"error": f"Erro ao ler entrada: {e}"}))
    sys.exit(1)

try:
    model = xgb.XGBClassifier()
    model.load_model("../../../machine_learning_2/modelo_xgb.bin")
except Exception as e:
    print(json.dumps({"error": f"Erro ao carregar modelo: {e}"}))
    sys.exit(1)

except Exception as e:
    print(json.dumps({"error": f"Erro ao carregar modelo: {str(e)}"}))
    sys.exit(1)

# lê features do stdin
input_str = sys.stdin.read()
data = json.loads(input_str)
features = data["features"]

# prediz
pred_prob = model.predict_proba([features])
print(json.dumps({"prediction": pred_prob.tolist()}))