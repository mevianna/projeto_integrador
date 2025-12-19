# Hardware Folder

This folder contains all the hardware-related documentation, schematics, and test code for the environmental monitoring project using an ESP32 and various sensors.

## Folder Structure

```
📂 hardware/
├── 📂 main/
│   ├── main_system.ino          # Main system code
│   └── README.md                # Main system documentation
├── 📂 schematic/
│   └── README.md                # Documentation explaining all component connections
└── 📂 sensors/
    ├── 📂 bmp280/
    │   ├── bmp280.ino           # Example code for testing the BMP280 sensor
    │   └── README.md            # Documentation explaining the sensor, its connections, and usage
    ├── 📂 dht22/
    │   ├── dht22.ino            # Example code for testing the DHT22 sensor
    │   └── README.md            # Documentation explaining the sensor, its connections, and usage
    ├── 📂 encoder/
    │   ├── encoder.ino          # Example code for testing the LM393 (encoder) sensor
    │   └── README.md            # Documentation explaining the sensor, its connections, and usage
    ├── 📂 pluviometer/
    |   ├── pluviometer.ino      # Example code for testing the rain gauge with an encoder
    |   └── README.md            # Documentation explaining the sensor, its connections, and usage
    └── 📂 uvm30a/
        ├── test_UVM30A.ino      # Example code for testing the UV sensor
        └── README.md            # Documentation explaining the sensor, its connections, and usage
```

## Description

- **schematic/**  
  Contains the general system schematic, including a README.md file that explains all connections between the ESP32 and the sensors and provides a figure illustrating the full hardware wiring. This folder serves as the main reference for assembling the circuit.

- **sensors/**  
  This folder contains **individual sensor subfolders**, each with:
  - A **documentation file** (`.md`) that explains:
    - The purpose of the sensor  
    - Its specifications (range, resolution, accuracy)  
    - How to connect it to the ESP32  
    - Any additional notes or calibration steps
  - A **test code file** (`.ino`) to quickly verify sensor functionality. This code demonstrates basic initialization, reading values, and printing results to the serial monitor.

## Usage

1. Open the folder of the sensor you want to test, then open the corresponding example code (.ino) in the Arduino IDE or PlatformIO.
2. Upload the code to the ESP32.
3. Open the Serial Monitor to verify the sensor readings.
4. Use the documentation available in each sensor’s folder for details on calibration, pin connections, and data interpretation.

## Notes

- Ensure proper **power supply** and **pull-up resistors** for sensors like DHT22 or BMP280 when needed.
- All example codes are written for the **ESP32** and may require minor adjustments for other microcontrollers.

---
