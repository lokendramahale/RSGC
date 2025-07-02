"use client";

import dynamic from 'next/dynamic';
import {DashboardLayout} from '@/components/dashboard-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Truck, Trash2, Search, Filter, Layers, Navigation, Maximize } from "lucide-react"
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
const LiveMap = dynamic(() => import('@/components/live-map'), {
  ssr: false, // disables server-side rendering
});



export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mapView, setMapView] = useState("all")
  const [selectedLayer, setSelectedLayer] = useState("both")
  const [vehicles, setVehicles] = useState([])
  const [bins, setBins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [vehicleRes, binRes] = await Promise.all([
        api.getVehicleLocations(),
        api.getBinLocations(),
      ])

      setVehicles(vehicleRes.vehicles || [])
      setBins(binRes.bins || [])
    } catch (err: any) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch vehicle or bin data")
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [])
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
      <h1 className="text-xl font-bold mb-4">Live Map</h1>
      <LiveMap mode="overview" showVehicles={true} showBins={true} vehicles={vehicles} bins={bins} />

            </Card>
          </div>
      </div>
    </DashboardLayout>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

