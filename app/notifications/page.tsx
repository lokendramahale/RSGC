"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Bell, AlertTriangle, CheckCircle, Clock, Trash2, MapPin, Truck, Flame } from "lucide-react"

const notifications = [
  {
    id: "NOTIF-001",
    type: "overflow",
    priority: "high",
    title: "Bin Overflow Alert",
    message: "BIN-234 at Market Square has exceeded 95% capacity",
    location: "Market Square",
    binId: "BIN-234",
    timestamp: "2 minutes ago",
    status: "unread",
    resolved: false,
  },
  {
    id: "NOTIF-002",
    type: "fire",
    priority: "critical",
    title: "Fire Sensor Alert",
    message: "Fire risk detected at BIN-567 in University Campus",
    location: "University Campus",
    binId: "BIN-567",
    timestamp: "15 minutes ago",
    status: "unread",
    resolved: false,
  },
  {
    id: "NOTIF-003",
    type: "vehicle",
    priority: "medium",
    title: "Vehicle Idle Alert",
    message: "TRK-103 has been idle for over 2 hours at Depot",
    location: "Depot",
    vehicleId: "TRK-103",
    timestamp: "1 hour ago",
    status: "read",
    resolved: false,
  },
  {
    id: "NOTIF-004",
    type: "overflow",
    priority: "high",
    title: "Bin Overflow Alert",
    message: "BIN-890 at Business District requires immediate attention",
    location: "Business District",
    binId: "BIN-890",
    timestamp: "2 hours ago",
    status: "read",
    resolved: true,
  },
  {
    id: "NOTIF-005",
    type: "maintenance",
    priority: "low",
    title: "Scheduled Maintenance",
    message: "TRK-102 is due for routine maintenance check",
    location: "Depot",
    vehicleId: "TRK-102",
    timestamp: "3 hours ago",
    status: "read",
    resolved: false,
  },
  {
    id: "NOTIF-006",
    type: "collection",
    priority: "medium",
    title: "Collection Completed",
    message: "Route A collection completed successfully by TRK-101",
    location: "Downtown Area",
    vehicleId: "TRK-101",
    timestamp: "4 hours ago",
    status: "read",
    resolved: true,
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "overflow":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "fire":
      return <Flame className="h-4 w-4 text-orange-600" />
    case "vehicle":
      return <Truck className="h-4 w-4 text-blue-600" />
    case "maintenance":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "collection":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    default:
      return <Bell className="h-4 w-4 text-gray-600" />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "critical":
      return <Badge variant="destructive">Critical</Badge>
    case "high":
      return <Badge className="bg-orange-600">High</Badge>
    case "medium":
      return <Badge variant="default">Medium</Badge>
    case "low":
      return <Badge variant="secondary">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter

    return matchesType && matchesPriority && matchesStatus
  })

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const markAsResolved = () => {
    // In a real app, this would update the backend
    console.log("Marking as resolved:", selectedNotifications)
    setSelectedNotifications([])
  }

  const deleteNotifications = () => {
    // In a real app, this would delete from backend
    console.log("Deleting notifications:", selectedNotifications)
    setSelectedNotifications([])
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex space-x-2">
            {selectedNotifications.length > 0 && (
              <>
                <Button variant="outline" onClick={markAsResolved}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Resolved ({selectedNotifications.length})
                </Button>
                <Button variant="outline" onClick={deleteNotifications}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedNotifications.length})
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Bell className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => n.status === "unread").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => n.priority === "critical").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.filter((n) => n.resolved).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Management</CardTitle>
            <CardDescription>Filter and manage system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="overflow">Overflow</SelectItem>
                  <SelectItem value="fire">Fire Alert</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">Select All</span>
              </div>

              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.status === "unread" ? "bg-blue-50 border-blue-200" : ""
                  } ${notification.resolved ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => handleSelectNotification(notification.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(notification.type)}
                          <span className="font-medium">{notification.title}</span>
                          {getPriorityBadge(notification.priority)}
                          {notification.status === "unread" && <Badge variant="outline">New</Badge>}
                          {notification.resolved && <Badge className="bg-green-600">Resolved</Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{notification.location}</span>
                        </div>
                        {notification.binId && (
                          <div className="flex items-center space-x-1">
                            <span>Bin: {notification.binId}</span>
                          </div>
                        )}
                        {notification.vehicleId && (
                          <div className="flex items-center space-x-1">
                            <span>Vehicle: {notification.vehicleId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
