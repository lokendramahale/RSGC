const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const api = {
  // Dashboard APIs
  getDashboardSummary: () => fetchApi("/dashboard/summary"),
  getDashboardCharts: (days = 7) => fetchApi(`/dashboard/charts?days=${days}`),
  getDashboardActivities: (limit = 10) => fetchApi(`/dashboard/activities?limit=${limit}`),

  // Auth APIs
  login: (credentials: { email: string; password: string }) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // User APIs
  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return fetchApi(`/users?${searchParams.toString()}`)
  },

  // Vehicle APIs
  getVehicles: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return fetchApi(`/vehicles?${searchParams.toString()}`)
  },

  getActiveVehicles: () => fetchApi("/vehicles/active"),

  // Bin APIs
  getBins: (params?: { page?: number; limit?: number; area?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return fetchApi(`/bins?${searchParams.toString()}`)
  },

  // Collection APIs
  getCollections: (params?: { page?: number; limit?: number; start_date?: string; end_date?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return fetchApi(`/collections?${searchParams.toString()}`)
  },

  // Alert APIs
  getAlerts: (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return fetchApi(`/alerts?${searchParams.toString()}`)
  },

  getActiveAlerts: () => fetchApi("/alerts/active"),
}
