"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Download, BarChart3, Activity } from "lucide-react"

const weeklyCollections = [
  { day: "Mon", collections: 45, overflow: 3 },
  { day: "Tue", collections: 52, overflow: 5 },
  { day: "Wed", collections: 48, overflow: 2 },
  { day: "Thu", collections: 61, overflow: 7 },
  { day: "Fri", collections: 55, overflow: 4 },
  { day: "Sat", collections: 38, overflow: 1 },
  { day: "Sun", collections: 29, overflow: 2 },
]

const binStatusData = [
  { name: "Normal", value: 1156, color: "#22c55e" },
  { name: "Overflow", value: 67, color: "#ef4444" },
  { name: "Fire Alert", value: 12, color: "#f97316" },
  { name: "Maintenance", value: 23, color: "#6b7280" },
]

const vehicleUsage = [
  { vehicle: "TRK-101", hours: 8.5, collections: 23 },
  { vehicle: "TRK-102", hours: 7.2, collections: 19 },
  { vehicle: "TRK-103", hours: 6.8, collections: 17 },
  { vehicle: "TRK-104", hours: 9.1, collections: 25 },
  { vehicle: "TRK-105", hours: 7.9, collections: 21 },
]

const monthlyTrends = [
  { month: "Jan", collections: 1245, alerts: 45 },
  { month: "Feb", collections: 1189, alerts: 38 },
  { month: "Mar", collections: 1356, alerts: 52 },
  { month: "Apr", collections: 1298, alerts: 41 },
  { month: "May", collections: 1423, alerts: 48 },
  { month: "Jun", collections: 1387, alerts: 44 },
]

const areaWiseAlerts = [
  { area: "Downtown", alerts: 15, bins: 245 },
  { area: "Commercial", alerts: 23, bins: 189 },
  { area: "Residential", alerts: 8, bins: 456 },
  { area: "Industrial", alerts: 12, bins: 123 },
  { area: "Educational", alerts: 6, bins: 89 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your waste management operations</p>
          </div>
          <div className="flex space-x-2">
            <Select defaultValue="7days">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">328</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">+0.3h</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.4K</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Collections Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Collections & Overflows</CardTitle>
              <CardDescription>Daily collection activity and overflow incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyCollections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="collections" fill="#22c55e" name="Collections" />
                  <Bar dataKey="overflow" fill="#ef4444" name="Overflows" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bin Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Bin Status Distribution</CardTitle>
              <CardDescription>Current status of all bins in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={binStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {binStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vehicle Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Usage Statistics</CardTitle>
              <CardDescription>Daily hours and collections per vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehicleUsage} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="vehicle" type="category" />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Collections and alerts over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="collections" stroke="#22c55e" name="Collections" />
                  <Line type="monotone" dataKey="alerts" stroke="#ef4444" name="Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Area-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Area-wise Performance</CardTitle>
            <CardDescription>Alert frequency and bin density by area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areaWiseAlerts.map((area) => (
                <div key={area.area} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{area.area}</span>
                      <span className="text-sm text-muted-foreground">{area.bins} bins</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(area.alerts / area.bins) * 100 * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{area.alerts} alerts</span>
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
