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

- Todos os detalhes específicos de hardware (datasheets, versões dos módulos, conexões de jumpers etc.) estão disponíveis na pasta `hardware`: ([Hardware](hardware/)).

---

## Requisitos de Software

- Linguagens de programação:
  - Python (3.12.7);
  - Javascript (Node.js v22.18.0);
  - HTML (HTML5) - https://www.w3schools.com/html/;
  - Arduino (C/C++) - https://docs.arduino.cc/language-reference/pt/;
  - CSS (CSS3+) - https://www.w3schools.com/css/.

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

## Acesso do projeto pelo link

Pode-se acessar o projeto pelo link abaixo ou, alternativamente, seguir os próximos tópicos para efetuar sua execução local.

https://projeto-integrador-qzrn.vercel.app/

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
cd machine_learning
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

Além disso, carregue o código do sistema principal no ESP32 e garanta que o endereço IP do computador esteja corretamente configurado no código do ESP32, bem como que ambos estejam conectados à mesma rede Wi-Fi. O microcontrolador precisa permanecer conectado ao computador. Para mais informações, acesse: [Sistema Principal](./hardware/main/README.md)

## Estrutura do Projeto

```bash
2025.2_DEC0013_ESTACAO-METEREOLOGICA/
├── .gitignore                
├── README.md                         # Visão geral do projeto
├── 📂 hardware/                     
|   ├── 📂 main/
│   │   ├── main_system.ino           # Código principal do sistema
│   │   └── README.md                 # Documentação do sistema principal
│   ├── 📂sensors/                   # Documentação explicando todas as conexões dos componentes
│   │   ├── 📂 bmp280/
│   │   │   ├── bmp280.ino            # Código de teste do sensor BMP280
│   │   │   └── README.md             # Documentação sobre o sensor, conexões e uso
│   │   ├── 📂 dht22/
│   │   │   ├── dht22.ino             # Código de teste do sensor DHT22
│   │   │   └── README.md             # Documentação sobre o sensor, conexões e uso
│   │   ├── 📂 encoder/
│   │   │   ├── encoder.ino           # Código de teste do sensor LM393 (encoder)
│   │   │   └── README.md             # Documentação sobre o sensor, conexões e uso
│   │   ├── 📂 pluviometer/
│   │   │   ├── pluviometer.ino       # Código de teste do pluviômetro com encoder
│   │   │   └── README.md             # Documentação sobre o sensor, conexões e uso
│   │   └── 📂 uvm30a/
│   │       ├── test_UVM30A.ino       # Código de teste do sensor UV UVM30A
│   │       └── README.md             # Documentação sobre o sensor, conexões e uso
│   └── 📂 schematic/
│       └── README.md             
├── 📂 img/
│   ├── bmp280.png
│   ├── dht22.png
│   ├── lm393.png
│   ├── pluviometer.png
│   ├── schematic.png
│   ├── terminal_bmp280.png
│   ├── terminal_dht22.png
│   ├── terminal_lm393.png
│   ├── terminal_main_system.jpeg
│   ├── terminal_pluviometer.png
│   ├── terminal_uvm30a.png
│   └── uvm30a.png
└── 📂 software/                     # (Aplicação Web, Backend e ML)
    ├── 📂 data/
    ├── 📂 docs/              
    ├── 📂 machine_learning/
    ├── 📂 public/
    ├── 📂 src/               
    ├── .gitignore            
    ├── eslint.config.js
    ├── index.html
    ├── jsdoc.json
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.cjs        
    ├── server.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Contribuidores

| Members |
| :---: |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/197432407?v=4" width="115"><br><sub>Beatriz Schuelter Tartare (24103805) - Web Development</sub>](https://github.com/beastartare) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/196859849?v=4" width="115"><br><sub>Eduardo Abrahao Malateaux Takayama (24102084) - Machine Learning</sub>](https://github.com/edumtk) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/160762179?v=4" width="115"><br><sub>Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning</sub>](https://github.com/mevianna) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/178849007?v=4" width="115"><br><sub>Rafaela Fernandes Savaris (24102078) - Hardware and Back-End</sub>](https://github.com/rafasavaris) |

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
  - Python (3.12.7);
  - Javascript (Node.js v22.18.0);
  - HTML (HTML5) - https://www.w3schools.com/html/;
  - Arduino (C/C++) - https://docs.arduino.cc/language-reference/pt/;
  - CSS (CSS3+) - https://www.w3schools.com/css/.

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

- Sensors:
  - Wire.h - https://www.arduino.cc/en/reference/wire
  - Adafruit_Sensor.h - https://github.com/adafruit/Adafruit_Sensor
  - Adafruit_BMP280.h - https://github.com/adafruit/Adafruit_BMP280_Library
  - DHT.h / DHT_U.h - https://github.com/adafruit/DHT-sensor-library

- Communication:
  - WiFi.h - https://docs.arduino.cc/libraries/wifi/;
  - HTTPClient.h - https://docs.arduino.cc/libraries/httpclient/.

- IDE:
  - Arduino IDE - https://www.arduino.cc/en/software/;
  - Visual Studio Code (VS Code) - https://code.visualstudio.com/.

- Microcontroller ESP32:
  - ESP32 - https://dl.espressif.com/dl/package_esp32_index.json

- Database:
  - SQLite - https://www.sqlite.org/docs.html

---

## Project Access via Link

You can access the project using the link below or, alternatively, follow the next sections to run it locally.

https://projeto-integrador-qzrn.vercel.app/

## Environment Setup

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
cd machine_learning
pip install -r requirements.txt
```

### ESP

In the Arduino IDE, go to File > Preferences, paste the previously mentioned link into “Additional Board Manager URLs,” and install the ESP32 board package. Then, install all the required libraries listed above. 

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

Additionally, upload the main system code to the ESP32 and ensure that the computer’s IP address is correctly configured in the ESP32 code, and that both devices are connected to the same Wi-Fi network. The microcontroller must remain connected to the computer during operation. For more information, see: [Main System](./hardware/main/README.md)

## Project Structure 
```bash
projeto_integrador/
├── .gitignore                
├── README.md                         # Project overvieW
├── 📂 hardware/                     
│   ├── 📂 main/
│   │   ├── main_system.ino           # Main system code
│   │   └── README.md                 # Main system documentation
│   ├── 📂 sensors/                   # Documentation and test code for all sensors
│   │   ├── 📂 bmp280/
│   │   │   ├── bmp280.ino            # Test code for BMP280 sensor
│   │   │   └── README.md             # BMP280 documentation (usage and wiring)
│   │   ├── 📂 dht22/
│   │   │   ├── dht22.ino             # Test code for DHT22 sensor
│   │   │   └── README.md             # DHT22 documentation (usage and wiring)
│   │   ├── 📂 encoder/
│   │   │   ├── encoder.ino           # Test code for LM393 encoder sensor
│   │   │   └── README.md             # Encoder documentation (usage and wiring)
│   │   ├── 📂 pluviometer/
│   │   │   ├── pluviometer.ino       # Test code for the rain gauge with encoder
│   │   │   └── README.md             # Pluviometer documentation (usage and wiring)
│   │   └── 📂 uvm30a/
│   │       ├── test_UVM30A.ino       # Test code for UVM30A UV sensor
│   │       └── README.md             # UVM30A documentation (usage and wiring)
│   └── 📂 schematic/
│       └── README.md                 # Hardware schematic documentation
├── 📂 img/
│   ├── bmp280.png
│   ├── dht22.png
│   ├── lm393.png
│   ├── pluviometer.png
│   ├── schematic.png
│   ├── terminal_bmp280.png
│   ├── terminal_dht22.png
│   ├── terminal_lm393.png
│   ├── terminal_main_system.jpeg
│   ├── terminal_pluviometer.png
│   ├── terminal_uvm30a.png
│   └── uvm30a.png
└── 📂 software/                      # (Web App, Backend, and ML)
    ├── 📂 data/
    ├── 📂 docs/              
    ├── 📂 machine_learning/
    ├── 📂 public/
    ├── 📂 src/               
    ├── .gitignore            
    ├── eslint.config.js
    ├── index.html
    ├── jsdoc.json
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.cjs         
    ├── server.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Contributors

| Members |
| :---: |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/197432407?v=4" width="115"><br><sub>Beatriz Schuelter Tartare (24103805) - Web Development</sub>](https://github.com/beastartare) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/196859849?v=4" width="115"><br><sub>Eduardo Abrahao Malateaux Takayama (24102084) - Machine Learning</sub>](https://github.com/edumtk) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/160762179?v=4" width="115"><br><sub>Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning</sub>](https://github.com/mevianna) |
| [<img loading="lazy" src="https://avatars.githubusercontent.com/u/178849007?v=4" width="115"><br><sub>Rafaela Fernandes Savaris (24102078) - Hardware and Back-End</sub>](https://github.com/rafasavaris) |