import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const taskData = [
  { name: "Mon", completed: 320, failed: 18 },
  { name: "Tue", completed: 450, failed: 14 },
  { name: "Wed", completed: 380, failed: 21 },
  { name: "Thu", completed: 520, failed: 12 },
  { name: "Fri", completed: 610, failed: 16 },
  { name: "Sat", completed: 480, failed: 19 },
  { name: "Sun", completed: 570, failed: 11 },
]

const performanceData = [
  { name: "Mon", success: 96.8 },
  { name: "Tue", success: 97.4 },
  { name: "Wed", success: 96.2 },
  { name: "Thu", success: 98.1 },
  { name: "Fri", success: 98.7 },
  { name: "Sat", success: 97.9 },
  { name: "Sun", success: 98.4 },
]

const agentData = [
  { name: "Research", value: 28, color: "#2563EB" },
  { name: "Analysis", value: 22, color: "#9333EA" },
  { name: "Content", value: 18, color: "#16A34A" },
  { name: "Support", value: 20, color: "#0891B2" },
  { name: "Automation", value: 12, color: "#D97706" },
]

function Analytics() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor system performance and task analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Total Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            24,892
          </p>

          <p className="mt-1 text-sm text-green-600">
            +18.7% this month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Success Rate
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            98.4%
          </p>

          <p className="mt-1 text-sm text-green-600">
            +2.1% this month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Avg. Completion
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            3m 42s
          </p>

          <p className="mt-1 text-sm text-green-600">
            12.4% faster
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm font-medium text-slate-500">
            Active Agents
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            86
          </p>

          <p className="mt-1 text-sm text-green-600">
            +8.2% this month
          </p>
        </div>
      </div>

      {/* Task Performance */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Task Performance
            </h2>

            <p className="text-sm text-slate-500">
              Completed and failed tasks over the last 7 days
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
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

                <Legend />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="failed"
                  name="Failed"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Agent Usage
            </h2>

            <p className="text-sm text-slate-500">
              Task distribution by agent type
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={95}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {agentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Success Rate
          </h2>

          <p className="text-sm text-slate-500">
            AI agent success rate over the last 7 days
          </p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
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
                domain={[90, 100]}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Success Rate",
                ]}
              />

              <Line
                type="monotone"
                dataKey="success"
                name="Success Rate"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Best Performing Agent
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Customer Support
          </h3>

          <p className="mt-2 text-sm text-green-600">
            99.1% success rate
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Most Active Agent
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            Research Agent
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            1,284 tasks completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Average Response Time
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            42 ms
          </h3>

          <p className="mt-2 text-sm text-green-600">
            8.6% faster than last week
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analytics