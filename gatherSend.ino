#include <DHT.h>
#include <esp_wifi.h>
#include <ArduinoWebsockets.h>
#include "env.h"

#define DHTGPIO 27
#define DHTTYPE DHT11

DHT dht(DHTGPIO, DHTTYPE);
#include <Arduino.h>
#include <WiFi.h>


websockets::WebsocketsClient client;


void setup() {
  Serial.begin(115200);
  dht.begin();


  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
  }

  bool connected = false;
  while(connected == false){
      connected = client.connect(ws_server_url);
      delay(10000);
  }

  

}

void loop() {
  String dataJson = "{\"temp\": \"" + String(dht.readTemperature()) + "\"}";
  Serial.print(dataJson);
  client.send(dataJson);
  delay(10000);

}
