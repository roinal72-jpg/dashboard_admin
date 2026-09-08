import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const activityData = [
  { name: "Mon", tasks: 320 },
  { name: "Tue", tasks: 450 },
  { name: "Wed", tasks: 380 },
  { name: "Thu", tasks: 520 },
  { name: "Fri", tasks: 610 },
  { name: "Sat", tasks: 480 },
  { name: "Sun", tasks: 570 },
]

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    change: "+12.5%",
    description: "from last month",
  },
  {
    title: "Active Agents",
    value: "86",
    change: "+8.2%",
    description: "from last month",
  },
  {
    title: "Tasks Completed",
    value: "24,892",
    change: "+18.7%",
    description: "from last month",
  },
  {
    title: "Success Rate",
    value: "98.4%",
    change: "+2.1%",
    description: "from last month",
  },
]

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your Agentic AI system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="
              group
              cursor-pointer
              rounded-xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-300
              ease-out
              hover:-translate-y-1
              hover:border-slate-300
              hover:shadow-xl
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {stat.value}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-600
                  transition-all
                  duration-300
                  group-hover:bg-slate-900
                  group-hover:text-white
                "
              >
                {stat.title === "Total Users" && "U"}
                {stat.title === "Active Agents" && "A"}
                {stat.title === "Tasks Completed" && "T"}
                {stat.title === "Success Rate" && "%"}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-green-600">
                {stat.change}
              </span>

              <span className="text-sm text-slate-400">
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Activity Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Task Activity
            </h2>

            <p className="text-sm text-slate-500">
              Tasks completed over the last 7 days
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="tasks"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              System Status
            </h2>

            <p className="text-sm text-slate-500">
              Current system health
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  API Server
                </p>

                <p className="text-xs text-slate-500">
                  Response time: 42ms
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  Database
                </p>

                <p className="text-xs text-slate-500">
                  Response time: 18ms
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  AI Agents
                </p>

                <p className="text-xs text-slate-500">
                  86 agents running
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="font-medium text-slate-800">
                  Queue
                </p>

                <p className="text-xs text-slate-500">
                  12 pending tasks
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Normal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="text-sm text-slate-500">
            Latest actions in your system
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="font-medium text-slate-800">
                Agent completed task
              </p>

              <p className="text-sm text-slate-500">
                Agent #AG-1024 completed data analysis
              </p>
            </div>

            <span className="text-xs text-slate-400">
              2 min ago
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="font-medium text-slate-800">
                New user registered
              </p>

              <p className="text-sm text-slate-500">
                john@example.com joined the platform
              </p>
            </div>

            <span className="text-xs text-slate-400">
              10 min ago
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">
                Agent started
              </p>

              <p className="text-sm text-slate-500">
                Agent #AG-1031 started a new task
              </p>
            </div>

            <span className="text-xs text-slate-400">
              18 min ago
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard