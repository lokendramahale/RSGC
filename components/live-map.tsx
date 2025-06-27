"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Trash2, Truck } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dummy data — replace with real state or props
const bins = [
  { id: "BIN-001", lat: 23.2547, lng: 77.4021, status: "normal", fillLevel: 45 },
  { id: "BIN-002", lat: 23.2599, lng: 77.4126, status: "overflow", fillLevel: 95 },
  { id: "BIN-003", lat: 23.2670, lng: 77.4213, status: "fire-alert", fillLevel: 78 },
];

const vehicles = [
  { id: "TRK-101", lat: 23.2567, lng: 77.4062, status: "active", driver: "Ravi Kumar" },
  { id: "TRK-102", lat: 23.2620, lng: 77.4150, status: "maintenance", driver: "Priya Sharma" },
];

const selectedLayer = "both"; // sample default

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal": return "bg-green-600";
    case "overflow": return "bg-red-600";
    case "fire-alert": return "bg-orange-600";
    case "active": return "bg-blue-600";
    case "maintenance": return "bg-gray-600";
    default: return "bg-gray-400";
  }
};

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function LiveMap() {
  return (
    <div className="relative z-0">
      <MapContainer
        center={[23.2599, 77.4126]} // Bhopal
        zoom={13}
        style={{ height: "24rem", borderRadius: "0.5rem", position: "relative", zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {(selectedLayer === "both" || selectedLayer === "bins") &&
          bins.map((bin) => (
            <Marker key={bin.id} position={[bin.lat, bin.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(bin.status)} border-2 border-white shadow-lg mb-1`}></div>
                  <div className="flex items-center gap-1">
                    <Trash2 className="w-3 h-3 text-red-500" /> <strong>{bin.id}</strong>
                  </div>
                  <div>Status: {bin.status}</div>
                  <div>Fill Level: {bin.fillLevel}%</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {(selectedLayer === "both" || selectedLayer === "vehicles") &&
          vehicles.map((vehicle) => (
            <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className={`w-5 h-5 rounded-full ${getStatusColor(vehicle.status)} border-2 border-white shadow-lg flex items-center justify-center mb-1`}>
                    <Truck className="w-3 h-3 text-white" />
                  </div>
                  <div><strong>{vehicle.id}</strong></div>
                  <div>Status: {vehicle.status}</div>
                  <div>Driver: {vehicle.driver}</div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Status Summary */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[999]">
        <div className="text-sm font-medium mb-2">Quick Stats</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>{bins.filter((b) => b.status === "normal").length} Normal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span>{bins.filter((b) => b.status === "overflow").length} Overflow</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>{vehicles.filter((v) => v.status === "active").length} Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <span>{bins.filter((b) => b.status === "fire-alert").length} Fire Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
