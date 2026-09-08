import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Header from "./components/Header"

import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Agents from "./pages/Agents"
import Tasks from "./pages/Tasks"
import Analytics from "./pages/Analytics"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-slate-50">

        <Sidebar />

        <div className="ml-60 min-h-screen">

          <Header />

          <main>
            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/users"
                element={<Users />}
              />

              <Route
                path="/agents"
                element={<Agents />}
              />

              <Route
                path="/tasks"
                element={<Tasks />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/logs"
                element={<Logs />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>
          </main>

        </div>

      </div>

    </BrowserRouter>
  )
}

export default App