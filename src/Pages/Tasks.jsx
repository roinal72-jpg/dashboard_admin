import { useMemo, useState } from "react"

const initialTasks = [
  {
    id: "TSK-1001",
    name: "Market Research",
    agent: "Research Agent",
    status: "Completed",
    priority: "High",
    created: "2 min ago",
    duration: "4m 32s",
  },
  {
    id: "TSK-1002",
    name: "Analyze Customer Data",
    agent: "Data Analyst",
    status: "Running",
    priority: "High",
    created: "8 min ago",
    duration: "2m 18s",
  },
  {
    id: "TSK-1003",
    name: "Generate Product Description",
    agent: "Content Writer",
    status: "Pending",
    priority: "Medium",
    created: "15 min ago",
    duration: "-",
  },
  {
    id: "TSK-1004",
    name: "Customer Ticket Analysis",
    agent: "Customer Support",
    status: "Completed",
    priority: "Low",
    created: "32 min ago",
    duration: "1m 45s",
  },
  {
    id: "TSK-1005",
    name: "Automate Daily Report",
    agent: "Automation Agent",
    status: "Failed",
    priority: "Medium",
    created: "1 hour ago",
    duration: "3m 12s",
  },
  {
    id: "TSK-1006",
    name: "Competitor Analysis",
    agent: "Research Agent",
    status: "Pending",
    priority: "Low",
    created: "2 hours ago",
    duration: "-",
  },
]

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        task.name.toLowerCase().includes(searchValue) ||
        task.id.toLowerCase().includes(searchValue) ||
        task.agent.toLowerCase().includes(searchValue)

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      )
    })
  }, [tasks, search, statusFilter, priorityFilter])

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length

  const runningTasks = tasks.filter(
    (task) => task.status === "Running"
  ).length

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length

  const failedTasks = tasks.filter(
    (task) => task.status === "Failed"
  ).length

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Running") {
      return "bg-blue-100 text-blue-700"
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700"
    }

    return "bg-red-100 text-red-700"
  }

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-red-100 text-red-700"
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-700"
    }

    return "bg-slate-100 text-slate-600"
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    )

    if (!confirmed) return

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    )

    setOpenMenu(null)
  }

  const handleRetry = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "Running",
            }
          : task
      )
    )

    setOpenMenu(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Tasks
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor and manage AI agent tasks
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedTasks}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Successfully completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Running
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {runningTasks}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Currently processing
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingTasks}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Waiting to run
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Failed
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {failedTasks}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Need attention
          </p>
        </div>
      </div>

      {/* Main Card */}
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
              placeholder="Search tasks..."
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
              <option value="Completed">Completed</option>
              <option value="Running">Running</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
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
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Result Info */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {tasks.length}
            </span>{" "}
            tasks
          </p>

          {(search ||
            statusFilter !== "All" ||
            priorityFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("")
                setStatusFilter("All")
                setPriorityFilter("All")
              }}
              className="
                text-sm
                font-medium
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Task
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Agent
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Priority
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  {/* Task */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {task.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {task.id}
                      </p>
                    </div>
                  </td>

                  {/* Agent */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {task.agent}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        task.status
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {task.status}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {task.created}
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {task.duration}
                  </td>

                  {/* Action */}
                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === task.id
                            ? null
                            : task.id
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

                    {openMenu === task.id && (
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
                            setSelectedTask(task)
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

                        {task.status === "Failed" && (
                          <button
                            onClick={() =>
                              handleRetry(task.id)
                            }
                            className="
                              block
                              w-full
                              px-4
                              py-2.5
                              text-sm
                              text-blue-600
                              transition
                              hover:bg-blue-50
                            "
                          >
                            Retry Task
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(task.id)
                          }
                          className="
                            block
                            w-full
                            px-4
                            py-2.5
                            text-sm
                            text-red-600
                            transition
                            hover:bg-red-50
                          "
                        >
                          Delete Task
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                ?
              </div>

              <h3 className="font-semibold text-slate-800">
                No tasks found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
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
          onClick={() => setSelectedTask(null)}
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Task Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information about this task
                </p>
              </div>

              <button
                onClick={() => setSelectedTask(null)}
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

            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">
                {selectedTask.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {selectedTask.id}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Agent
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedTask.agent}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Status
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedTask.status}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Priority
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedTask.priority}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Created
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedTask.created}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-500">
                  Duration
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {selectedTask.duration}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTask(null)}
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

export default Tasks