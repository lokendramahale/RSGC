"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Plus, Search, MapPin, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const bins = [
  {
    id: "BIN-001",
    location: "Main Street & 5th Ave",
    area: "Downtown",
    fillLevel: 85,
    status: "normal",
    lastCollected: "2 hours ago",
    coordinates: "40.7128, -74.0060",
  },
  {
    id: "BIN-002",
    location: "Central Park North",
    area: "Midtown",
    fillLevel: 95,
    status: "overflow",
    lastCollected: "1 day ago",
    coordinates: "40.7829, -73.9654",
  },
  {
    id: "BIN-003",
    location: "Shopping District",
    area: "Commercial",
    fillLevel: 60,
    status: "normal",
    lastCollected: "4 hours ago",
    coordinates: "40.7505, -73.9934",
  },
  {
    id: "BIN-004",
    location: "University Campus",
    area: "Educational",
    fillLevel: 78,
    status: "fire-alert",
    lastCollected: "6 hours ago",
    coordinates: "40.7282, -73.9942",
  },
  {
    id: "BIN-005",
    location: "Residential Area A",
    area: "Residential",
    fillLevel: 45,
    status: "normal",
    lastCollected: "3 hours ago",
    coordinates: "40.7614, -73.9776",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "overflow":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "fire-alert":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case "normal":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "overflow":
      return <Badge variant="destructive">Overflow</Badge>
    case "fire-alert":
      return (
        <Badge variant="default" className="bg-orange-600">
          Fire Alert
        </Badge>
      )
    case "normal":
      return (
        <Badge variant="default" className="bg-green-600">
          Normal
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

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bin.status === statusFilter
    const matchesArea = areaFilter === "all" || bin.area === areaFilter

    return matchesSearch && matchesStatus && matchesArea
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bin Management</h1>
            <p className="text-muted-foreground">Monitor and manage all garbage bins across the city</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Bin
          </Button>
        </div>

        {/* Stats Cards */}
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
              <CardTitle className="text-sm font-medium">Normal Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bins.filter((bin) => bin.status === "normal").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overflow Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bins.filter((bin) => bin.status === "overflow").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fire Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bins.filter((bin) => bin.status === "fire-alert").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="overflow">Overflow</SelectItem>
                  <SelectItem value="fire-alert">Fire Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="Downtown">Downtown</SelectItem>
                  <SelectItem value="Midtown">Midtown</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bins Table */}
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
                  {filteredBins.map((bin) => (
                    <TableRow key={bin.id}>
                      <TableCell className="font-medium">{bin.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{bin.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bin.area}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={bin.fillLevel} className="w-16" />
                          <span className={`text-sm font-medium ${getFillLevelColor(bin.fillLevel)}`}>
                            {bin.fillLevel}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(bin.status)}
                          {getStatusBadge(bin.status)}
                        </div>
                      </TableCell>
                      <TableCell>{bin.lastCollected}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
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
