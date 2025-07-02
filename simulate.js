const axios = require("axios");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OWQ2NWUxZS0yOWU1LTQ0OWItODU2MC00MTllOThkNDM3MTAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTEzMDk3ODMsImV4cCI6MTc1MTkxNDU4M30.maR6_w9_BVyFZGwd7BLDXDBlFlazp0_ChyEKFHTtuf4"; // Paste your token here
const vehicleId = "3bb5732e-b42a-4140-8acb-95a1b5bc91ce";

const path = [
  [23.231918, 77.403925],
  [23.232707, 77.404604],
  [23.233364, 77.405338],
  [23.233900, 77.406080],
  [23.234400, 77.406899],
  [23.234875, 77.407598],
  [23.235520, 77.408393],
  [23.236013, 77.409024],
  [23.236584, 77.409617],
  [23.237262, 77.410220],
  [23.237840, 77.410900],
  [23.238388, 77.411643],
  [23.238910, 77.412347],
  [23.239544, 77.413020],
  [23.240050, 77.413650],
  [23.240655, 77.414251],
  [23.241227, 77.414920],
  [23.241879, 77.415512],
  [23.242520, 77.416102],
  [23.243120, 77.416700],
];


let index = 0;

const simulateMovement = async () => {
  if (index >= path.length) {
    console.log("Simulation finished");
    return;
  }

  const [lat, lng] = path[index++];
  const payload = {
    vehicle_id: vehicleId,
    latitude: lat,
    longitude: lng,
    speed: 30,
    heading: 90,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await axios.post("http://localhost:5000/api/map/updateLocation", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Sent point:", payload);
  } catch (err) {
    console.error("Error sending location", err.message);
  }

  setTimeout(simulateMovement, 3000); // Wait 3s and send next
};

simulateMovement();
