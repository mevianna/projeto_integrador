/* ***************************************************************************
 * @file dht22.ino
 * @brief Initializes and reads temperature and humidity using DHT11 or DHT22 sensors.
 *
 * This script demonstrates how to interface a DHT22 sensor with an ESP32 using
 * the Adafruit Unified Sensor and DHT libraries. It initializes the sensor,
 * reads temperature and humidity values, handles invalid readings, and prints
 * the results to the serial monitor.
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 *
 * @note Uses the Adafruit_Sensor, DHT, and DHT_U libraries. Ensure the sensor's
 *       data pin is connected to the defined ESP32 GPIO (default DHTPIN = 18).
 *       The sensor requires a pull-up resistor on the data line if not already present.
 */
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Defining which sensor is being used.
#define DHTTYPE DHT22

#define DHTPIN 18

// Creates a DHT_Unified object, which contains two sub-objects:
// one for temperature and another for humidity.
DHT_Unified dht(DHTPIN, DHTTYPE);

// Variable to store the delay between readings
uint32_t delayMS;

void setup()
{
// Initializes the DHT sensor and serial communication
  Serial.begin(115200);
  dht.begin();

  Serial.println("Using DHT Sensor");
  // Creates an object sensor_t, which is a struct, containing information about the sensor.
  sensor_t sensor;

  dht.temperature().getSensor(&sensor);
  Serial.println("------------------------------------");
  Serial.println("Temperature");
  Serial.print  ("Sensor:       "); Serial.println(sensor.name);
  Serial.print  ("Max value:    "); Serial.print(sensor.max_value); Serial.println(" *C");
  Serial.print  ("Min value:    "); Serial.print(sensor.min_value); Serial.println(" *C");
  Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" *C");
  Serial.println("------------------------------------");

  dht.humidity().getSensor(&sensor); 
  Serial.println("------------------------------------");
  Serial.println("Humidity");
  Serial.print  ("Sensor:       "); Serial.println(sensor.name);
  Serial.print  ("Max value:    "); Serial.print(sensor.max_value); Serial.println("%");
  Serial.print  ("Min value:    "); Serial.print(sensor.min_value); Serial.println("%");
  Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println("%");
  Serial.println("------------------------------------");
  
  // Calculates the delay between readings based on the minimum sensor wait time
  // The value returned by sensor.min_delay is in microseconds, so we divide by 1000
  // to obtain milliseconds, which is the format expected by delay().
  delayMS = sensor.min_delay / 1000;
}

void loop()
{
  delay(5000);
  // Initializes the temperature and humidity event (structure containing read data).
  sensors_event_t event;

  // Reads temperature data. If invalid (x), displays an error message.
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature))
  {
    Serial.println("Error reading temperature!");
  }
  else
  {
    Serial.print("Temperature: ");
    Serial.print(event.temperature);
    Serial.println(" *C");
  }

  // Reads the humidity data. If it is invalid (x), displays an error message.
  dht.humidity().getEvent(&event);
  
  if (isnan(event.relative_humidity))
    Serial.println("Error reading humidity!");

  else
  {
    Serial.print("Humidity: ");
    Serial.print(event.relative_humidity);
    Serial.println("%");
  }
}