// Bibliotecas usadas
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Configuração do Wi-Fi
const char* ssid = "Vagner";
const char* password = "CasaAnimada";

// Configurações dos sensores
#define DHTPIN 18
#define DHTTYPE DHT22
#define UVPIN 34
#define I2C_ADDRESS_BMP 0x76  // Endereço I2C do BMP280

// Criação de objetos dos sensores
DHT_Unified dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

// Variáveis globais
float temperatura = NAN;
float umidade = NAN;
float pressaoatm = NAN;
String indiceUV = "";

// Protótipos das funções
void lerBMP280();
void lerDHT22();
void lerSensorUV();
void classificacao_uv(float valueSensor);
void conexao_wifi();
void enviarJSON();

void setup() {
  Serial.begin(115200);
  conexao_wifi();

  // Inicializa BMP280
  if (!bmp.begin(I2C_ADDRESS_BMP)) {
    delay(2000);
    Serial.println(F("Não foi possível encontrar o sensor BMP280!"));
    Serial.print(F("SensorID: 0x"));
    Serial.println(bmp.sensorID(), HEX);
    while (1); // Para execução se sensor não encontrado
  }
  Serial.println(F("BMP280 iniciado com sucesso."));

  // Inicializa DHT22
  dht.begin();
  Serial.println(F("DHT22 iniciado com sucesso."));
}

void loop() {
  delay(5000);  // Intervalo entre leituras

  if(WiFi.status() == WL_CONNECTED) Serial.println("Conectado à Wi-Fi!");
  else Serial.println("Não conectado");

  lerDHT22();
  lerBMP280();
  lerSensorUV();
  enviarJSON();

  Serial.println(F("-----------------------------"));
}

// Leituras dos sensores
void lerDHT22() {
  sensors_event_t event;

  // Temperatura
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println(F("Erro na leitura da temperatura do DHT22!"));
    temperatura = NAN;
  } else {
    Serial.print(F("Temperatura pelo DHT22: "));
    Serial.print(event.temperature);
    Serial.println(F(" °C"));
    temperatura = event.temperature;
  }

  // Umidade
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println(F("Erro na leitura da umidade do DHT22!"));
    umidade = NAN;
  } else {
    Serial.print(F("Umidade pelo DHT22: "));
    Serial.print(event.relative_humidity);
    Serial.println(F(" %"));
    umidade = event.relative_humidity;
  }
}

void lerBMP280() {
  float temp_bmp = bmp.readTemperature();
  pressaoatm = bmp.readPressure();

  Serial.print(F("Temperatura pelo BMP280: "));
  Serial.print(temp_bmp);
  Serial.println(F(" °C"));

  Serial.print(F("Pressão pelo BMP280: "));
  Serial.print(pressaoatm);
  Serial.println(F(" Pa"));
}

void lerSensorUV() {
  int sensorValue = analogRead(UVPIN);
  float voltage = sensorValue * 3300.0 / 4095.0;
  Serial.print("Nivel de tensao UV: ");
  Serial.println(voltage);

  classificacao_uv(voltage);
}

void classificacao_uv(float value) {
  if(value < 408) indiceUV = "Baixo";
  else if(value >= 408 && value < 696) indiceUV = "Moderado";
  else if(value >= 696 && value < 881) indiceUV = "Alto";
  else if(value >= 881 && value < 1170) indiceUV = "Muito alto";
  else indiceUV = "Extremo";

  Serial.print("Indice UV: ");
  Serial.println(indiceUV);
}

// Wi-Fi
void conexao_wifi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado!");
}

// Envio JSON
void enviarJSON() {
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi não conectado. JSON não enviado.");
    return;
  }

  HTTPClient http;

  WiFiClient client;
  if (!client.connect("IP_PC", 4000)) Serial.println("Falha na conexão TCP com o servidor!");
  else Serial.println("Conexão TCP estabelecida com sucesso!");

  // Substituir pelo IP do computador de quem está usando
  // para descobrir o IP, rode ipconfig no cmd e procure pelo endereço IPv4
  http.begin("http://IP_PC:4000/dados");
  http.addHeader("Content-Type", "application/json");

  // Monta JSON
  String json = "{";
  json += "\"temperatura\":" + String(temperatura) + ",";
  json += "\"umidade\":" + String(umidade) + ",";
  json += "\"pressaoAtm\":" + String(pressaoatm) + ",";
  json += "\"uvClassificacao\":\"" + indiceUV + "\"";
  json += "}";

  int httpResponseCode = http.POST(json);
  Serial.println("Envio JSON - Código HTTP: " + String(httpResponseCode));

  if(httpResponseCode > 0) {
    String payload = http.getString();
    Serial.println("Resposta do servidor: " + payload);
  } 
  else Serial.println("Falha na conexão! Verifique IP, porta ou Wi-Fi.");

  http.end();
}