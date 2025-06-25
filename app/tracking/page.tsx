"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MapPin, Truck, Play, Pause, RotateCcw, Navigation, Clock } from "lucide-react"

const vehicles = [
  {
    id: "TRK-101",
    driver: "John Smith",
    status: "active",
    location: { lat: 40.7128, lng: -74.006, address: "Downtown Area" },
    route: "Route A",
    speed: 25,
    lastUpdate: "1 min ago",
  },
  {
    id: "TRK-102",
    driver: "Sarah Wilson",
    status: "active",
    location: { lat: 40.7505, lng: -73.9934, address: "Commercial District" },
    route: "Route B",
    speed: 30,
    lastUpdate: "2 min ago",
  },
  {
    id: "TRK-103",
    driver: "Mike Johnson",
    status: "maintenance",
    location: { lat: 40.7282, lng: -73.9942, address: "Depot" },
    route: "N/A",
    speed: 0,
    lastUpdate: "2 hours ago",
  },
  {
    id: "TRK-104",
    driver: "David Brown",
    status: "inactive",
    location: { lat: 40.7614, lng: -73.9776, address: "Residential Area" },
    route: "Route C",
    speed: 0,
    lastUpdate: "1 hour ago",
  },
  {
    id: "TRK-105",
    driver: "Emma Davis",
    status: "active",
    location: { lat: 40.7829, lng: -73.9654, address: "University Campus" },
    route: "Route D",
    speed: 22,
    lastUpdate: "30 sec ago",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600">Active</Badge>
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>
    case "maintenance":
      return <Badge variant="destructive">Maintenance</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function TrackingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState("all")
  const [isPlaying, setIsPlaying] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setLastUpdate(new Date())
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isPlaying])

  const filteredVehicles = selectedVehicle === "all" ? vehicles : vehicles.filter((v) => v.id === selectedVehicle)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Vehicle Tracking</h1>
            <p className="text-muted-foreground">Real-time monitoring of your fleet locations and routes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Resume"} Tracking
            </Button>
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Controls</CardTitle>
            <CardDescription>Filter and control the live tracking display</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.id} - {vehicle.driver}
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
          {/* Map Placeholder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Live Map View</CardTitle>
              <CardDescription>Real-time vehicle positions and routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    {/* Simulated roads */}
                    <path d="M0,150 L400,150" stroke="#cbd5e1" strokeWidth="3" />
                    <path d="M200,0 L200,300" stroke="#cbd5e1" strokeWidth="3" />
                    <path d="M0,75 L400,75" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M0,225 L400,225" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M100,0 L100,300" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M300,0 L300,300" stroke="#e2e8f0" strokeWidth="2" />
                  </svg>
                </div>

                {/* Vehicle Markers */}
                {filteredVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                  >
                    <div className="relative">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          vehicle.status === "active"
                            ? "bg-green-600"
                            : vehicle.status === "inactive"
                              ? "bg-gray-600"
                              : "bg-red-600"
                        }`}
                      >
                        <Truck className="w-3 h-3" />
                      </div>
                      {vehicle.status === "active" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {vehicle.id}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="text-sm font-medium mb-2">Legend</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span>Active Vehicle</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <span>Inactive Vehicle</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span>Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle List */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Status</CardTitle>
              <CardDescription>Current status of all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
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
                        <span>{vehicle.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-3 w-3" />
                        <span>{vehicle.route}</span>
                      </div>
                      {vehicle.status === "active" && (
                        <div className="flex items-center space-x-2">
                          <span>Speed: {vehicle.speed} mph</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{vehicle.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route History */}
        <Card>
          <CardHeader>
            <CardTitle>Route Playback</CardTitle>
            <CardDescription>View historical routes and replay vehicle movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col">
                <Play className="h-6 w-6 mb-2" />
                Replay Today's Routes
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <RotateCcw className="h-6 w-6 mb-2" />
                View Yesterday
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                Custom Date Range
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
