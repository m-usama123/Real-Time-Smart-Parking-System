// Smart Parking Dashboard (MQTT only) - simplest version
// Requires MQTT over WebSockets (Paho)

const MQTT_BROKER = "localhost";   // change if broker is on another PC (e.g. 192.168.43.xxx)
const MQTT_PORT   = 9001;          // websocket port (commonly 9001 for Mosquitto)
const MQTT_PATH   = "/mqtt";       // keep "/mqtt" if your broker uses it; otherwise try "/"
const MQTT_SUB    = "parking/#";   // subscribe to all slots

const brokerLabel = document.getElementById("broker-label");
brokerLabel.textContent = `${MQTT_BROKER}:${MQTT_PORT}`;

const mqttStatusText = document.getElementById("mqtt-status-text");
const mqttStatusBox  = document.getElementById("mqtt-status");

const slotEls = {
  "parking/slot1": document.getElementById("slot1-state"),
  "parking/slot2": document.getElementById("slot2-state"),
  "parking/slot3": document.getElementById("slot3-state"),
};

const logEl = document.getElementById("log");
document.getElementById("clear-log").onclick = () => (logEl.innerHTML = "");

function setMQTTStatus(connected, text) {
  mqttStatusText.textContent = text;
  mqttStatusBox.className = connected ? "status connected" : "status disconnected";
}

function addLog(text) {
  const div = document.createElement("div");
  div.className = "log-row";
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  logEl.prepend(div);
  // keep last 80 lines
  if (logEl.children.length > 80) logEl.removeChild(logEl.lastChild);
}

function setSlot(topic, status) {
  const el = slotEls[topic];
  if (!el) return;

  const s = (status || "").toUpperCase().trim();
  el.textContent = s || "UNKNOWN";

  el.classList.remove("available", "occupied", "unknown");
  if (s === "AVAILABLE") el.classList.add("available");
  else if (s === "OCCUPIED") el.classList.add("occupied");
  else el.classList.add("unknown");
}

let client = null;

function connectMQTT() {
  setMQTTStatus(false, "MQTT: Connecting...");

  const clientId = "dashboard_" + Math.random().toString(16).slice(2, 10);
  client = new Paho.MQTT.Client(MQTT_BROKER, Number(MQTT_PORT), MQTT_PATH, clientId);

  client.onConnectionLost = (res) => {
    setMQTTStatus(false, "MQTT: Disconnected");
    if (res && res.errorMessage) addLog("MQTT lost: " + res.errorMessage);
    // auto-reconnect
    setTimeout(connectMQTT, 2000);
  };

  client.onMessageArrived = (message) => {
    const topic = message.destinationName;
    const payload = (message.payloadString || "").trim();

    setSlot(topic, payload);
    addLog(`${topic} -> ${payload}`);
  };

  client.connect({
    timeout: 10,
    onSuccess: () => {
      setMQTTStatus(true, "MQTT: Connected");
      addLog("Connected. Subscribed to " + MQTT_SUB);
      client.subscribe(MQTT_SUB);
    },
    onFailure: (err) => {
      setMQTTStatus(false, "MQTT: Failed (retrying...)");
      addLog("MQTT connect failed: " + (err?.errorMessage || "unknown"));
      setTimeout(connectMQTT, 2000);
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addLog("Dashboard loaded");
  connectMQTT();
});
