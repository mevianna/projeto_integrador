/**
 * @file encoder.ino
 * @brief Reads data from a reed switch sensor and calculates rotations per second (RPS).
 *
 * This script is designed for an ESP32. It counts pulses from a reed switch sensor over
 * a 1-second interval to determine the rotation speed in rotations per second (RPS).
 *
 * @version 1.0.0
 * @date 2025-09-05
 *
 * @author
 * Rafaela Fernandes Savaris
 *
 * @note Uses internal pull-up resistor on ESP32 input pin. Suitable for wheel/disc rotation
 *       measurement or similar pulse-based speed sensing applications.
*/

// Pin Configuration
int sensorPin = 13;

// Variables
unsigned long startTime = 0; // Start time of measurement interval (ms)
unsigned long endTime = 0;   //  End time of measurement interval (ms)
int steps = 0;               // Total pulse count
float stepsOld = 0;          //  Previous pulse count for delta calculation
float temp = 0;              // Steps counted during the current interval
float rps = 0;               // Rotations per second

void setup() 
{
  Serial.begin(115200);
  pinMode(sensorPin,INPUT_PULLUP);
}
 
void loop()
{
    // Set measurement interval
    startTime = millis();
    endTime = startTime + 1000; // 1-second interval

    // Count pulses during the interval
    while (millis() < endTime)
    {
        if (digitalRead(sensorPin))
        {
            steps += 1;
            while (digitalRead(sensorPin)); // Wait until the current pulse ends
        }
    }

    // Calculate rotations in this interval
    temp = steps - stepsOld; 
    stepsOld = steps;

    // Calculate rotations per second (RPS)
    rps = temp / 1.0; // Divide by the number of holes in the disc if applicable

    // Output results
    Serial.println("Rotations per second: ");
    Serial.println(rps);
}