// Bibliotecas usadas
#include <Wire.h> // Faz a conexão I2C interna com <Adafruit_BMP280.h>
#include <Adafruit_BMP280.h>

#define I2C_ADDRESS 0x76 // Ou 0x77. No módulo usado, com base em testes, descobriu-se que é 0x76
// Cria um objeto do sensor BMP
Adafruit_BMP280 bmp;

void setup() {
  // Inicializa a serial e o sensor
  Serial.begin(115200);
  Serial.println(F("BMP280 teste"));

  /* Testa se o sensor foi corretamente inicializado. Se não foi, mostra mensagem
  de erro e o ID do sensor para possível erro
  POSSÍVEIS IDS:
  * 0xFF - provavelmente um endereço incorreto ou um BMP180 ou BMP085 (antigos sensores)
  * 0x56-0x58 - representa um BMP 280
  * 0x60 - representa um BME 280
  * 0x61 - representa um BME 680 */
  bmp.begin();
  
  if (!bmp.begin(I2C_ADDRESS)) {
    Serial.println("Sensor não encontrado!");
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                    "try a different address!"));
    Serial.print("SensorID: 0x");
    Serial.println(bmp.sensorID(),16);
    while(1);
  }
}

void loop() {
    // Lê e mostra na tela o valor lido de temperatura e pressão
    Serial.print(F("Temperatura = "));
    Serial.print(bmp.readTemperature());
    Serial.println(" °C");

    Serial.print(F("Pressao = "));
    Serial.print(bmp.readPressure());
    Serial.println(" Pa");

    Serial.println();
    delay(2000);
}