/**
 * @file pluviometer.ino
 * @brief Measures rainfall using a reed switch rain gauge and calculates total precipitation.
 *
 * This script is designed for an ESP32. It reads pulses from a reed switch sensor attached
 * to a tipping cup rain gauge. Each pulse corresponds to a specific volume of rainfall. The
 * pulses are counted and converted to millimeters of precipitation. The data can be extended
 * to integrate with other environmental sensors (DHT22, BMP280, UV sensor) and sent via Wi-Fi
 * in JSON format to an external server.
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 *
 * @note Uses internal pull-up resistor on ESP32 input pin. Suitable for rainfall measurement
 *       with tipping bucket sensors.
 */

#define REED_PIN 13           // Pin where the magnetic (reed) sensor is connected

#define BUCKET_DIAMETER 125   // Internal diameter of the bucket (mm)
#define BUCKET_RADIUS 6.25    // Internal radius of the bucket (cm)
#define BUCKET_VOLUME 3.05    // Volume of the tipping cup (in cm³) (1 cm³ == 1 ml) (1 ml == 1000 mm³)

// Rain gauge variables
int val = 0;
int oldVal = 0;
float collectedVolume = 0;
volatile unsigned long contactBounce = 0;
volatile unsigned long reedCount = 0;

// Interrupt Service Routine
// This function is called by the interrupt to increment the tipping count
void IRAM_ATTR isr_rain() {
    if ((millis() - contactBounce) > 50) { // debounce the switch contact
        reedCount += 1;                     // Increment pulse count by 1
        contactBounce = millis();
        // Serial.println("Interrupt function called");
    }
}

// Calculate Rainfall
void get_rain() {
    // Calculate total collected volume in cm³ (1 cm³ = 1 ml)
    collectedVolume = (reedCount * 0.25) * 10; // adjust factor based on calibration

    Serial.print("Tipping counts: ");
    Serial.println(reedCount);

    Serial.print("Rainfall: ");
    Serial.print(collectedVolume);
    Serial.println(" mm");
}

void setup() {
    Serial.begin(115200);       // Serial monitor speed

    pinMode(REED_PIN, INPUT_PULLUP);
    attachInterrupt(REED_PIN, isr_rain, FALLING); // Attach interrupt to reed sensor
}

void loop() {
    get_rain();
    delay(1000); // Update every second
}