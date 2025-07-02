"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  MapPin,
  Truck,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const LiveMap = dynamic(() => import("@/components/live-map"), {
  ssr: false,
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600">Active</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "maintenance":
      return <Badge variant="destructive">Maintenance</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function TrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "admin") {
        router.replace("/unauthorized");
        return;
      }

      const fetchData = async () => {
        try {
          const res = await api.getVehicleLocations();
          console.log("Fetched vehicle locations:", res);
          setVehicles(res.vehicles);
        } catch (err) {
          console.error("Failed to fetch vehicle locations", err);
        }
      };

      fetchData();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const filteredVehicles =
    selectedVehicle === "all"
      ? vehicles
      : vehicles.filter((v) => v.id === selectedVehicle);

  // Remove duplicates from overall list
  const uniqueVehicles = Array.from(
    new Map(vehicles.map((v) => [v.id, v])).values()
  );

  // Remove duplicates from filtered list
  const uniqueFilteredVehicles = Array.from(
    new Map(filteredVehicles.map((v) => [v.id, v])).values()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Live Vehicle Tracking
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring of your fleet
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isPlaying ? "Pause" : "Resume"} Tracking
            </Button>
            <Button variant="outline" onClick={() => setLastUpdate(new Date())}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tracking Controls</CardTitle>
            <CardDescription>
              Filter and control the live tracking display
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select
                value={selectedVehicle}
                onValueChange={setSelectedVehicle}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {uniqueVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                      {vehicle.id} - {vehicle.driver || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Live Map View</CardTitle>
              <CardDescription>Vehicle Routes & Last Positions</CardDescription>
            </CardHeader>
            <CardContent>
              <LiveMap mode="tracking" vehicles={vehicles} showVehicles />
            </CardContent>
          </Card>

          {/* Vehicle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
              <CardDescription>Current status of all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uniqueFilteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{vehicle.id}</span>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Navigation className="h-3 w-3" />
                        <span>{vehicle.driver}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{vehicle.location?.address || "Unknown"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-3 w-3" />
                        <span>{vehicle.route || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
