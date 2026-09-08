import { useMemo, useState } from "react"

const initialLogs = [
  {
    id: 1,
    time: "10:32:15",
    level: "INFO",
    source: "Research Agent",
    action: "Task completed",
    message: "Market Research task completed successfully",
  },
  {
    id: 2,
    time: "10:30:42",
    level: "INFO",
    source: "Data Analyst",
    action: "Task started",
    message: "Started Analyze Customer Data task",
  },
  {
    id: 3,
    time: "10:28:17",
    level: "WARNING",
    source: "Automation Agent",
    action: "High latency",
    message: "Response time exceeded normal threshold",
  },
  {
    id: 4,
    time: "10:25:03",
    level: "ERROR",
    source: "Automation Agent",
    action: "Task failed",
    message: "Daily Report task failed to complete",
  },
  {
    id: 5,
    time: "10:21:48",
    level: "INFO",
    source: "Customer Support",
    action: "Task completed",
    message: "Customer Ticket Analysis completed successfully",
  },
  {
    id: 6,
    time: "10:18:26",
    level: "INFO",
    source: "System",
    action: "User login",
    message: "Admin user logged into the dashboard",
  },
  {
    id: 7,
    time: "10:15:11",
    level: "WARNING",
    source: "Queue",
    action: "Queue increased",
    message: "Pending task queue reached 12 tasks",
  },
]

function Logs() {
  const [logs, setLogs] = useState(initialLogs)
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("All")
  const [sourceFilter, setSourceFilter] = useState("All")
  const [selectedLog, setSelectedLog] = useState(null)

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        log.source.toLowerCase().includes(searchValue) ||
        log.action.toLowerCase().includes(searchValue) ||
        log.message.toLowerCase().includes(searchValue) ||
        log.time.toLowerCase().includes(searchValue)

      const matchesLevel =
        levelFilter === "All" ||
        log.level === levelFilter

      const matchesSource =
        sourceFilter === "All" ||
        log.source === sourceFilter

      return (
        matchesSearch &&
        matchesLevel &&
        matchesSource
      )
    })
  }, [logs, search, levelFilter, sourceFilter])

  const infoCount = logs.filter(
    (log) => log.level === "INFO"
  ).length

  const warningCount = logs.filter(
    (log) => log.level === "WARNING"
  ).length

  const errorCount = logs.filter(
    (log) => log.level === "ERROR"
  ).length

  const getLevelClass = (level) => {
    if (level === "INFO") {
      return "bg-blue-100 text-blue-700"
    }

    if (level === "WARNING") {
      return "bg-yellow-100 text-yellow-700"
    }

    return "bg-red-100 text-red-700"
  }

  const clearLogs = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all logs?"
    )

    if (!confirmed) return

    setLogs([])
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Logs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor system activity and events
          </p>
        </div>

        <button
          onClick={clearLogs}
          disabled={logs.length === 0}
          className="
            rounded-lg
            border
            border-red-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-semibold
            text-red-600
            transition
            hover:bg-red-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Clear Logs
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Total Logs
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {logs.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Info
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {infoCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Warnings
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {warningCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Errors
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {errorCount}
          </p>
        </div>
      </div>

      {/* Logs Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-9
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-slate-400
                focus:bg-white
                focus:ring-2
                focus:ring-slate-100
              "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(event.target.value)
              }
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-700
                outline-none
                focus:border-slate-400
              "
            >
              <option value="All">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(event) =>
                setSourceFilter(event.target.value)
              }
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2.5
                text-sm
                text-slate-700
                outline-none
                focus:border-slate-400
              "
            >
              <option value="All">All Sources</option>
              <option value="Research Agent">
                Research Agent
              </option>
              <option value="Data Analyst">
                Data Analyst
              </option>
              <option value="Automation Agent">
                Automation Agent
              </option>
              <option value="Customer Support">
                Customer Support
              </option>
              <option value="System">System</option>
              <option value="Queue">Queue</option>
            </select>
          </div>
        </div>

        {/* Result Info */}
        <div className="border-b border-slate-100 px-5 py-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredLogs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {logs.length}
            </span>{" "}
            logs
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Time
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Level
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Source
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Message
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-mono text-sm text-slate-500">
                    {log.time}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getLevelClass(
                        log.level
                      )}`}
                    >
                      {log.level}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {log.source}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {log.action}
                  </td>

                  <td className="max-w-md px-5 py-4 text-sm text-slate-500">
                    {log.message}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-slate-600
                        transition
                        hover:bg-slate-100
                        hover:text-slate-900
                      "
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredLogs.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                ?
              </div>

              <h3 className="font-semibold text-slate-800">
                No logs found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-900/40
            p-4
          "
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Log Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Detailed system event information
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Time
                </span>

                <span className="font-mono text-sm text-slate-800">
                  {selectedLog.time}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Level
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getLevelClass(
                    selectedLog.level
                  )}`}
                >
                  {selectedLog.level}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Source
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedLog.source}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Action
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedLog.action}
                </span>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-500">
                  Message
                </p>

                <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedLog.message}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="
                mt-6
                w-full
                rounded-lg
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Logs