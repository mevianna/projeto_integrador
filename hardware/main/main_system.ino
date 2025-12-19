/**
 * @file main_system.ino
 * @brief Readings from environmental sensors (DHT22, BMP280, UV, Reed Switch rain gauge),
 *        sends the data in JSON format via Wi-Fi to an external server.
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 *
 * @note Script fot ESP32 utilizing environmental sensors and HTTP communication comunicação HTTP.
*/

/**
 * @brief Library for I2C communication.
 */
#include <Wire.h>

/**
 * @brief Library for barometric sensor BMP280.
 */
#include <Adafruit_BMP280.h>
#include <Adafruit_Sensor.h>

/**
 * @brief Library for temperature/humidity sensor DHT22.
 */
#include <DHT.h>
#include <DHT_U.h>

/**
 * @brief Library for Wi-Fi connection on ESP32.
 */
#include <WiFi.h>

/**
 * @brief Library for HTTP requisitions.
 */
#include <HTTPClient.h>

/** @brief Wi-Fi's network name. */
const char* ssid = "wifi_name";
/** @brief Wi-Fi's network password. */
const char* password = "wifi_password";

// Sensors configuration
#define DHTPIN 18
#define DHTTYPE DHT22
#define UVPIN 34
#define I2C_ADDRESS_BMP 0x76  // I2C address of BMP280
#define PLUVPIN 13

// Rain gauge configuration
#define DIAMETER 125       // inner diameter of the bucket
#define RADIUS 6.25      // inner radius of the bucket
#define VOLUME 3.05      // tip volume (in cm3) (1cm3 == 1ml) (1ml == 1000mm3)

// Creating objects for the sensors
DHT_Unified dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

// Global variables
float temperature = NAN;
float humidity = NAN;
float atmpressure = NAN;
String UVindex = "";

// Rain gauge variables:
int val = 0;
int old_val = 0;
float Collectedvolume;
volatile unsigned long ContactBounce = 0;
volatile unsigned long REEDCOUNT = 0;

// Functions prototypes
/**
 * @brief Reads temperature and humidity from sensor DHT22.
 */
void readBMP280();
void readDHT22();
void readUVIndex();
void uv_classification(float valueSensor);
void IRAM_ATTR isr_rain();
void get_rain();
void wifi_connection();
void sendJSON();

void setup() {
  Serial.begin(115200);
  wifi_connection();

  // Initializes BMP280
  if (!bmp.begin(I2C_ADDRESS_BMP)) {
    delay(2000);
    Serial.println(F("The BMP280 sensor could not be found!"));
    Serial.print(F("SensorID: 0x"));
    Serial.println(bmp.sensorID(), HEX);
    while (1); // Stops if sensor's not found
  }
  Serial.println(F("BMP280 started successfully."));

  // Initializes DHT22
  dht.begin();
  Serial.println(F("DHT22 started successfully."));

  // Initializes Rain gauge
  pinMode(PLUVPIN, INPUT_PULLUP);

  // Initializes interruption
  attachInterrupt(PLUVPIN, isr_rain, FALLING);
}

void loop() {
  if(WiFi.status() == WL_CONNECTED) Serial.println("Wi-Fi connected!");
  else Serial.println("Could not connect");

  readDHT22();
  readBMP280();
  readUVIndex();
  get_rain();
  sendJSON();

  Serial.println(F("-----------------------------"));
  delay(5000);  // Break between readings
}

// Sensors readings
void readDHT22() {
  sensors_event_t event;

  // Temperature
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Error in temperature reading of DHT22!"));
    temperature = 0.0;
  } else {
    Serial.print(F("DHT22's temperature: "));
    Serial.print(event.temperature);
    Serial.println(F(" °C"));
    temperature = event.temperature;
  }

  // Humidity
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Error in humidity reading of DHT22!"));
    humidity = 0.0;
  } else {
    Serial.print(F("DHT22's humidity: "));
    Serial.print(event.relative_humidity);
    Serial.println(F(" %"));
    humidity = event.relative_humidity;
  }
}

void readBMP280() {
  float temp_bmp = bmp.readTemperature();
  atmpressure = bmp.readPressure();

  Serial.print(F("Temperature measured by BMP280: "));
  Serial.print(temp_bmp);
  Serial.println(F(" °C"));

  Serial.print(F("Pressure measured by BMP280: "));
  Serial.print(atmpressure);
  Serial.println(F(" Pa"));
}

void readUVIndex() {
  int sensorValue = analogRead(UVPIN);
  float voltage = sensorValue * 3300.0 / 4095.0;
  Serial.print("UV Tension levels: ");
  Serial.println(voltage);

  uv_classification(voltage);
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

void IRAM_ATTR isr_rain() {
  if ((millis() - ContactBounce) > 50 ) { // debounce the switch contact.
    REEDCOUNT = REEDCOUNT + 1;              // Adds 1 to the pulse count
    ContactBounce = millis();
  }
}

void get_rain() {
    // float container_area = 3.14159265 * (RADIUS * RADIUS); // área da seção transversal do recipiente em cm²
    // float volume_per_turn = (VOLUME/container_area);
    Collectedvolume = (REEDCOUNT * 0.25) * 10; // total volume collected in cm³

    Serial.print("Turns: ");
    Serial.println(REEDCOUNT);

    Serial.print("Rain: ");
    Serial.print (Collectedvolume);
    Serial.println(" mm");
}

// Wi-Fi
void wifi_connection() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
}

// Sends JSON
void sendJSON() {
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi not connected. JSON not sent.");
    return;
  }

  HTTPClient http;

  WiFiClient client;
  if (!client.connect("IP_ADDRESS", 4000)) Serial.println("TCP connection to the server failed!");
  else Serial.println("TCP connection successfully made!");

  // Replace with the IP address of the user's computer.
  // To find the IP address, run ipconfig in the command prompt and look for the IPv4 address.
  http.begin("http://IP_ADDRESS:4000/data");
  http.addHeader("Content-Type", "application/json");

  // Assemble JSON
  String json = "{";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"Atmpressure\":" + String(atmpressure) + ",";
  json += "\"uvClassification\":\"" + String(UVindex) + "\",";
  json += "\"precipitation\":\"" + String(Collectedvolume) + "\"";
  json += "}";

  int httpResponseCode = http.POST(json);
  Serial.println("Sending JSON - HTTP Code: " + String(httpResponseCode));

  if(httpResponseCode > 0) {
    String payload = http.getString();
    Serial.println("Server's response: " + payload);
  } 
  else Serial.println("Connection failed! Verify IP address, port, or Wi-Fi.");

  http.end();
}