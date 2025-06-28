"use client"

import { useState, useEffect } from "react"
import { api } from "../lib/api"

export interface DashboardMetrics {
  totalBins: number
  activeVehicles: number
  alertsToday: number
  collectionsToday: number
  overflowBins: number
  totalUsers: number
  avgFillLevel: number
  changeInBins: number
}

export interface CollectionLog {
  id: string
  collection_time: string
  bin: { location_name: string }
  collector: { name: string }
}

export interface Alert {
  id: string
  type: string
  severity: string
  message: string
  triggered_at: string
  bin: { location_name: string }
}

interface DashboardSummary {
  totalBins: number
  activeVehicles: number
  alertsToday: number
  collectionsToday: number
  overflowBins: number
  totalUsers: number
  avgFillLevel: number
  changeInBins: number
}

interface DashboardCharts {
  dailyCollections: Array<{ date: string; count: number }>
  areaStats: Array<{ area: string; total_bins: number; avg_fill_level: number }>
  vehicleUsage: Array<{ vehicle: { number: string }; collections: number }>
  alertTrends: Array<{ type: string; count: number }>
}

interface RecentCollection {
  id: string
  collection_time: string
  bin: { location_name: string }
  collector: { name: string }
}

interface RecentAlert {
  id: string
  type: string
  severity: string
  message: string
  triggered_at: string
  bin: { location_name: string }
}

interface DashboardActivities {
  recentCollections: RecentCollection[]
  recentAlerts: RecentAlert[]
}

export function useDashboardData() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [charts, setCharts] = useState<DashboardCharts | null>(null)
  const [activities, setActivities] = useState<DashboardActivities | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        const [summaryData, chartsData, activitiesData] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardCharts(7),
          api.getDashboardActivities(10),
        ])

        setSummary(summaryData.summary)
        setCharts(chartsData.charts)
        setActivities(activitiesData.activities)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryData, chartsData, activitiesData] = await Promise.all([
        api.getDashboardSummary(),
        api.getDashboardCharts(7),
        api.getDashboardActivities(10),
      ])

      setSummary(summaryData.summary)
      setCharts(chartsData.charts)
      setActivities(activitiesData.activities)
    } catch (err) {
      console.error("Failed to refetch dashboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  return {
    summary,
    charts,
    activities,
    loading,
    error,
    refetch,
  }
}
