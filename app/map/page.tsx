"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MapPin, Truck, Trash2, Search, Filter, Layers, Navigation, Maximize } from "lucide-react"

const bins = [
  { id: "BIN-001", lat: 40.7128, lng: -74.006, status: "normal", fillLevel: 45 },
  { id: "BIN-002", lat: 40.7505, lng: -73.9934, status: "overflow", fillLevel: 95 },
  { id: "BIN-003", lat: 40.7282, lng: -73.9942, status: "fire-alert", fillLevel: 78 },
  { id: "BIN-004", lat: 40.7614, lng: -73.9776, status: "normal", fillLevel: 62 },
  { id: "BIN-005", lat: 40.7829, lng: -73.9654, status: "normal", fillLevel: 38 },
]

const vehicles = [
  { id: "TRK-101", lat: 40.72, lng: -74.01, status: "active", driver: "John Smith" },
  { id: "TRK-102", lat: 40.74, lng: -73.99, status: "active", driver: "Sarah Wilson" },
  { id: "TRK-103", lat: 40.73, lng: -73.98, status: "maintenance", driver: "Mike Johnson" },
  { id: "TRK-104", lat: 40.75, lng: -73.97, status: "active", driver: "David Brown" },
]

export default function MapPage() {
  const [mapView, setMapView] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLayer, setSelectedLayer] = useState("both")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-600"
      case "overflow":
        return "bg-red-600"
      case "fire-alert":
        return "bg-orange-600"
      case "active":
        return "bg-blue-600"
      case "maintenance":
        return "bg-gray-600"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interactive Map</h1>
            <p className="text-muted-foreground">Real-time view of bins and vehicles across the city</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Navigation className="mr-2 h-4 w-4" />
              Center Map
            </Button>
            <Button variant="outline">
              <Maximize className="mr-2 h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Map Controls</span>
              </CardTitle>
              <CardDescription>Filter and customize the map view</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bins or vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Map View</label>
                <Select value={mapView} onValueChange={setMapView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="bins">Bins Only</SelectItem>
                    <SelectItem value="vehicles">Vehicles Only</SelectItem>
                    <SelectItem value="alerts">Alerts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Map Layer</label>
                <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Bins & Vehicles</SelectItem>
                    <SelectItem value="bins">Bins Only</SelectItem>
                    <SelectItem value="vehicles">Vehicles Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Legend</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm">Normal Bin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="text-sm">Overflow Alert</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span className="text-sm">Fire Alert</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Active Vehicle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-sm">Maintenance</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Map */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Live Map View</span>
              </CardTitle>
              <CardDescription>Interactive map showing real-time positions of bins and vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 600 400">
                    {/* Simulated roads and city layout */}
                    <path d="M0,200 L600,200" stroke="#cbd5e1" strokeWidth="4" />
                    <path d="M300,0 L300,400" stroke="#cbd5e1" strokeWidth="4" />
                    <path d="M0,100 L600,100" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M0,300 L600,300" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M150,0 L150,400" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M450,0 L450,400" stroke="#e2e8f0" strokeWidth="2" />

                    {/* City blocks */}
                    <rect x="50" y="50" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                    <rect x="200" y="50" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                    <rect x="350" y="50" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                    <rect x="50" y="250" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                    <rect x="200" y="250" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                    <rect x="350" y="250" width="80" height="40" fill="#f1f5f9" stroke="#e2e8f0" />
                  </svg>
                </div>

                {/* Bin Markers */}
                {(selectedLayer === "both" || selectedLayer === "bins") &&
                  bins.map((bin, index) => (
                    <div
                      key={bin.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        left: `${15 + index * 18}%`,
                        top: `${25 + index * 12}%`,
                      }}
                    >
                      <div className="relative group">
                        <div
                          className={`w-4 h-4 rounded-full ${getStatusColor(bin.status)} border-2 border-white shadow-lg`}
                        >
                          <Trash2 className="w-2 h-2 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        {bin.status !== "normal" && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {bin.id} - {bin.fillLevel}%
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Vehicle Markers */}
                {(selectedLayer === "both" || selectedLayer === "vehicles") &&
                  vehicles.map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        left: `${25 + index * 15}%`,
                        top: `${40 + index * 8}%`,
                      }}
                    >
                      <div className="relative group">
                        <div
                          className={`w-5 h-5 rounded-full ${getStatusColor(vehicle.status)} border-2 border-white shadow-lg flex items-center justify-center`}
                        >
                          <Truck className="w-3 h-3 text-white" />
                        </div>
                        {vehicle.status === "active" && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {vehicle.id} - {vehicle.driver}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Map Controls Overlay */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <Button size="sm" variant="secondary">
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    +
                  </Button>
                  <Button size="sm" variant="secondary">
                    -
                  </Button>
                </div>

                {/* Status Summary */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
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
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Map Actions</CardTitle>
            <CardDescription>Quick actions for map management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-16 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                Add Waypoint
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Navigation className="h-6 w-6 mb-2" />
                Plan Route
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Layers className="h-6 w-6 mb-2" />
                Toggle Layers
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Maximize className="h-6 w-6 mb-2" />
                Export Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
