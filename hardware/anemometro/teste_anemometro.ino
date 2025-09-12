#define HALL_SENSOR_PIN 2  // ESP32 pin where the hall sensor is connected - necessário ser o pino 2 para gerar interrupção

// Constants definitions
const int PERIOD = 5000;  // Measurement period in milliseconds
const int DELAY_TIME = 2000;  // Time between samples in milliseconds
const int RADIUS = 147;  // Anemometer radius in mm

// Variable definitions
unsigned int sampleNumber = 0;  // Sample number
volatile unsigned int counter = 0; // Magnet counter for sensor
unsigned int rpm = 0;  // Revolutions per minute
float windSpeedMetersPerSecond = 0;  // Wind speed in m/s
float windSpeedKilometersPerHour = 0;  // Wind speed in km/h

void setup() {
  pinMode(HALL_SENSOR_PIN, INPUT_PULLUP);

  Serial.begin(9600);
  
  // Attach interrupt: quando uma interrupção ocorrer no pino do sensor, a função countRevolution será chamada.
  // RISING indica que a interrupção ocorrerá na borda de subida do sinal (quando o sinal muda de LOW para HIGH).
  attachInterrupt(digitalPinToInterrupt(HALL_SENSOR_PIN), countRevolution, RISING);
}

void loop() {
  sampleNumber++;
  Serial.print(sampleNumber);
  Serial.print(": Start measurement...");
  measureWindSpeed();
  Serial.println(" finished.");
  Serial.print("Counter: ");
  Serial.print(counter);
  Serial.print("; RPM: ");
  calculateRPM();
  Serial.print(rpm);
  Serial.print("; Wind speed: ");
  
  // Print wind speed in m/s
  calculateWindSpeedMetersPerSecond();
  Serial.print(windSpeedMetersPerSecond);
  Serial.print(" [m/s] ");              
  
  // Print wind speed in km/h
  calculateWindSpeedKilometersPerHour();
  Serial.print(windSpeedKilometersPerHour);
  Serial.print(" [km/h] ");  
  Serial.println();

  delay(DELAY_TIME);  // Delay between prints
}

// Espera o período definido. Enquanto isso, as interrupções são contadas.
void measureWindSpeed() {
  counter = 0;  
  long startTime = millis();
  while (millis() < startTime + PERIOD) {
    // Wait for the period to complete
  }
}

void calculateRPM() {
  rpm = (counter * 60) / (PERIOD / 1000);  // Calculate RPM
}

void calculateWindSpeedMetersPerSecond() {
  windSpeedMetersPerSecond = ((4 * PI * RADIUS * rpm) / 60) / 1000;  // Calculate wind speed in m/s
}

void calculateWindSpeedKilometersPerHour() {
  windSpeedKilometersPerHour = windSpeedMetersPerSecond * 3.6;  // Convert m/s to km/h
}

void countRevolution() {
  counter++;  // Increment counter for each revolution detected
}