import { useEffect, useState } from "react"

import { apiFetch } from "../lib/api"

const DEFAULT_SETTINGS = {
  autoRefresh: true,
}

const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem(
      "admin_dashboard_settings"
    )

    if (!saved) {
      return DEFAULT_SETTINGS
    }

    const parsed = JSON.parse(saved)

    return {
      autoRefresh:
        parsed.autoRefresh !== false,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function Settings() {
  const [settings, setSettings] = useState(
    loadSavedSettings
  )

  const [saved, setSaved] = useState(false)

  const [systemInfo, setSystemInfo] = useState({
    version: "v1.0.0",
    environment:
      import.meta.env.MODE === "development"
        ? "Development"
        : "Production",
    apiStatus: "Checking",
    databaseStatus: "Checking",
    activeAgents: 0,
  })

  const [loadingInfo, setLoadingInfo] =
    useState(true)

  const [infoError, setInfoError] =
    useState("")

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const updateSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(
      "admin_dashboard_settings",
      JSON.stringify(settings)
    )

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  // ============================================================
  // LOAD SYSTEM INFORMATION
  // ============================================================

  const loadSystemInfo = async () => {
    setLoadingInfo(true)
    setInfoError("")

    try {
      const [
        usersResponse,
        agentsResponse,
        tasksResponse,
      ] = await Promise.all([
        apiFetch("/api/admin/users"),
        apiFetch("/api/agents"),
        apiFetch("/api/admin/tasks"),
      ])

      const [
        usersData,
        agentsData,
        tasksData,
      ] = await Promise.all([
        usersResponse
          .json()
          .catch(() => ({})),
        agentsResponse
          .json()
          .catch(() => ({})),
        tasksResponse
          .json()
          .catch(() => ({})),
      ])

      if (
        !usersResponse.ok ||
        !agentsResponse.ok ||
        !tasksResponse.ok
      ) {
        throw new Error(
          "Gagal mengambil informasi sistem."
        )
      }

      const agents = Array.isArray(
        agentsData?.agents
      )
        ? agentsData.agents
        : []

      setSystemInfo((current) => ({
        ...current,
        apiStatus: "Operational",
        databaseStatus: "Connected",
        activeAgents: agents.filter(
          (agent) => agent.is_active
        ).length,
      }))

      void usersData
      void tasksData
    } catch (error) {
      console.error(
        "Gagal mengambil system information:",
        error
      )

      setSystemInfo((current) => ({
        ...current,
        apiStatus: "Unavailable",
        databaseStatus: "Unavailable",
      }))

      setInfoError(
        error.message ||
          "Gagal mengambil informasi sistem."
      )
    } finally {
      setLoadingInfo(false)
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadSystemInfo()
  }, [])

  // ============================================================
  // AUTO REFRESH SYSTEM INFORMATION
  // ============================================================

  useEffect(() => {
    if (!settings.autoRefresh) {
      return
    }

    const interval = window.setInterval(() => {
      loadSystemInfo()
    }, 30000)

    return () => {
      window.clearInterval(interval)
    }
  }, [settings.autoRefresh])

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Configure your Agentic AI dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ==================================================== */}
        {/* GENERAL SETTINGS */}
        {/* ==================================================== */}

        <div className="xl:col-span-2">

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-semibold text-slate-900">
                General Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage dashboard preferences
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              {/* Auto Refresh */}

              <div className="flex items-center justify-between gap-6 p-5">

                <div>

                  <p className="font-medium text-slate-800">
                    Auto Refresh
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Automatically refresh system information every 30 seconds
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateSetting("autoRefresh")
                  }
                  aria-pressed={
                    settings.autoRefresh
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.autoRefresh
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      settings.autoRefresh
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

            </div>
          </div>

          {/* ================================================== */}
          {/* SAVE */}
          {/* ================================================== */}

          <div className="mt-6 flex items-center justify-end gap-3">

            {saved && (
              <span className="text-sm font-medium text-green-600">
                Settings saved successfully
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="
                rounded-lg
                bg-slate-900
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-slate-800
                hover:shadow-md
              "
            >
              Save Changes
            </button>

          </div>
        </div>

        {/* ==================================================== */}
        {/* SYSTEM INFORMATION */}
        {/* ==================================================== */}

        <div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-semibold text-slate-900">
                System Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current system information
              </p>

            </div>

            <div className="space-y-4 p-5">

              {/* Version */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Version
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {systemInfo.version}
                </p>

              </div>

              {/* Environment */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Environment
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {systemInfo.environment}
                </p>

              </div>

              {/* API Status */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  API Status
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      systemInfo.apiStatus ===
                      "Operational"
                        ? "bg-green-500"
                        : systemInfo.apiStatus ===
                            "Checking"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />

                  <p
                    className={`font-semibold ${
                      systemInfo.apiStatus ===
                      "Operational"
                        ? "text-green-700"
                        : systemInfo.apiStatus ===
                            "Checking"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {loadingInfo
                      ? "Checking"
                      : systemInfo.apiStatus}
                  </p>

                </div>

              </div>

              {/* Database */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Database
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span
                    className={`h-2 w-2 rounded-full ${
                      systemInfo.databaseStatus ===
                      "Connected"
                        ? "bg-green-500"
                        : systemInfo.databaseStatus ===
                            "Checking"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />

                  <p
                    className={`font-semibold ${
                      systemInfo.databaseStatus ===
                      "Connected"
                        ? "text-green-700"
                        : systemInfo.databaseStatus ===
                            "Checking"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {loadingInfo
                      ? "Checking"
                      : systemInfo.databaseStatus}
                  </p>

                </div>

              </div>

              {/* Active Agents */}

              <div className="rounded-lg bg-slate-50 p-4">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Active Agents
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {loadingInfo
                    ? "Loading..."
                    : `${systemInfo.activeAgents} agents`}
                </p>

              </div>

            </div>
          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={loadSystemInfo}
            disabled={loadingInfo}
            className="
              mt-4
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loadingInfo
              ? "Refreshing..."
              : "Refresh System Information"}
          </button>

          {infoError && (
            <p className="mt-3 text-xs leading-5 text-red-600">
              {infoError}
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

export default Settings
