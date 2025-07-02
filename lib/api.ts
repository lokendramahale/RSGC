import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rsgc_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

async function axiosApi<T = any>(url: string, config = {}): Promise<T> {
  try {
    const response = await axiosInstance(url, config)
    return response.data
  } catch (error: any) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || "API Error"
    throw new ApiError(status, message)
  }
}

export const api = {
  // Dashboard APIs
  getDashboardSummary: () => axiosApi("/dashboard/summary"),
  getDashboardCharts: (days = 7) => axiosApi(`/dashboard/charts?days=${days}`),
  getDashboardActivities: (limit = 10) => axiosApi(`/dashboard/activities?limit=${limit}`),
  //map locations
  getBinLocations: () => axiosApi("/map/binLocations"),
  getVehicleLocations: () => axiosApi("/map/vehicleLocations"),
  // Auth APIs
  login: (credentials: { email: string; password: string }) =>
    axiosApi("/auth/login", {
      method: "POST",
      data: credentials,
    }),

  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    axiosApi("/auth/register", {
      method: "POST",
      data: userData,
    }),

  // User APIs
  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return axiosApi(`/users?${searchParams.toString()}`)
  },

  // Vehicle APIs
  getVehicles: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return axiosApi(`/map/vehicleLocations?${searchParams.toString()}`)
  },

  getActiveVehicles: () => axiosApi("/vehicles/active"),

  // Bin APIs
  getBins: (params?: { page?: number; limit?: number; area?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return axiosApi(`/bins?${searchParams.toString()}`)
  },

  // Collection APIs
  getCollections: (params?: { page?: number; limit?: number; start_date?: string; end_date?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return axiosApi(`/collections?${searchParams.toString()}`)
  },

  // Alert APIs
  getAlerts: (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return axiosApi(`/alerts?${searchParams.toString()}`)
  },

  getActiveAlerts: () => axiosApi("/alerts/active"),
}
