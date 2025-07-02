"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { ca } from "date-fns/locale"

interface Bin {
  id: string
  location_name: string
  area: string
  fill_level: number
  status: string
  last_collected: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
const getStatusIcon = (status: string) => {
  switch (status) {
    case "overflow":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "fire":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "overflow":
      return <Badge variant="destructive">Overflow</Badge>
    case "fire":
      return (
        <Badge variant="default" className="bg-orange-600">
          Fire Alert
        </Badge>
      )
    case "active":
      return (
        <Badge variant="default" className="bg-green-600">
          Active
        </Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getFillLevelColor = (level: number) => {
  if (level >= 90) return "text-red-600"
  if (level >= 70) return "text-orange-600"
  return "text-green-600"
}

export default function BinsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [areaFilter, setAreaFilter] = useState("all")
  const [bins, setBins] = useState<Bin[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null)
  const [editingBin, setEditingBin] = useState<Bin | null>(null)
const [fillLevel, setFillLevel] = useState<number | undefined>(undefined)
const [temperature, setTemperature] = useState<number | undefined>(undefined)
const [gasLevel, setGasLevel] = useState<number | undefined>(undefined)
const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
const [newBin, setNewBin] = useState({
  id: "",
  location_name: "",
  area: "",
  status: "active",
})


  const fetchBins = async () => {
    try {
      const token = localStorage.getItem("rsgc_token")
      const res = await axios.get(`${API_BASE}/bins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setBins(res.data)
    } catch (err) {
      console.error("Error loading bins:", err)
    }
  }

  useEffect(() => {
    fetchBins()
  }, [])

  const confirmDelete = (id: string) => {
    setSelectedBinId(id)
    setShowConfirm(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedBinId) return
    try {
      const token = localStorage.getItem("rsgc_token")
      const res = await axios.delete(`${API_BASE}/bins/${selectedBinId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setBins(bins.filter((bin) => bin.id !== selectedBinId))
    } catch (err) {
      console.error("Error deleting bin:", err)
    } finally {
      setShowConfirm(false)
      setSelectedBinId(null)
    }
  }

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bin.status === statusFilter
    const matchesArea = areaFilter === "all" || bin.area === areaFilter
    return matchesSearch && matchesStatus && matchesArea
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        {/* ✅ Delete Confirmation Popup */}
        {showConfirm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-80">
      <h2 className="text-lg font-semibold mb-2 text-center">Delete Bin</h2>
      <p className="text-sm text-center mb-4">Are you sure you want to delete this bin?</p>
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => setShowConfirm(false)}>
          Cancel
        </Button>
        <button
  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
  onClick={handleDeleteConfirmed}
>
  Delete
</button>

      </div>
    </div>
  </div>
)}

{editingBin && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white border rounded-lg shadow-lg p-6 w-[28rem] space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">Edit Bin</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Location Name</label>
        <Input
          type="text"
          value={editingBin.location_name}
          onChange={(e) =>
            setEditingBin({ ...editingBin, location_name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Area</label>
        <Input
          type="text"
          value={editingBin.area}
          onChange={(e) =>
            setEditingBin({ ...editingBin, area: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          value={editingBin.status}
          onValueChange={(value) =>
            setEditingBin({ ...editingBin, status: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white z-[60]">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overflow">Overflow</SelectItem>
            <SelectItem value="fire">Fire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setEditingBin(null)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              const token = localStorage.getItem("rsgc_token")
              const res = await axios.patch(
                `${API_BASE}/bins/${editingBin.id}`,
                {
                  location_name: editingBin.location_name,
                  area: editingBin.area,
                  status: editingBin.status,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              )

              setEditingBin(null)
              await fetchBins()
            } catch (err) {
              console.error("Error updating bin:", err)
              alert("Error updating bin. See console.")
            }
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  </div>
)}

{isAddDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white border rounded-lg shadow-lg p-6 w-[28rem] space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2">Add New Bin</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Bin ID</label>
        <Input
          value={newBin.id}
          onChange={(e) => setNewBin({ ...newBin, id: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location Name</label>
        <Input
          value={newBin.location_name}
          onChange={(e) => setNewBin({ ...newBin, location_name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Area</label>
        <Input
          value={newBin.area}
          onChange={(e) => setNewBin({ ...newBin, area: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          value={newBin.status}
          onValueChange={(value) => setNewBin({ ...newBin, status: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black z-[60]">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overflow">Overflow</SelectItem>
            <SelectItem value="fire">Fire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              const token = localStorage.getItem("rsgc_token")
              const res = await axios.post(`${API_BASE}/bins`, newBin, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                
              })

              if (res.status !== 201) {
                throw new Error("Failed to add new bin")
              }

              await fetchBins()
              setNewBin({ id: "", location_name: "", area: "", status: "active" })
              setIsAddDialogOpen(false)
            } catch (err) {
              console.error("Error adding bin:", err)
              alert("Error adding bin. See console.")
            }
          }}
        >
          Add Bin
        </Button>
      </div>
    </div>
  </div>
)}


        {/* Your page content remains unchanged below */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bin Management</h1>
            <p className="text-muted-foreground">Monitor and manage all garbage bins across the city</p>
          </div>
         <Button onClick={() => setIsAddDialogOpen(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Add New Bin
</Button>
 
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bins.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bins.filter((bin) => bin.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overflow Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bins.filter((bin) => bin.status === "overflow").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bin Inventory</CardTitle>
            <CardDescription>Search and filter bins by location, status, or area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by bin ID or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black shadow-md z-[60]">

                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overflow">Overflow</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                </SelectContent>
              </Select>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by area" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black shadow-md z-[60]">

                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="Downtown">Downtown</SelectItem>
                  <SelectItem value="Midtown">Midtown</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bin ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Fill Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Collected</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBins.map((bin: Bin) => (
                    <TableRow key={bin.id}>
                      <TableCell className="font-medium">{bin.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{bin.location_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bin.area}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={bin.fill_level} className="w-16" />
                          <span className={`text-sm font-medium ${getFillLevelColor(bin.fill_level)}`}>
                            {bin.fill_level}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(bin.status)}
                          {getStatusBadge(bin.status)}
                        </div>
                      </TableCell>
                      <TableCell>{bin.last_collected || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => {
                              setEditingBin(bin)
                                }}>
                                    <Edit className="h-4 w-4" />
                       </Button>

                          <Button variant="ghost" size="icon">
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => confirmDelete(bin.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </DashboardLayout>
  )
}
