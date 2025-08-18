// Teste do Sensor DHT11 ou DHT22 com as bibliotecas:
// - Adafruit Sensor Library
// - DHT Sensor Library - Adafruit
// - Adafruit DHT Unified
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTTYPE DHT11
//#define DHTTYPE DHT22

#define DHTPIN 2

// Cria um objeto do tipo DHT_Unified, o qual contém dois sub-objetos:
// um para temperatura e outro para umidade.
DHT_Unified dht(DHTPIN, DHTTYPE);

// Variável para armazenar o delay entre as leituras
uint32_t delayMS;

void setup()
{
  // Inicializa o sensor DHT e a comunicação serial
  Serial.begin(9600);
  dht.begin();

  Serial.println("Usando o Sensor DHT");
  // Cria um objeto sensor_t, que é uma struct, a qual contém informações sobre o sensor.
  sensor_t sensor;

  dht.temperature().getSensor(&sensor);
  Serial.println("------------------------------------");
  Serial.println("Temperatura");
  Serial.print  ("Sensor:       "); Serial.println(sensor.name);
  Serial.print  ("Valor max:    "); Serial.print(sensor.max_value); Serial.println(" *C");
  Serial.print  ("Valor min:    "); Serial.print(sensor.min_value); Serial.println(" *C");
  Serial.print  ("Resolucao:   "); Serial.print(sensor.resolution); Serial.println(" *C");
  Serial.println("------------------------------------");

  dht.humidity().getSensor(&sensor); 
  Serial.println("------------------------------------");
  Serial.println("Umidade");
  Serial.print  ("Sensor:       "); Serial.println(sensor.name);
  Serial.print  ("Valor max:    "); Serial.print(sensor.max_value); Serial.println("%");
  Serial.print  ("Valor min:    "); Serial.print(sensor.min_value); Serial.println("%");
  Serial.print  ("Resolucao:   "); Serial.print(sensor.resolution); Serial.println("%");
  Serial.println("------------------------------------");
  
  // Calcula o delay entre as leituras baseado no tempo mínimo de espera do sensor
  // O valor retornado por sensor.min_delay é em microssegundos, então dividimos por 1000
  // para obter milissegundos, que é o formato esperado por delay().
  delayMS = sensor.min_delay / 1000;
}

void loop()
{
  delay(delayMS);
  // Inicializa o evento (estrutura que contém dados lidos) de temperatura e umidade
  sensors_event_t event;

  // Realiza a leitura dos dados de temperatura. Se for inválido (x), mostra uma mensagem de erro. 
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature))
  {
    Serial.println("Erro na leitura da Temperatura!");
  }
  else
  {
    Serial.print("Temperatura: ");
    Serial.print(event.temperature);
    Serial.println(" *C");
  }

  // Realiza a leitura dos dados de umidade. Se for inválido (x), mostra uma mensagem de erro. 
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity))
  {
    Serial.println("Erro na leitura da Umidade!");
  }
  else
  {
    Serial.print("Umidade: ");
    Serial.print(event.relative_humidity);
    Serial.println("%");
  }
}