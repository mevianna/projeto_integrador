# Estação Meteorológica / Weather Station

---

## PT – Visão Geral

Este projeto tem como objetivo o desenvolvimento de uma estação meteorológica inteligente capaz de coletar, processar e apresentar informações climáticas de forma acessível e integrada. O sistema combina sensores físicos e processamento de dados para oferecer uma visão completa sobre as condições atmosféricas locais.

O projeto é dividido em três módulos principais:

- **Previsão de chuva:** utiliza dados históricos coletados pelo hardware para analisar tendências climáticas e prever a probabilidade de precipitação.  
- **Análise de visibilidade do céu:** avalia a presença de nuvens e fornece uma estimativa de quão claro o céu estará, ideal para observações astronômicas.  
- **Eventos astronômicos:** apresenta fenômenos celestes relevantes e suas datas, permitindo que o usuário se programe para observações.  

Essa integração entre sensores, análise de dados e astronomia busca oferecer uma ferramenta completa para entusiastas e pesquisadores interessados em monitorar o clima e o céu de forma prática e precisa.

---

## Requisitos de Hardware

- Sensores:
  - DHT22;
  - BMP280;
  - LM393;
  - UVM30A;
  - Pluviômetro.
- Microcontrolador:
  - ESP32.
- Jumpers.

- Todos os detalhes específicos de hardware (datasheets, versões dos módulos, conexões de jumpers etc.) estão disponíveis na pasta `hardware` ([clique aqui](hardware/)).

---

## Requisitos de Software

- Linguagens de programação:
  - Python (3.12.7);
  - Javascript (Node.js v22.18.0);
  - HTML;
  - Arduino (C/C++) - https://docs.arduino.cc/language-reference/pt/;
  - CSS.

- Frameworks:
  - Tailwind (3.4.17) - https://tailwindcss.com/docs/installation/using-vite

- Site (Frontend & Backend):
  - Frontend
    - React (18.3.1) - https://react.dev
    - React Router DOM (6.30.1) - https://reactrouter.com/en/main
    - Vite (5.4.19) - https://vitejs.dev/guide/

  - Backend
    - Flask (3.0.3) - https://flask.palletsprojects.com
    - Flask-CORS (6.0.1) - https://flask-cors.readthedocs.io
    - Requests (2.32.3) - https://requests.readthedocs.io
    - BeautifulSoup4 / bs4 (4.12.3) - https://www.crummy.com/software/BeautifulSoup/bs4/doc/

- Machine Learning
    - Pandas (2.2.2) – https://pandas.pydata.org/docs/
    - NumPy (1.26.4) – https://numpy.org/doc/
    - Scikit-learn (1.6.1) – https://scikit-learn.org/stable/
    - XGBoost (3.1.1) – https://xgboost.readthedocs.io/en/stable/python/python_intro.html
    - Matplotlib (3.9.2) – https://matplotlib.org/stable/users/index.html
    - Requests (2.32.3) - https://requests.readthedocs.io

- Sensores:
    - Wire.h - https://www.arduino.cc/en/reference/wire
    - Adafruit_Sensor.h - https://github.com/adafruit/Adafruit_Sensor
    - Adafruit_BMP280.h - https://github.com/adafruit/Adafruit_BMP280_Library
    - DHT.h / DHT_U.h - https://github.com/adafruit/DHT-sensor-library

- Comunicação:
  - WiFi.h - https://docs.arduino.cc/libraries/wifi/;
  - HTTPClient.h - https://docs.arduino.cc/libraries/httpclient/.

- IDE:
  - Arduino IDE - https://www.arduino.cc/en/software/;
  - Visual Studio Code (VS Code) - https://code.visualstudio.com/.

- Microcontrolador ESP32:
  - ESP32 - https://dl.espressif.com/dl/package_esp32_index.json

- Banco de dados:
  - SQLite - https://www.sqlite.org/docs.html

---

## Configuração do Ambiente
### Backend Python

```bash
cd software
pip install -r requirements.txt
```

### Frontend
```bash
cd software
npm install
```

### Machine Learning
```bash
cd software
cd machine_learning_2
pip install -r requirements.txt
```

### ESP
No Arduino IDE, acesse Arquivos > Preferências , cole o link mencionado anteriormente em "URLs Adicionais para Gerenciador de Placa" e instale o pacote da placa ESP32. Em seguida, instale também as bibliotecas necessárias listadas anteriormente.

## Como executar localmente
Para rodar o projeto completo, você precisará de 3 terminais abertos simultaneamente.

Siga a ordem:

Terminal 1: Frontend (Vite)
```bash
cd software
npm run dev
```

Terminal 2: Backend (Server)
```bash
cd software
node server.js
```

Terminal 3: Script Python
```bash
cd software
cd src
cd python
python scraping.py
```

Além disso, carregue o código do sistema principal no ESP32 e garanta que o endereço IP do computador esteja corretamente configurado no código do ESP32, bem como que ambos estejam conectados à mesma rede Wi-Fi. O microcontrolador precisa permanecer conectado ao computador.

## Estrutura do Projeto

```
projeto_integrador/
├── .gitignore                
├── README.md                 # Visão geral do projeto completo
│
├── 📂 hardware/              # (Tudo relacionado à parte física e firmware)
│   ├── 📂 bmp280/
│   │   ├── 2.sensor_BMP280.md
│   │   └── teste_BMP.ino
│   ├── 📂 dht22/
│   │   ├── 1.sensor_DHT22.md
│   │   └── teste_DHT.ino
│   ├── 📂 esp/
│   │   ├── 0.ESPs.md
│   │   └── cod_esp.ino
│   ├── 📂 indicador_dir_vento/
│   │   ├── 4.indicador_dir_vento.md
│   │   └── teste_dir_vento.ino
│   ├── 📂 pluviometro/
│   │   ├── 📂 encoder/
│   │   └── 5.pluviometro.md
│   ├── 📂 sensor_intensidade_luz/
│   │   ├── 7.sensor_intensidade_luz.md
│   │   └── teste_gy30.ino
│   ├── 📂 sensor_UV/
│   │   ├── 6.sensor_UV.md
│   │   └── teste_UVM30A.ino
│   ├── 🖼️ ESP32.png
│   ├── 🖼️ bmp280.png
│   ├── 🖼️ dht22.png
│   ├── 🖼️ encoder_lm393.png
│   └── 🖼️ uv30ma.png
│
└── 📂 software/              # (Aplicação Web, Backend e ML)
    ├── 📂 data/
    ├── 📂 docs/              
    ├── 📂 machine_learning_2/
    ├── 📂 public/
    ├── 📂 src/               
    ├── .gitignore            
    ├── eslint.config.js
    ├── index.html
    ├── jsdoc.json
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.cjs
    ├── README.md             
    ├── server.js
    ├── tailwind.config.js
    └── vite.config.js
```


---

## Contribuidores
Beatriz Schuelter Tartare (24103805) - Desenvolvimento Web

Eduardo Abrahao Malateaux Takayama (24102084) - Machine Learning

Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning

Rafaela Fernandes Savaris (24102078) - Hardware e Back-End

--- 

# Weather Station

## EN – Overview

This project aims to develop an intelligent weather station capable of collecting, processing, and presenting climate information in an accessible and integrated way. The system combines physical sensors and data processing to provide a complete view of local atmospheric conditions.

The project is divided into three main modules:

- **Rain Forecast:** uses historical data collected by the hardware to analyze climate trends and predict the probability of precipitation.  
- **Sky Visibility Analysis:** evaluates cloud coverage and provides an estimate of how clear the sky will be, ideal for astronomical observations.  
- **Astronomical Events:** displays relevant celestial phenomena and their dates, allowing users to plan observations.  

This integration between sensors, data analysis, and astronomy aims to provide a complete tool for enthusiasts and researchers interested in monitoring the weather and the sky in a practical and precise way.

---

## Hardware Requirements

- Sensors:
  - DHT22
  - BMP280
  - LM393
  - UVM30A
  - Rain Gauge
- Microcontroller:
  - ESP32
- Jumpers

- All specific hardware details (datasheets, module versions, jumper connections, etc.) are available in the `hardware` folder ([click here](hardware/)).

---

## Software Requirements

- Programming Languages:
  - Python (3.12.7)
  - Javascript (Node.js v22.18.0)
  - HTML
  - C/C++
  - C#
  - CSS

- Frameworks:
  - Tailwind (3.4.17) - https://tailwindcss.com/docs/installation/using-vite

- Site (Frontend & Backend):
  - Frontend
    - React (18.3.1) - https://react.dev
    - React Router DOM (6.30.1) - https://reactrouter.com/en/main
    - Vite (5.4.19) - https://vitejs.dev/guide/
  - Backend
    - Flask (3.0.3) - https://flask.palletsprojects.com
    - Flask-CORS (6.0.1) - https://flask-cors.readthedocs.io
    - Requests (2.32.3) - https://requests.readthedocs.io
    - BeautifulSoup4 / bs4 (4.12.3) - https://www.crummy.com/software/BeautifulSoup/bs4/doc/

- Sensors:
  - Wire.h - https://www.arduino.cc/en/reference/wire
  - Adafruit_Sensor.h - https://github.com/adafruit/Adafruit_Sensor
  - Adafruit_BMP280.h - https://github.com/adafruit/Adafruit_BMP280_Library
  - DHT.h / DHT_U.h - https://github.com/adafruit/DHT-sensor-library

- Communication:
  - WiFi.h
  - HTTPClient.h

- IDE:
  - Arduino IDE
  - Visual Studio Code

- Database:
  - SQLite - https://www.sqlite.org/docs.html

- Specific library versions and documentation links  

---


## Running Locally
This project requires 3 terminals running simultaneously.

Follow the steps below:

**Terminal 1: Frontend (Vite)**
```bash
cd software
npm run dev
```

**Terminal 2: Backend (Server)**

```bash
cd software
node server.js
```

**Terminal 3: Python Script**
```bash
cd software/src/python
python scraping.py
```

## Project Structure 
```bash
project_integrator/
├── .gitignore                
├── README.md                 # Full project overview
│
├── 📂 hardware/              # (Everything related to physical hardware and firmware)
│   ├── 📂 bmp280/
│   │   ├── 2.sensor_BMP280.md
│   │   └── teste_BMP.ino
│   ├── 📂 dht22/
│   │   ├── 1.sensor_DHT22.md
│   │   └── teste_DHT.ino
│   ├── 📂 esp/
│   │   ├── 0.ESPs.md
│   │   └── cod_esp.ino
│   ├── 📂 indicador_dir_vento/
│   │   ├── 4.indicador_dir_vento.md
│   │   └── teste_dir_vento.ino
│   ├── 📂 pluviometro/
│   │   ├── 📂 encoder/
│   │   └── 5.pluviometro.md
│   ├── 📂 sensor_intensidade_luz/
│   │   ├── 7.sensor_intensidade_luz.md
│   │   └── teste_gy30.ino
│   ├── 📂 sensor_UV/
│   │   ├── 6.sensor_UV.md
│   │   └── teste_UVM30A.ino
│   ├── 🖼️ ESP32.png
│   ├── 🖼️ bmp280.png
│   ├── 🖼️ dht22.png
│   ├── 🖼️ encoder_lm393.png
│   └── 🖼️ uv30ma.png
│
└── 📂 software/              # (Web app, Backend, and ML)
    ├── 📂 data/
    ├── 📂 docs/              
    ├── 📂 machine_learning_2/
    ├── 📂 public/
    ├── 📂 src/               
    ├── .gitignore            
    ├── eslint.config.js
    ├── index.html
    ├── jsdoc.json
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.cjs
    ├── README.md             
    ├── server.js
    ├── tailwind.config.js
    └── vite.config.js

```

## Contributors

Beatriz Schuelter Tartare (24103805) - Web Development

Eduardo Abrahao Malateaux Takayama (24102084) - Machine Learning

Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning

Rafaela Fernandes Savaris (24102078) - Hardware and Back-End
