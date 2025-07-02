"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Trash2,
  Truck,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MapPin,
  Clock,
  Users,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardMetrics, CollectionLog, Alert } from "@/hooks/dashboard-data"
import { api } from "@/lib/api"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL 
console.log("API_BASE =", process.env.NEXT_PUBLIC_API_BASE_URL)

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [logs, setLogs] = useState<CollectionLog[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, logsRes, alertsRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardActivities(4),
          api.getActiveAlerts(),
        ])
        setMetrics(metricsRes.summary)
        setLogs(logsRes.activities?.recentCollections || [])
        setAlerts(alertsRes.alerts || [])
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
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
          <MetricCard title="Total Bins" icon={<Trash2 />} value={metrics?.totalBins} change = {metrics?.changeInBins}/> 
          <MetricCard title="Active Vehicles" icon={<Truck />} value={metrics?.activeVehicles} />
          <MetricCard title="Overflow Alerts" icon={<AlertTriangle />} value={metrics?.overflowBins} />
          <MetricCard title="Collections Today" icon={<CheckCircle />} value={metrics?.collectionsToday} />
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
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{log.bin.location_name}</span>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {log.collector.name}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(log.collection_time).toLocaleTimeString()}
                        </span>
                      </div>
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
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        alert.severity === "critical"
                          ? "text-red-600"
                          : alert.severity === "high"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{alert.bin.location_name}</span>
                        <Badge
                          variant={
                            alert.severity === "critical"
                              ? "destructive"
                              : alert.severity === "high"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(alert.triggered_at).toLocaleTimeString()}</p>
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

function MetricCard({ title, icon, value , change}: { title: string; icon: React.ReactNode; value?: number ; change?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? "--"}</div>
        <p className="text-xs text-muted-foreground">
          {typeof change === "number" ? (
            <>
              <span className={change > 0 ? "text-green-600" : "text-red-600"}>{change}%</span>{" "}
              from last month
            </>
          ) : (
            <>No data from last month</>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
