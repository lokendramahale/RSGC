"use client";

import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const vehicleIcon = new L.Icon({
  iconUrl: "garbage-truck.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const binIcon = new L.Icon({
  iconUrl: "recycle-bin.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

type Vehicle = {
  id: string;
  lat: number;
  lng: number;
  driver: string;
  status: string;
};

type Bin = {
  id: string;
  lat: number;
  lng: number;
  status: string;
  fillLevel: number;
};

type Location = {
  vehicle_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
};

type Props = {
  bins?: Bin[];
  vehicles?: Vehicle[];
  showBins?: boolean;
  showVehicles?: boolean;
  mode?: "overview" | "tracking";
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function LiveMap({
  bins = [],
  vehicles = [],
  showBins = true,
  showVehicles = true,
  mode = "overview",
}: Props) {
  const [vehiclePaths, setVehiclePaths] = useState<Record<string, Location[]>>({});

  useEffect(() => {
    if (mode === "tracking") {
      const token = localStorage.getItem("rsgc_token");

      const fetchLocations = async () => {
        try {
          const res = await axios.get(`${API_BASE}/map/vehicleLocations`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const raw = res.data.vehicles;
          const locations: Location[] = raw.map((v: any) => ({
            vehicle_id: v.id,
            latitude: parseFloat(v.lat),
            longitude: parseFloat(v.lng),
            timestamp: v.timestamp,
            speed: parseFloat(v.speed || 0),
            heading: parseFloat(v.heading || 0),
          }));

          const grouped: Record<string, Location[]> = {};
          for (const loc of locations) {
            if (!grouped[loc.vehicle_id]) grouped[loc.vehicle_id] = [];
            grouped[loc.vehicle_id].push(loc);
          }

          for (const v in grouped) {
            grouped[v].sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          }

          setVehiclePaths(grouped);
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };

      fetchLocations();

      const socket = io("https://rsgc.onrender.com", {
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket.id);
      });

      socket.on("vehicle-location", (live: Location) => {
        console.log("Live location update:", live);

        setVehiclePaths((prev) => {
          const updated = { ...prev };
          if (!updated[live.vehicle_id]) updated[live.vehicle_id] = [];
          updated[live.vehicle_id].push(live);
          return updated;
        });
      });

      const cleanupInterval = setInterval(() => {
        const now = Date.now();
        setVehiclePaths((prev) => {
          const updated: typeof prev = {};

          for (const [vehicleId, path] of Object.entries(prev)) {
            if (path.length === 0) continue;

            const lastTime = new Date(path[path.length - 1].timestamp).getTime();
            const isRecent = now - lastTime < 50000;

            if (isRecent) {
              updated[vehicleId] = path;
            }
          }

          return updated;
        });
      }, 5000);

      return () => {
        socket.disconnect();
        clearInterval(cleanupInterval);
      };
    }
  }, [mode]);

  const uniqueVehicles = Array.from(new Map(vehicles.map((v) => [v.id, v])).values());

  return (
    <MapContainer
      center={[23.2599, 77.4126]}
      zoom={13}
      style={{ height: "24rem", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {showBins &&
        bins.map(
          (bin) =>
            bin.lat &&
            bin.lng && (
              <Marker key={`bin-${bin.id}`} position={[bin.lat, bin.lng]} icon={binIcon}>
                <Popup>
                  <strong>Bin {bin.id}</strong>
                  <br />
                  Status: {bin.status}
                  <br />
                  Fill: {bin.fillLevel}%
                </Popup>
              </Marker>
            )
        )}

      {showVehicles &&
        mode === "overview" &&
        uniqueVehicles.map(
          (v) =>
            v.lat &&
            v.lng && (
              <Marker key={`v-${v.id}`} position={[v.lat, v.lng]} icon={vehicleIcon}>
                <Popup>
                  <strong>{v.id}</strong>
                  <br />
                  Driver: {v.driver}
                  <br />
                  Status: {v.status}
                </Popup>
              </Marker>
            )
        )}

      {mode === "tracking" &&
        Object.entries(vehiclePaths).map(([vehicleId, path]) =>
          path.length > 0 ? (
            <Polyline
              key={`poly-${vehicleId}`}
              positions={path.map((p) => [p.latitude, p.longitude])}
              color="blue"
            />
          ) : null
        )}

      {mode === "tracking" &&
        Object.entries(vehiclePaths).map(([vehicleId, path]) => {
          if (path.length === 0) return null;
          const last = path[path.length - 1];
          return (
            <Marker
              key={`last-${vehicleId}`}
              position={[last.latitude, last.longitude]}
              icon={vehicleIcon}
            >
              <Popup>
                <strong>Vehicle: {vehicleId}</strong>
                <br />
                Last updated: {new Date(last.timestamp).toLocaleTimeString()}
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
