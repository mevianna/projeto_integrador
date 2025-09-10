#define UVPIN 34; // Pino ADC conectado ao sensor UV

void setup() {
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  int sensorValue = analogRead(UVPIN);

  // Converte o valor do ADC para tensão em mV. ESP32 ADC padrão: 0–3.3V, 12 bits (0–4095)
  float voltage = sensorValue * 3300.0 / 4095.0;

  Serial.print("Voltage value: ");
  Serial.print(voltage);
  Serial.println(" mV");a

  delay(1000);
}