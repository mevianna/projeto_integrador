/* ***************************************************************************
 * @file test_UVM30A.ino
 * @brief Reads and converts UV sensor analog data into voltage using ESP32 ADC.
 *
 * This script reads the analog signal from a UVM30A UV sensor connected to an ESP32
 * ADC pin. It converts the raw ADC value (12-bit, 0–3.3V) into voltage in millivolts
 * for monitoring or further processing.
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 */

#define UVPIN 34 // ADC pin connected to the UV sensor.

String UVindex = "";

void setup() {
  Serial.begin(115200);
  delay(1000);
}

void uv_classification(float value) {
  if(value < 408) UVindex = "Low";
  else if(value >= 408 && value < 696) UVindex = "Medium";
  else if(value >= 696 && value < 881) UVindex = "High";
  else if(value >= 881 && value < 1170) UVindex = "Very high";
  else UVindex = "Extreme";

  Serial.print("UV index: ");
  Serial.println(UVindex);
}

void loop() {
  int sensorValue = analogRead(UVPIN);

  // Converts the ADC value to voltage in mV. Standard ESP32 ADC: 0–3.3V, 12 bits (0–4095)
  float voltage = sensorValue * 3300.0 / 4095.0;

  Serial.print("Voltage value: ");
  Serial.print(voltage);
  Serial.println(" mV");

  uv_classification(voltage);

  delay(1000);
}