# Smart Parking System (ESP32 + MQTT)

A simple IoT-based **Smart Parking Monitoring System** using an ESP32 microcontroller and three IR sensors to detect vehicle presence in parking slots.

The ESP32 publishes parking slot availability through **MQTT**, and a web dashboard displays the real-time status of each parking space.

The system shows whether each slot is:
- `AVAILABLE`
- `OCCUPIED`

---

## Features

- Monitoring of three parking slots
- Real-time updates using MQTT
- Lightweight web dashboard
- No database required
- Operates on a WiFi hotspot (Laptop or Mobile)
- Simple and fast setup

---

## Hardware Requirements

- ESP32 Development Board
- 3 × IR Obstacle Sensors
- Jumper Wires
- USB Cable
- Laptop/PC (for MQTT Broker and Dashboard)

### Pin Connections

| Parking Slot       | ESP32 Pin |
|--------------------|-----------|
| Slot 1 IR Sensor   | GPIO 33   |
| Slot 2 IR Sensor   | GPIO 32   |
| Slot 3 IR Sensor   | GPIO 35   |

> GPIO 35 is input-only and ideal for sensors.

---

## Software Requirements

- Windows 10/11
- Arduino IDE
- ESP32 Board Support in Arduino IDE
- Mosquitto MQTT Broker
- Web Browser (Chrome recommended)
- Visual Studio Code (optional)
- Git (optional)

---

## Project Architecture

ESP32 → MQTT Broker (Mosquitto) → Web Dashboard

### MQTT Topics

```
parking/slot1
parking/slot2
parking/slot3
```

### Messages

```
AVAILABLE
OCCUPIED
```

---

## Uploading ESP32 Code

Open the Arduino sketch and edit the following:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_COMPUTER_IP";
```

### Finding Your Computer's IP Address

Open Command Prompt and run:

```
ipconfig
```

Look for the line:

```
IPv4 Address: 192.168.xxx.xxx
```

Upload the code and open the Serial Monitor (set baud rate to 115200).

---

## Installing Mosquitto MQTT Broker

Download Mosquitto from: [https://mosquitto.org/download/](https://mosquitto.org/download/)

Create a `mosquitto.conf` file in:

```
C:\Program Files\mosquitto
```

Add the following content to the file:

```
listener 1883

listener 9001
protocol websockets

allow_anonymous true
log_dest stdout
```

Run the broker using the command:

```
mosquitto -c "C:\Program Files\mosquitto\mosquitto.conf" -v
```

---

## Running the Web Dashboard

Open `index.html` in a browser or use **VS Code → Live Server**.

Edit `script.js` to configure the MQTT broker:

```js
const MQTT_BROKER = "YOUR_COMPUTER_IP";
const MQTT_PORT = 9001;
```

---

## How It Works

1. IR sensors detect the presence of a car.
2. The ESP32 publishes an MQTT message.
3. The web dashboard subscribes to the MQTT topics and updates the status instantly.

### Example

- When a car parks:

```
parking/slot1 → OCCUPIED
```

- When a car leaves:

```
parking/slot1 → AVAILABLE
```

---

## Troubleshooting

### ESP32 Not Connecting
- Verify WiFi name and password.
- Ensure the ESP32 and MQTT broker are on the same network.

### MQTT Not Working
- Ensure Mosquitto is running.
- Verify the IP address.

### Website Not Updating
- Check the browser console (F12).
- Ensure the MQTT port (9001) is correct.

> **Note:** Restarting the hotspot changes the IP address. Update the IP in both the ESP32 code and `script.js`.

---

## Folder Structure

```
Real-Time-Smart-Parking-System/
│
├── ir_sensor/
│   └── ir_sensor.ino
├── web_server/
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── README.md
```

---

## Notes

- Real-time system (no database required)
- Operates on LAN/WiFi
- Designed for academic/FYP demonstration

---

## Future Improvements

- Mobile App Integration
- License Plate Detection
- Cloud Server Integration
