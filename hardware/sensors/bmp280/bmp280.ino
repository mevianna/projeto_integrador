/**
 * @file bmp280.ino
 * @brief Reads temperature and atmospheric pressure data from the BMP280 sensor via I2C.
 *
 * This script is designed for an ESP32. It initializes the BMP280 sensor, reads temperature
 * and pressure values, and prints them to the serial monitor every 2 seconds.
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 *
 * @note Uses the Adafruit_BMP280 library and I2C communication.
*/

// Libraries used
#include <Wire.h> // It makes the internal I2C connection with <Adafruit_BMP280.h>
#include <Adafruit_BMP280.h>

#define I2C_ADDRESS 0x76 // Or 0x77. In the module used, based on tests, it was found to be 0x76.
// Creates a BMP sensor object.
Adafruit_BMP280 bmp;

void setup() {
  // Initializes the serial and the sensor
  Serial.begin(115200);
  Serial.println(F("BMP280 test"));

  /* Tests if the sensor was correctly initialized. If not,
  displays an error message and the sensor ID for possible errors.
  POSSIBLE IDs:
  * 0xFF - likely an incorrect address or a BMP180 or BMP085 (older sensors)
  * 0x56-0x58 - represents a BMP 280
  * 0x60 - represents a BME 280
  * 0x61 - represents a BME 680
  */
  bmp.begin();
  
  if (!bmp.begin(I2C_ADDRESS)) {
    Serial.println("Sensor could not be found!");
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                    "try a different address!"));
    Serial.print("SensorID: 0x");
    Serial.println(bmp.sensorID(),16);
    while(1);
  }
}

void loop() {
    // Reads and displays the temperature and pressure readings on the screen. 
    Serial.print(F("Temperature = "));
    Serial.print(bmp.readTemperature());
    Serial.println(" °C");

    Serial.print(F("Pressure = "));
    Serial.print(bmp.readPressure());
    Serial.println(" Pa");

    Serial.println();
    delay(2000);
}