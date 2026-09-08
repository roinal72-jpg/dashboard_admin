import { useState } from "react"

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    taskAlerts: true,
    maintenanceMode: false,
    autoRefresh: true,
  })

  const [saved, setSaved] = useState(false)

  const updateSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Configure your Agentic AI dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* General Settings */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                General Settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage general dashboard preferences
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Notifications */}
              <div className="flex items-center justify-between gap-6 p-5">
                <div>
                  <p className="font-medium text-slate-800">
                    Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Enable dashboard notifications
                  </p>
                </div>

                <button
                  onClick={() =>
                    updateSetting("notifications")
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.notifications
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      settings.notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Email Alerts */}
              <div className="flex items-center justify-between gap-6 p-5">
                <div>
                  <p className="font-medium text-slate-800">
                    Email Alerts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive important system alerts by email
                  </p>
                </div>

                <button
                  onClick={() =>
                    updateSetting("emailAlerts")
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.emailAlerts
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      settings.emailAlerts
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Task Alerts */}
              <div className="flex items-center justify-between gap-6 p-5">
                <div>
                  <p className="font-medium text-slate-800">
                    Task Alerts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Get notified when tasks fail or complete
                  </p>
                </div>

                <button
                  onClick={() =>
                    updateSetting("taskAlerts")
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.taskAlerts
                      ? "bg-slate-900"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      settings.taskAlerts
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Auto Refresh */}
              <div className="flex items-center justify-between gap-6 p-5">
                <div>
                  <p className="font-medium text-slate-800">
                    Auto Refresh
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Automatically refresh dashboard data
                  </p>
                </div>

                <button
                  onClick={() =>
                    updateSetting("autoRefresh")
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

          {/* System Settings */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                System
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control system behavior
              </p>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-6 rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-800">
                    Maintenance Mode
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Temporarily disable normal system operations
                  </p>
                </div>

                <button
                  onClick={() =>
                    updateSetting("maintenanceMode")
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    settings.maintenanceMode
                      ? "bg-red-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      settings.maintenanceMode
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {settings.maintenanceMode && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    Maintenance mode is enabled
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    Normal system operations may be unavailable.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && (
              <span className="text-sm font-medium text-green-600">
                Settings saved successfully
              </span>
            )}

            <button
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

        {/* System Information */}
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
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Version
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  v1.0.0
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Environment
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  Production
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  API Status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <p className="font-semibold text-green-700">
                    Operational
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Database
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <p className="font-semibold text-green-700">
                    Connected
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Active Agents
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  86 agents
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 rounded-xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 p-5">
              <h2 className="text-lg font-semibold text-red-700">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Actions that can affect the entire system
              </p>
            </div>

            <div className="p-5">
              <button
                onClick={() => {
                  window.alert(
                    "This action is disabled in the demo."
                  )
                }}
                className="
                  w-full
                  rounded-lg
                  border
                  border-red-200
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                Reset System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings