import { useMemo, useState } from "react"

const initialAgents = [
  {
    id: "AG-1001",
    name: "Research Agent",
    type: "Research",
    status: "Running",
    tasks: 1284,
    successRate: "98.7%",
    lastRun: "1 min ago",
  },
  {
    id: "AG-1002",
    name: "Data Analyst",
    type: "Analysis",
    status: "Running",
    tasks: 942,
    successRate: "97.9%",
    lastRun: "3 min ago",
  },
  {
    id: "AG-1003",
    name: "Content Writer",
    type: "Content",
    status: "Idle",
    tasks: 756,
    successRate: "96.4%",
    lastRun: "12 min ago",
  },
  {
    id: "AG-1004",
    name: "Customer Support",
    type: "Support",
    status: "Running",
    tasks: 1842,
    successRate: "99.1%",
    lastRun: "1 min ago",
  },
  {
    id: "AG-1005",
    name: "Automation Agent",
    type: "Automation",
    status: "Stopped",
    tasks: 521,
    successRate: "94.8%",
    lastRun: "2 hours ago",
  },
]

function Agents() {
  const [agents, setAgents] = useState(initialAgents)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedAgent, setSelectedAgent] = useState(null)

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        agent.name.toLowerCase().includes(searchValue) ||
        agent.id.toLowerCase().includes(searchValue) ||
        agent.type.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === "All" ||
        agent.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [agents, search, statusFilter])

  const toggleAgent = (id) => {
    setAgents((currentAgents) =>
      currentAgents.map((agent) => {
        if (agent.id !== id) {
          return agent
        }

        if (agent.status === "Running") {
          return {
            ...agent,
            status: "Stopped",
          }
        }

        return {
          ...agent,
          status: "Running",
        }
      })
    )

    setOpenMenu(null)
  }

  const getStatusClass = (status) => {
    if (status === "Running") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Idle") {
      return "bg-yellow-100 text-yellow-700"
    }

    return "bg-slate-100 text-slate-600"
  }

  const runningAgents = agents.filter(
    (agent) => agent.status === "Running"
  ).length

  const idleAgents = agents.filter(
    (agent) => agent.status === "Idle"
  ).length

  const stoppedAgents = agents.filter(
    (agent) => agent.status === "Stopped"
  ).length

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Agents
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor your AI agents
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Total Agents
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {agents.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Running
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {runningAgents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Idle
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {idleAgents}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Stopped
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-600">
            {stoppedAgents}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
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
            <option value="All">All Status</option>
            <option value="Running">Running</option>
            <option value="Idle">Idle</option>
            <option value="Stopped">Stopped</option>
          </select>
        </div>

        {/* Result Info */}
        <div className="border-b border-slate-100 px-5 py-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredAgents.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {agents.length}
            </span>{" "}
            agents
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Agent
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tasks
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Success Rate
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Run
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  {/* Agent */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
                        AI
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {agent.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {agent.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {agent.type}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        agent.status
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {agent.status}
                    </span>
                  </td>

                  {/* Tasks */}
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {agent.tasks.toLocaleString()}
                  </td>

                  {/* Success */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-700">
                      {agent.successRate}
                    </span>
                  </td>

                  {/* Last Run */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {agent.lastRun}
                  </td>

                  {/* Action */}
                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === agent.id
                            ? null
                            : agent.id
                        )
                      }
                      className="
                        inline-flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        text-lg
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-700
                      "
                    >
                      ⋮
                    </button>

                    {openMenu === agent.id && (
                      <div
                        className="
                          absolute
                          right-5
                          top-14
                          z-20
                          w-40
                          overflow-hidden
                          rounded-lg
                          border
                          border-slate-200
                          bg-white
                          py-1
                          text-left
                          shadow-lg
                        "
                      >
                        <button
                          onClick={() => {
                            setSelectedAgent(agent)
                            setOpenMenu(null)
                          }}
                          className="
                            block
                            w-full
                            px-4
                            py-2.5
                            text-sm
                            text-slate-700
                            transition
                            hover:bg-slate-50
                          "
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => toggleAgent(agent.id)}
                          className="
                            block
                            w-full
                            px-4
                            py-2.5
                            text-sm
                            text-slate-700
                            transition
                            hover:bg-slate-50
                          "
                        >
                          {agent.status === "Running"
                            ? "Stop Agent"
                            : "Start Agent"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                ?
              </div>

              <h3 className="font-semibold text-slate-800">
                No agents found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Modal */}
      {selectedAgent && (
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
          onClick={() => setSelectedAgent(null)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Agent Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information about this AI agent
                </p>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
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

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
                AI
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  {selectedAgent.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {selectedAgent.id}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Type
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedAgent.type}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Status
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedAgent.status}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Tasks
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedAgent.tasks.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Success Rate
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedAgent.successRate}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">
                  Last Run
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedAgent.lastRun}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgent(null)}
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

export default Agents