import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Header() {
  const navigate = useNavigate()

  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("admin_theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    } else {
      const systemDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches

      if (systemDark) {
        document.documentElement.classList.add("dark")
        setDarkMode(true)
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const nextMode = !darkMode

    setDarkMode(nextMode)

    if (nextMode) {
      document.documentElement.classList.add("dark")

      localStorage.setItem(
        "admin_theme",
        "dark"
      )
    } else {
      document.documentElement.classList.remove("dark")

      localStorage.setItem(
        "admin_theme",
        "light"
      )
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(
      "admin_access_token"
    )

    localStorage.removeItem(
      "admin_refresh_token"
    )

    localStorage.removeItem(
      "admin_user"
    )

    setProfileOpen(false)

    navigate("/login")
  }

  return (
    <header
      className="
        flex h-[72px] items-center justify-between
        border-b border-slate-200
        bg-white
        px-7
        transition-colors
        duration-200
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* LEFT */}

      <div>
        <h1
          className="
            text-lg font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Admin Dashboard
        </h1>

        <p
          className="
            mt-0.5 text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          Manage your Agentic AI platform
        </p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">

        {/* DARK / LIGHT MODE */}

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Light Mode"
              : "Dark Mode"
          }
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            border border-slate-200
            bg-white
            text-lg
            text-slate-600
            transition
            hover:bg-slate-100
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-300
            dark:hover:bg-slate-700
          "
        >
          {darkMode ? "☀" : "☾"}
        </button>

        {/* PROFILE */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="
              flex items-center gap-2
              rounded-lg
              px-2 py-1.5
              transition
              hover:bg-slate-50
              dark:hover:bg-slate-800
            "
          >

            {/* AVATAR */}

            <div
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-blue-600
                text-xs font-semibold
                text-white
              "
            >
              A
            </div>

            {/* PROFILE NAME */}

            <div className="hidden text-left sm:block">

              <p
                className="
                  text-xs font-semibold
                  text-slate-800
                  dark:text-slate-200
                "
              >
                Admin
              </p>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  dark:text-slate-500
                "
              >
                Administrator
              </p>

            </div>

            {/* ARROW */}

            <span
              className="
                text-xs
                text-slate-400
                dark:text-slate-500
              "
            >
              ▾
            </span>

          </button>

          {/* PROFILE DROPDOWN */}

          {profileOpen && (
            <div
              className="
                absolute right-0 top-12 z-50
                w-48 rounded-xl
                border border-slate-200
                bg-white
                p-2
                shadow-lg
                dark:border-slate-700
                dark:bg-slate-800
              "
            >

              {/* PROFILE INFO */}

              <div
                className="
                  border-b
                  border-slate-100
                  px-3 py-2
                  dark:border-slate-700
                "
              >

                <p
                  className="
                    text-xs font-semibold
                    text-slate-800
                    dark:text-slate-200
                  "
                >
                  Administrator
                </p>

                <p
                  className="
                    mt-0.5 text-[10px]
                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  admin@example.com
                </p>

              </div>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-1 flex w-full
                  items-center
                  rounded-lg
                  px-3 py-2
                  text-left
                  text-sm font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                  dark:text-red-400
                  dark:hover:bg-red-950
                "
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  )
}

export default Header