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

- Sensores: BMP280, UVM30A, DHT22, Encoder LM393
- Microcontrolador: ESP32

- Todos os detalhes específicos de hardware (datasheets, versões dos módulos, conexões de jumpers etc.) estão disponíveis na pasta hardware.

---

## Requisitos de Software

- Linguagens de programação: Python, Javascript, HTML, C/C++/C#, CSS  
- Frameworks: Tailwind  
- Bibliotecas:  
  - Site: React, Flask, Flask-CORS, BeautifulSoup, Requests, React Router DOM  
  - Sensores: Wire.h, Adafruit_Sensor.h, Adafruit_BMP280.h, DHT.h  
  - Comunicação: WiFi.h, HTTPClient.h  
  - Outras ferramentas: Vite  
- IDE: Arduino IDE, Visual Studio Code  
- Banco de dados: MongoDB  
- Versões específicas de bibliotecas e links para documentação  

---

## Configuração do Ambiente

- Versões de IDE/toolchain  
- Dependências e bibliotecas  
- Passo a passo de configuração  

---

## Como Usar

- Instruções de upload  
- Configurações necessárias  
- Exemplos de uso  

---

## Estrutura do Projeto

### Estrutura do Projeto — Pasta *hardware*

```
📁 hardware
├── 📁 bmp280
│   ├── 2.sensor_BMP280.md
│   └── teste_BMP.ino
│
├── 📁 dht22
│   ├── 1.sensor_DHT22.md
│   └── teste_DHT.ino
│
├── 📁 esp
│   ├── 0.ESPs.md
│   └── cod_esp.ino
│
├── 📁 indicador_dir_vento
│   ├── 4.indicador_dir_vento.md
│   └── teste_dir_vento.ino
│
├── 📁 pluviometro
│   ├── encoder
│   ├── 5.pluviometro.md
│   └── (arquivos dentro de "encoder")
│
├── 📁 sensor_intensidade_luz
│   ├── 7.sensor_intensidade_luz.md
│   └── teste_gy30.ino
│
├── 📁 sensor_UV
│   ├── 6.sensor_UV.md
│   └── teste_UVM30A.ino
│
├── 🖼️ ESP32.png
├── 🖼️ bmp280.png
├── 🖼️ dht22.png
├── 🖼️ encoder_lm393.png
└── 🖼️ uv30ma.png
```

### Estrutura do Projeto — Pasta *sofware*
```
📁 software
├── 📁 data
│
├── 📁 docs
│
├── 📁 machine_learning_2
│
├── 📁 node_modules
│
├── 📁 public
│
├── 📁 src
│
├── .gitignore
├── eslint.config.js
├── index.html
├── jsdoc.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── server.js
├── tailwind.config.js
└── vite.config.js
```
---

## Troubleshooting

- Problemas comuns e soluções  

---

## Contribuidores
Beatriz Schuelter Tartare (24103805) - Desenvolvimento Web
Eduardo Takayama - Machine Learning
Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning
Rafaela Fernandes Savaris (24102078) - Hardware
---

## EN – Overview

This project aims to develop an intelligent weather station capable of collecting, processing, and presenting climate information in an accessible and integrated way. The system combines physical sensors and data processing to provide a comprehensive view of local atmospheric conditions.

The project is divided into three main modules:

- **Rain forecast:** uses historical data collected by the hardware to analyze weather trends and predict precipitation probability.  
- **Sky visibility analysis:** assesses cloud coverage and provides an estimate of how clear the sky will be, ideal for astronomical observations.  
- **Astronomical events:** shows relevant celestial phenomena and their dates, allowing users to plan observations.  

This integration of sensors, data analysis, and astronomy provides a complete tool for enthusiasts and researchers interested in monitoring weather and the sky in a practical and accurate way.

---

## Hardware Requirements

- Sensors: BMP280, UVM30A, DHT22, LM393 encoder  
- Microcontroller: ESP32  
- 
- All hardware-specific details (datasheets, module versions, jumper connections, etc.) are available in the hardware folder.

---

## Software Requirements

- Programming languages: Python, Javascript, HTML, C/C++/C#, CSS  
- Frameworks: Tailwind  
- Libraries:  
  - Website: React, Flask, Flask-CORS, BeautifulSoup, Requests, React Router DOM  
  - Sensors: Wire.h, Adafruit_Sensor.h, Adafruit_BMP280.h, DHT.h  
  - Communication: WiFi.h, HTTPClient.h  
  - Other tools: Vite  
- IDE: Arduino IDE, Visual Studio Code  
- Database: MongoDB  
- Specific library versions and documentation links  

---

## Wiring Scheme

- Connection diagram (Fritzing/KiCad)  
- Pinout table  
- Photos of actual assembly  

---

## Environment Setup

- IDE/toolchain versions  
- Dependencies and libraries  
- Step-by-step configuration guide  

---

## How to Use

- Upload instructions  
- Required settings  
- Usage examples  

---

## Project Structure

### Hardware Folder

```
📁 hardware
├── 📁 bmp280
│   ├── 2.sensor_BMP280.md
│   └── teste_BMP.ino
│
├── 📁 dht22
│   ├── 1.sensor_DHT22.md
│   └── teste_DHT.ino
│
├── 📁 esp
│   ├── 0.ESPs.md
│   └── cod_esp.ino
│
├── 📁 indicador_dir_vento
│   ├── 4.indicador_dir_vento.md
│   └── teste_dir_vento.ino
│
├── 📁 pluviometro
│   ├── encoder
│   ├── 5.pluviometro.md
│   └── (arquivos dentro de "encoder")
│
├── 📁 sensor_intensidade_luz
│   ├── 7.sensor_intensidade_luz.md
│   └── teste_gy30.ino
│
├── 📁 sensor_UV
│   ├── 6.sensor_UV.md
│   └── teste_UVM30A.ino
│
├── 🖼️ ESP32.png
├── 🖼️ bmp280.png
├── 🖼️ dht22.png
├── 🖼️ encoder_lm393.png
└── 🖼️ uv30ma.png
```

### Software Folder
```
📁 software
├── 📁 data
│
├── 📁 docs
│
├── 📁 machine_learning_2
│
├── 📁 node_modules
│
├── 📁 public
│
├── 📁 src
│
├── .gitignore
├── eslint.config.js
├── index.html
├── jsdoc.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── server.js
├── tailwind.config.js
└── vite.config.js
```
---

---

## Troubleshooting

- Common problems and solutions  

---

## Contributors
Beatriz Schuelter Tartare (24103805) - Desenvolvimento Web
Eduardo Takayama - Machine Learning
Maria Eduarda Winkel de Mello Vianna (24102073) - Machine Learning
Rafaela Fernandes Savaris (24102078) - Hardware