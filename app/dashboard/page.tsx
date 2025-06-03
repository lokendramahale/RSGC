"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trash2, Truck, AlertTriangle, CheckCircle, TrendingUp, MapPin, Clock, Users } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

const metrics = [
  {
    title: "Total Bins",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Trash2,
    color: "text-blue-600",
  },
  {
    title: "Active Vehicles",
    value: "23",
    change: "+2",
    trend: "up",
    icon: Truck,
    color: "text-green-600",
  },
  {
    title: "Overflow Alerts",
    value: "8",
    change: "-3",
    trend: "down",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    title: "Collections Today",
    value: "156",
    change: "+24%",
    trend: "up",
    icon: CheckCircle,
    color: "text-emerald-600",
  },
]

const recentLogs = [
  {
    id: "BIN-001",
    location: "Main Street & 5th Ave",
    vehicle: "TRK-101",
    driver: "John Smith",
    time: "2 hours ago",
    status: "completed",
    fillLevel: 95,
  },
  {
    id: "BIN-045",
    location: "Central Park North",
    vehicle: "TRK-103",
    driver: "Mike Johnson",
    time: "3 hours ago",
    status: "completed",
    fillLevel: 87,
  },
  {
    id: "BIN-078",
    location: "Shopping District",
    vehicle: "TRK-102",
    driver: "Sarah Wilson",
    time: "4 hours ago",
    status: "in-progress",
    fillLevel: 92,
  },
  {
    id: "BIN-112",
    location: "Residential Area A",
    vehicle: "TRK-104",
    driver: "David Brown",
    time: "5 hours ago",
    status: "completed",
    fillLevel: 78,
  },
]

const binAlerts = [
  {
    id: "BIN-234",
    location: "Market Square",
    type: "overflow",
    priority: "high",
    time: "15 min ago",
  },
  {
    id: "BIN-567",
    location: "University Campus",
    type: "fire-risk",
    priority: "critical",
    time: "1 hour ago",
  },
  {
    id: "BIN-890",
    location: "Business District",
    type: "overflow",
    priority: "medium",
    time: "2 hours ago",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your waste management system.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Collection Logs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Collection Logs</CardTitle>
              <CardDescription>Latest bin collections and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{log.id}</span>
                          <Badge variant={log.status === "completed" ? "default" : "secondary"}>{log.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.location}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Truck className="mr-1 h-3 w-3" />
                            {log.vehicle}
                          </span>
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {log.driver}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {log.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{log.fillLevel}%</div>
                      <Progress value={log.fillLevel} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Bins requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {binAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        alert.priority === "critical"
                          ? "text-red-600"
                          : alert.priority === "high"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{alert.id}</span>
                        <Badge
                          variant={
                            alert.priority === "critical"
                              ? "destructive"
                              : alert.priority === "high"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.location}</p>
                      <p className="text-xs text-muted-foreground capitalize">{alert.type.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col">
                <Trash2 className="h-6 w-6 mb-2" />
                Add New Bin
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Truck className="h-6 w-6 mb-2" />
                Dispatch Vehicle
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="h-6 w-6 mb-2" />
                View Live Map
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
