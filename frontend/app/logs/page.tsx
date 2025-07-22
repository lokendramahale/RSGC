"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Search, Download, CalendarIcon, FileText, Truck, User, MapPin, Camera } from "lucide-react"
import { format } from "date-fns"

const logs = [
  {
    id: "LOG-001",
    date: "2024-01-15",
    time: "09:30 AM",
    binId: "BIN-001",
    location: "Main Street & 5th Ave",
    vehicle: "TRK-101",
    driver: "John Smith",
    fillLevel: 95,
    status: "completed",
    photo: true,
    notes: "Bin was overflowing, cleaned surrounding area",
  },
  {
    id: "LOG-002",
    date: "2024-01-15",
    time: "10:15 AM",
    binId: "BIN-045",
    location: "Central Park North",
    vehicle: "TRK-103",
    driver: "Mike Johnson",
    fillLevel: 87,
    status: "completed",
    photo: true,
    notes: "Regular collection",
  },
  {
    id: "LOG-003",
    date: "2024-01-15",
    time: "11:00 AM",
    binId: "BIN-078",
    location: "Shopping District",
    vehicle: "TRK-102",
    driver: "Sarah Wilson",
    fillLevel: 92,
    status: "completed",
    photo: false,
    notes: "Heavy load, required extra time",
  },
  {
    id: "LOG-004",
    date: "2024-01-15",
    time: "11:45 AM",
    binId: "BIN-112",
    location: "Residential Area A",
    vehicle: "TRK-104",
    driver: "David Brown",
    fillLevel: 78,
    status: "completed",
    photo: true,
    notes: "Standard collection",
  },
  {
    id: "LOG-005",
    date: "2024-01-15",
    time: "12:30 PM",
    binId: "BIN-156",
    location: "University Campus",
    vehicle: "TRK-105",
    driver: "Emma Davis",
    fillLevel: 85,
    status: "partial",
    photo: true,
    notes: "Bin partially full, collected as scheduled",
  },
  {
    id: "LOG-006",
    date: "2024-01-14",
    time: "02:15 PM",
    binId: "BIN-089",
    location: "Business District",
    vehicle: "TRK-101",
    driver: "John Smith",
    fillLevel: 100,
    status: "completed",
    photo: true,
    notes: "Emergency collection due to overflow",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-600">Completed</Badge>
    case "partial":
      return <Badge className="bg-orange-600">Partial</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getFillLevelColor = (level: number) => {
  if (level >= 90) return "text-red-600"
  if (level >= 70) return "text-orange-600"
  return "text-green-600"
}

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date>()

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesVehicle = vehicleFilter === "all" || log.vehicle === vehicleFilter
    const matchesDate = !dateFilter || log.date === format(dateFilter, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesVehicle && matchesDate
  })

  const exportToCSV = () => {
    const headers = [
      "Log ID",
      "Date",
      "Time",
      "Bin ID",
      "Location",
      "Vehicle",
      "Driver",
      "Fill Level",
      "Status",
      "Notes",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.id,
          log.date,
          log.time,
          log.binId,
          `"${log.location}"`,
          log.vehicle,
          `"${log.driver}"`,
          log.fillLevel,
          log.status,
          `"${log.notes}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "collection-logs.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collection Logs</h1>
            <p className="text-muted-foreground">View and analyze all garbage collection activities</p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.filter((log) => log.status === "completed").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Photos</CardTitle>
              <Camera className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.filter((log) => log.photo).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Level</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(logs.reduce((sum, log) => sum + log.fillLevel, 0) / logs.length)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Collection History</CardTitle>
            <CardDescription>Filter and search through collection logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by bin ID, location, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="TRK-101">TRK-101</SelectItem>
                  <SelectItem value="TRK-102">TRK-102</SelectItem>
                  <SelectItem value="TRK-103">TRK-103</SelectItem>
                  <SelectItem value="TRK-104">TRK-104</SelectItem>
                  <SelectItem value="TRK-105">TRK-105</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full lg:w-48">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                </PopoverContent>
              </Popover>
              {dateFilter && (
                <Button variant="outline" onClick={() => setDateFilter(undefined)}>
                  Clear Date
                </Button>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Bin ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Fill Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{log.date}</span>
                          <span className="text-xs text-muted-foreground">{log.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.binId}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="max-w-32 truncate">{log.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{log.vehicle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{log.driver}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={log.fillLevel} className="w-16" />
                          <span className={`text-sm font-medium ${getFillLevelColor(log.fillLevel)}`}>
                            {log.fillLevel}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        {log.photo ? (
                          <Camera className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="max-w-32 truncate block" title={log.notes}>
                          {log.notes}
                        </span>
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
