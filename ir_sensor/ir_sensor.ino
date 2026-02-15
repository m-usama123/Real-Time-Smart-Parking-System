#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char* ssid = "Nigga";
const char* password = "gllc8939";

// MQTT
const char* mqtt_server = "192.168.155.44";
const int mqtt_port = 1883;

// IR sensors (3 parking slots)
#define IR1 33
#define IR2 32
#define IR3 35

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);

  pinMode(IR1, INPUT);
  pinMode(IR2, INPUT);
  pinMode(IR3, INPUT);

  // connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  // connect MQTT
  client.setServer(mqtt_server, mqtt_port);
  while (!client.connected()) {
    Serial.print("Connecting MQTT...");
    if (client.connect("ESP32_Parking")) {
      Serial.println("Connected");
    } else {
      Serial.println("Retry...");
      delay(2000);
    }
  }
}

void loop() {

  if (!client.connected()) {
    while (!client.connected()) {
      client.connect("ESP32_Parking");
      delay(2000);
    }
  }

  // read sensors
  int s1 = digitalRead(IR1);
  int s2 = digitalRead(IR2);
  int s3 = digitalRead(IR3);

  // LOW = car detected
  if (s1 == LOW) client.publish("parking/slot1", "OCCUPIED");
  else           client.publish("parking/slot1", "AVAILABLE");

  if (s2 == LOW) client.publish("parking/slot2", "OCCUPIED");
  else           client.publish("parking/slot2", "AVAILABLE");

  if (s3 == LOW) client.publish("parking/slot3", "OCCUPIED");
  else           client.publish("parking/slot3", "AVAILABLE");

  // serial print
  Serial.print("S1: "); Serial.print(s1==LOW?"OCC ":"AVL ");
  Serial.print("S2: "); Serial.print(s2==LOW?"OCC ":"AVL ");
  Serial.print("S3: "); Serial.println(s3==LOW?"OCC":"AVL");

  delay(20); // send every 20 milli sec
}
