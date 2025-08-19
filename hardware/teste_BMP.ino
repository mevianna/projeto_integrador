// Bibliotecas usadas
#include <Wire.h> // Faz a conexão I2C interna com <Adafruit_BMP280.h>
#include <Adafruit_BMP280.h>

// Cria um objeto do sensor BMP
Adafruit_BMP280 bmp;

void setup() {
  // Inicializa a serial e o sensor
  Serial.begin(9600);
  unsigned status;
  status = bmp.begin();
  Serial.println(F("BMP280 teste"));

  
  // Testa se o sensor foi corretamente inicializado. Se não foi, mostra mensagem
  // de erro e o ID do sensor para possível erro
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                      "try a different address!"));
    Serial.print("SensorID: 0x"); Serial.println(bmp.sensorID(),16);
  /* POSSÍVEIS IDS:
    * 0xFF - provavelmente um endereço incorreto ou um BMP180 ou BMP085 (antigos sensores)
    * 0x56-0x58 - representa um BMP 280
    * 0x60 - representa um BME 280
    * 0x61 - representa um BME 680 */
    while (1) delay(10);
  }

  // Configurações do sensor:
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL, // Modo normal (= default)
                  Adafruit_BMP280::SAMPLING_X2,  // Oversampling da temperatura (maior precisão, default = 1x)
                  Adafruit_BMP280::SAMPLING_X16, // Oversampling da pressão (maior precisão, default = 1x)
                  Adafruit_BMP280::FILTER_X16, // Filtro (suaviza pequenas flutuações, no default é desativado)
                  Adafruit_BMP280::STANDBY_MS_500); // Intervalo entre leituras (500ms = default)
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