"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, Edit, Trash2, Truck, User, Clock, Fuel } from "lucide-react"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface Vehicle {
  id: string
  driver: string
  status: string
  route: string
  fuelLevel: number
  collectionsToday: number
  lastActive: string
  driver_id?: string
}

interface Driver {
  id: string
  name: string
}

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

const getFuelLevelColor = (level: number) => {
  if (level <= 25) return "text-red-600"
  if (level <= 50) return "text-orange-600"
  return "text-green-600"
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [newVehicle, setNewVehicle] = useState({ id: "", driver_id: "", route: "" })
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem("rsgc_token"))
    setLoading(false)
  }, [])

  const fetchVehicles = async () => {
    try {
      if (!token) return
      const res = await axios.get(`${API_BASE}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVehicles(Array.isArray(res.data?.data) ? res.data.data : [])
    } catch (error) {
      console.error("Error fetching vehicles:", error)
    }
  }

  const fetchDrivers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/users?role=driver`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setDrivers(Array.isArray(res.data) ? res.data : [])
  } catch (err) {
    console.error("Error fetching drivers:", err)
    setDrivers([])
  }
}


  const handleAddVehicle = async () => {
  try {
    if (!newVehicle.id || !newVehicle.driver_id || !newVehicle.route) {
      alert("Please fill all fields.")
      return
    }

    await axios.post(`${API_BASE}/vehicles`, {
      id: newVehicle.id,
      driver_id: newVehicle.driver_id,
      route: newVehicle.route,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    setIsAddDialogOpen(false)
    setNewVehicle({ id: "", driver_id: "", route: "" }) // Reset form
    fetchVehicles()
  } catch (err: any) {
    console.error("Error adding vehicle:", err.response?.data || err.message)
    alert("Failed to add vehicle.")
  }
}


  useEffect(() => {
    if (token) {
      fetchVehicles()
      fetchDrivers()
    }
  }, [token])

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const deleteVehicle = async (id: string) => {
    try {
      const res = await axios.delete(`${API_BASE}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVehicles((prev) => prev.filter((v) => v.id !== id))
    } catch (err: any) {
      console.error("Failed to delete vehicle:", err.response?.data || err.message)
    }
  }

  const handleDeleteConfirmed = async (id: string) => {
    await deleteVehicle(id)
    setConfirmDeleteId(null)
  }

  if (loading) return null
  if (!token) return <div>Please log in to view this page.</div>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage your fleet of garbage collection vehicles
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>Enter the details for the new vehicle</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicleId" className="text-right">
                    Vehicle ID
                  </Label>
                  <Input
                    id="vehicleId"
                    placeholder="TRK-106"
                    className="col-span-3"
                    value={newVehicle.id}
                    onChange={(e) => setNewVehicle({ ...newVehicle, id: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="driver" className="text-right">
                    Driver
                  </Label>
                 <Select
  value={newVehicle.driver_id}
  onValueChange={(value) => setNewVehicle({ ...newVehicle, driver_id: value })}
>
  <SelectTrigger className="col-span-3">
    <SelectValue placeholder="Select driver" />
  </SelectTrigger>
  <SelectContent>
    {drivers.length > 0 ? (
      drivers.map((driver) => (
        <SelectItem key={driver.id} value={driver.id}>
          {driver.name}
        </SelectItem>
      ))
    ) : (
      <div className="px-4 py-2 text-sm text-muted-foreground">No drivers found</div>
    )}
  </SelectContent>
</Select>

                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="route" className="text-right">
                    Route
                  </Label>
                  <Input
                    id="route"
                    placeholder="Route E"
                    className="col-span-3"
                    value={newVehicle.route}
                    onChange={(e) => setNewVehicle({ ...newVehicle, route: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddVehicle}>
                  Add Vehicle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter(v => v.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
              <Truck className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter(v => v.status === "maintenance").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Collections Today</CardTitle>
              <Trash2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.reduce((sum, v) => sum + (v.collectionsToday || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>Manage your vehicle fleet and driver assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by vehicle ID or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Fuel Level</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.id}</TableCell>
                      <TableCell className="flex items-center gap-2"><User className="w-4 h-4" />{vehicle.driver}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell>{vehicle.route}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Fuel className="w-4 h-4 text-muted-foreground" />
                        <span className={getFuelLevelColor(vehicle.fuelLevel)}>{vehicle.fuelLevel}%</span>
                      </TableCell>
                      <TableCell>{vehicle.collectionsToday}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {vehicle.lastActive}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setConfirmDeleteId(vehicle.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white border rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-2 text-center">Delete Vehicle</h2>
            <p className="text-sm text-center mb-4">Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleDeleteConfirmed(confirmDeleteId!)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
