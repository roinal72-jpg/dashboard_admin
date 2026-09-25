import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { apiFetch } from "../lib/api"

const normalizeUser = (user) => {
  const roleMap = {
    admin: "Admin",
    user: "User",
  }

  return {
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email || "-",
    role: roleMap[user.role] || "User",
    status: user.status || "Active",
    agents: Array.isArray(user.agents)
      ? user.agents.map((agent) => ({
          id: agent.id,
          name: agent.name || "Unnamed Agent",
          slug: agent.slug || "-",
          taskCount: agent.task_count ?? 0,
        }))
      : [],
    lastActive: user.updated_at
      ? new Date(user.updated_at).toLocaleString("id-ID")
      : "-",
    avatar: user.avatar || "",
    createdAt: user.created_at || null,
    updatedAt: user.updated_at || null,
  }
}

const initialNewUser = {
  name: "",
  email: "",
  role: "User",
  password: "",
  confirmPassword: "",
}

const initialEditForm = {
  name: "",
  email: "",
  role: "User",
}

function Users() {
  const [users, setUsers] = useState([])

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")

  const [openMenu, setOpenMenu] = useState(null)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  const [showAddUser, setShowAddUser] = useState(false)

  const [newUser, setNewUser] = useState(initialNewUser)

  const [editForm, setEditForm] = useState(initialEditForm)

  const [formError, setFormError] = useState("")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [pageError, setPageError] = useState("")

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async () => {
    setLoading(true)
    setPageError("")

    try {
      const response = await apiFetch("/api/admin/users")

      if (!response.ok) {
        let message = "Gagal mengambil data users."

        try {
          const data = await response.json()

          if (data?.error) {
            message = data.error
          }

          if (data?.message) {
            message = data.message
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message)
      }

      const data = await response.json()

      const usersData = Array.isArray(data)
        ? data
        : Array.isArray(data?.users)
          ? data.users
          : []

      setUsers(usersData.map(normalizeUser))
    } catch (error) {
      console.error("Gagal mengambil users:", error)

      setPageError(
        error.message ||
          "Gagal mengambil data users dari server."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // ============================================================
  // FILTER
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim()

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [users, search, roleFilter])

  // ============================================================
  // STATUS / ROLE / AVATAR
  // ============================================================

  const getStatusClass = (status) => {
    if (status === "Active") {
      return `
        bg-green-100 text-green-700
        dark:bg-green-950/50 dark:text-green-400
      `
    }

    if (status === "Suspended") {
      return `
        bg-red-100 text-red-700
        dark:bg-red-950/50 dark:text-red-400
      `
    }

    return `
      bg-slate-100 text-slate-600
      dark:bg-slate-800 dark:text-slate-400
    `
  }

  const getRoleClass = (role) => {
    if (role === "Admin") {
      return `
        bg-purple-100 text-purple-700
        dark:bg-purple-950/50 dark:text-purple-400
      `
    }

    return `
      bg-slate-100 text-slate-600
      dark:bg-slate-800 dark:text-slate-400
    `
  }

  const getAvatarClass = (role) => {
    if (role === "Admin") {
      return `
        bg-purple-600 text-white
        dark:bg-purple-500
      `
    }

    return `
      bg-slate-500 text-white
      dark:bg-slate-700
    `
  }

  // ============================================================
  // ADD USER
  // ============================================================

  const handleNewUserChange = (event) => {
    const { name, value } = event.target

    setNewUser((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError("")
  }

  const handleAddUser = async (event) => {
    event.preventDefault()

    const name = newUser.name.trim()
    const email = newUser.email.trim()

    if (!name || !email || !newUser.password) {
      setFormError(
        "Please fill in all required fields."
      )
      return
    }

    if (newUser.password.length < 6) {
      setFormError(
        "Password must be at least 6 characters."
      )
      return
    }

    if (
      newUser.password !==
      newUser.confirmPassword
    ) {
      setFormError(
        "Passwords do not match."
      )
      return
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        email.toLowerCase()
    )

    if (emailExists) {
      setFormError(
        "A user with this email already exists."
      )
      return
    }

    setSubmitting(true)
    setFormError("")

    try {
      const backendRole =
        newUser.role === "Admin"
          ? "admin"
          : "user"

      const response = await apiFetch(
        "/api/admin/users",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password: newUser.password,
            role: backendRole,
          }),
        }
      )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Gagal membuat user."
        )
      }

      setShowAddUser(false)
      setNewUser(initialNewUser)
      setFormError("")

      await loadUsers()
    } catch (error) {
      console.error(
        "Gagal membuat user:",
        error
      )

      setFormError(
        error.message ||
          "Gagal membuat user."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // EDIT USER
  // ============================================================

  const openEditUser = (user) => {
    setEditingUser(user)

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    })

    setFormError("")
    setOpenMenu(null)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError("")
  }

  const handleEditUser = async (event) => {
    event.preventDefault()

    if (!editingUser) {
      return
    }

    const name = editForm.name.trim()
    const email = editForm.email.trim()

    if (!name || !email) {
      setFormError(
        "Name and email are required."
      )
      return
    }

    const emailExists = users.some(
      (user) =>
        user.id !== editingUser.id &&
        user.email.toLowerCase() ===
          email.toLowerCase()
    )

    if (emailExists) {
      setFormError(
        "A user with this email already exists."
      )
      return
    }

    setSubmitting(true)
    setFormError("")

    try {
      const backendRole =
        editForm.role === "Admin"
          ? "admin"
          : "user"

      const response = await apiFetch(
        `/api/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name,
            email,
            role: backendRole,
          }),
        }
      )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Gagal mengubah user."
        )
      }

      setEditingUser(null)
      setEditForm(initialEditForm)
      setFormError("")

      await loadUsers()
    } catch (error) {
      console.error(
        "Gagal mengubah user:",
        error
      )

      setFormError(
        error.message ||
          "Gagal mengubah user."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDelete = async (id) => {
    const user = users.find(
      (currentUser) =>
        currentUser.id === id
    )

    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(id)
    setOpenMenu(null)
    setPageError("")

    try {
      const response = await apiFetch(
        `/api/admin/users/${id}`,
        {
          method: "DELETE",
        }
      )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Gagal menghapus user."
        )
      }

      if (selectedUser?.id === id) {
        setSelectedUser(null)
      }

      if (editingUser?.id === id) {
        setEditingUser(null)
      }

      await loadUsers()
    } catch (error) {
      console.error(
        "Gagal menghapus user:",
        error
      )

      setPageError(
        error.message ||
          "Gagal menghapus user."
      )
    } finally {
      setDeletingId(null)
    }
  }

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("")
    setRoleFilter("All")
  }

  // ============================================================
  // SHARED INPUT CLASS
  // ============================================================

  const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-200
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-slate-400
    focus:ring-2
    focus:ring-slate-100

    dark:border-slate-700
    dark:bg-slate-900
    dark:text-white
    dark:placeholder:text-slate-500
    dark:focus:border-slate-600
    dark:focus:ring-slate-800
  `

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        p-6
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* HEADER */}

      <div className="mb-6">
        <h1
          className="
            text-2xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          Users
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Manage users and their access
        </p>
      </div>

      {/* PAGE ERROR */}

      {pageError && (
        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3

            dark:border-red-900
            dark:bg-red-950/40
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-red-600
              dark:text-red-400
            "
          >
            {pageError}
          </p>

          <button
            onClick={loadUsers}
            className="
              shrink-0
              rounded-lg
              bg-red-600
              px-3
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* MAIN CARD */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-colors

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* TOOLBAR */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-slate-200
            p-5
            lg:flex-row
            lg:items-center
            lg:justify-between

            dark:border-slate-800
          "
        >
          {/* SEARCH */}

          <div className="relative w-full lg:max-w-md">
            <span
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                dark:text-slate-500
              "
            >
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className={`
                ${inputClass}
                bg-slate-50
                pl-9

                dark:bg-slate-950
                dark:focus:bg-slate-900
              `}
            />
          </div>

          {/* FILTERS */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
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
                transition
                focus:border-slate-400

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:focus:border-slate-600
              "
            >
              <option value="All">
                All Roles
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="User">
                User
              </option>
            </select>

            <button
              onClick={() => {
                setFormError("")
                setNewUser(
                  initialNewUser
                )
                setShowAddUser(true)
              }}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                whitespace-nowrap
                rounded-lg
                bg-slate-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-slate-800
                hover:shadow-md

                dark:bg-white
                dark:text-slate-900
                dark:hover:bg-slate-200
              "
            >
              <span className="text-base leading-none">
                +
              </span>

              Add User
            </button>
          </div>
        </div>

        {/* RESULT INFO */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-3

            dark:border-slate-800
          "
        >
          <p
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Showing{" "}
            <span
              className="
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span
              className="
                font-semibold
                text-slate-700
                dark:text-slate-200
              "
            >
              {users.length}
            </span>{" "}
            users
          </p>

          {(search ||
            roleFilter !== "All") && (
            <button
              onClick={clearFilters}
              className="
                text-sm
                font-medium
                text-slate-500
                transition
                hover:text-slate-900

                dark:text-slate-400
                dark:hover:text-white
              "
            >
              Clear filters
            </button>
          )}
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="px-5 py-16 text-center">
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-slate-200
                border-t-slate-800

                dark:border-slate-700
                dark:border-t-white
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Loading users...
            </p>
          </div>
        ) : (
          <>
            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50

                      dark:border-slate-800
                      dark:bg-slate-950
                    "
                  >
                    {[
                      "User",
                      "Role",
                      "Status",
                      "Agents",
                      "Last Active",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="
                          px-5
                          py-3
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {heading}
                      </th>
                    ))}

                    <th
                      className="
                        px-5
                        py-3
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500

                        dark:text-slate-400
                      "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map(
                    (user) => (
                      <tr
                        key={user.id}
                        className="
                          border-b
                          border-slate-100
                          transition
                          hover:bg-slate-50

                          dark:border-slate-800
                          dark:hover:bg-slate-800/50
                        "
                      >
                        {/* USER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                text-sm
                                font-semibold
                                ${getAvatarClass(
                                  user.role
                                )}
                              `}
                            >
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p
                                className="
                                  font-medium
                                  text-slate-900

                                  dark:text-white
                                "
                              >
                                {user.name}
                              </p>

                              <p
                                className="
                                  text-sm
                                  text-slate-500

                                  dark:text-slate-400
                                "
                              >
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getRoleClass(
                                user.role
                              )}
                            `}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-semibold
                              ${getStatusClass(
                                user.status
                              )}
                            `}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {user.status}
                          </span>
                        </td>

                        {/* AGENTS */}

                        <td className="px-5 py-4">
                          {user.agents.length ===
                          0 ? (
                            <span
                              className="
                                text-sm
                                text-slate-400
                                dark:text-slate-500
                              "
                            >
                              No agents
                            </span>
                          ) : (
                            <div className="flex max-w-[260px] flex-wrap gap-1.5">
                              {user.agents
                                .slice(0, 3)
                                .map(
                                  (agent) => (
                                    <span
                                      key={
                                        agent.id
                                      }
                                      title={`${agent.name} · ${agent.taskCount} tasks`}
                                      className="
                                        inline-flex
                                        max-w-[150px]
                                        items-center
                                        rounded-full
                                        bg-slate-100
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-medium
                                        text-slate-700

                                        dark:bg-slate-800
                                        dark:text-slate-300
                                      "
                                    >
                                      <span className="truncate">
                                        {
                                          agent.name
                                        }
                                      </span>
                                    </span>
                                  )
                                )}

                              {user.agents
                                .length >
                                3 && (
                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-blue-700

                                    dark:bg-blue-950/50
                                    dark:text-blue-400
                                  "
                                >
                                  +
                                  {user.agents
                                    .length -
                                    3}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* LAST ACTIVE */}

                        <td
                          className="
                            px-5
                            py-4
                            text-sm
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          {user.lastActive}
                        </td>

                        {/* ACTION */}

                        <td className="relative px-5 py-4 text-right">
                          <button
                            onClick={(event) => {
                              if (
                                openMenu ===
                                user.id
                              ) {
                                setOpenMenu(
                                  null
                                )
                                return
                              }

                              const buttonRect =
                                event.currentTarget.getBoundingClientRect()

                              const menuWidth =
                                160
                              const menuHeight =
                                132
                              const gap = 8
                              const viewportPadding =
                                12

                              let left =
                                buttonRect.right -
                                menuWidth

                              if (
                                left <
                                viewportPadding
                              ) {
                                left =
                                  viewportPadding
                              }

                              if (
                                left +
                                  menuWidth >
                                window.innerWidth -
                                  viewportPadding
                              ) {
                                left =
                                  window.innerWidth -
                                  menuWidth -
                                  viewportPadding
                              }

                              const spaceBelow =
                                window.innerHeight -
                                buttonRect.bottom

                              const spaceAbove =
                                buttonRect.top

                              let top

                              if (
                                spaceBelow >=
                                menuHeight +
                                  gap
                              ) {
                                top =
                                  buttonRect.bottom +
                                  gap
                              } else if (
                                spaceAbove >=
                                menuHeight +
                                  gap
                              ) {
                                top =
                                  buttonRect.top -
                                  menuHeight -
                                  gap
                              } else {
                                top =
                                  Math.max(
                                    viewportPadding,
                                    Math.min(
                                      buttonRect.bottom +
                                        gap,
                                      window.innerHeight -
                                        menuHeight -
                                        viewportPadding
                                    )
                                  )
                              }

                              setMenuPosition({
                                top,
                                left,
                              })

                              setOpenMenu(
                                user.id
                              )
                            }}
                            disabled={
                              deletingId ===
                              user.id
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
                              disabled:cursor-not-allowed
                              disabled:opacity-50

                              dark:text-slate-500
                              dark:hover:bg-slate-800
                              dark:hover:text-white
                            "
                            aria-label={`Actions for ${user.name}`}
                          >
                            ⋮
                          </button>

                          {openMenu ===
                            user.id &&
                            createPortal(
                              <div
                                className="
                                  fixed
                                  z-[100]
                                  w-40
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-slate-200
                                  bg-white
                                  py-1
                                  text-left
                                  shadow-xl

                                  dark:border-slate-700
                                  dark:bg-slate-900
                                "
                                style={{
                                  top: `${menuPosition.top}px`,
                                  left: `${menuPosition.left}px`,
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedUser(
                                      user
                                    )
                                    setOpenMenu(
                                      null
                                    )
                                  }}
                                  className="
                                    block
                                    w-full
                                    px-4
                                    py-2.5
                                    text-left
                                    text-sm
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50

                                    dark:text-slate-300
                                    dark:hover:bg-slate-800
                                  "
                                >
                                  View Details
                                </button>

                                <button
                                  onClick={() =>
                                    openEditUser(
                                      user
                                    )
                                  }
                                  className="
                                    block
                                    w-full
                                    px-4
                                    py-2.5
                                    text-left
                                    text-sm
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50

                                    dark:text-slate-300
                                    dark:hover:bg-slate-800
                                  "
                                >
                                  Edit User
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      user.id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    user.id
                                  }
                                  className="
                                    block
                                    w-full
                                    px-4
                                    py-2.5
                                    text-left
                                    text-sm
                                    text-red-600
                                    transition
                                    hover:bg-red-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    dark:text-red-400
                                    dark:hover:bg-red-950/40
                                  "
                                >
                                  {deletingId ===
                                  user.id
                                    ? "Deleting..."
                                    : "Delete User"}
                                </button>
                              </div>,
                              document.body
                            )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* EMPTY STATE */}

              {filteredUsers.length ===
                0 && (
                <div className="px-5 py-16 text-center">
                  <div
                    className="
                      mx-auto
                      mb-3
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-100
                      text-xl
                      text-slate-400

                      dark:bg-slate-800
                      dark:text-slate-500
                    "
                  >
                    ?
                  </div>

                  <h3
                    className="
                      font-semibold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    No users found
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Try changing your
                    search or filters.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ====================================================== */}
      {/* VIEW USER MODAL */}
      {/* ====================================================== */}

      {selectedUser && (
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
            backdrop-blur-[2px]
          "
          onClick={() =>
            setSelectedUser(null)
          }
        >
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              border
              border-transparent
              bg-white
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-900
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-slate-200
                p-6

                dark:border-slate-800
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  User Details
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  View account information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
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

                  dark:text-slate-500
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                ×
              </button>
            </div>

            {/* PROFILE */}

            <div className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    text-lg
                    font-semibold
                    ${getAvatarClass(
                      selectedUser.role
                    )}
                  `}
                >
                  {selectedUser.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {selectedUser.name}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* DETAILS */}

              <div
                className="
                  mt-6
                  rounded-lg
                  border
                  border-slate-200

                  dark:border-slate-700
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    dark:border-slate-800
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    User ID
                  </span>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    #{selectedUser.id}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    dark:border-slate-800
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Role
                  </span>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${getRoleClass(
                        selectedUser.role
                      )}
                    `}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-4
                    py-3

                    dark:border-slate-800
                  "
                >
                  <span
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Status
                  </span>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${getStatusClass(
                        selectedUser.status
                      )}
                    `}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                <div
                  className="
                    border-b
                    border-slate-100
                    px-4
                    py-4

                    dark:border-slate-800
                  "
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Assigned Agents
                    </span>

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {
                        selectedUser
                          .agents.length
                      }
                    </span>
                  </div>

                  {selectedUser.agents
                    .length === 0 ? (
                    <p
                      className="
                        mt-2
                        text-sm
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      This user has not
                      used any agent yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {selectedUser.agents.map(
                        (agent) => (
                          <div
                            key={agent.id}
                            className="
                              rounded-lg
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-2.5

                              dark:border-slate-700
                              dark:bg-slate-800
                            "
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-800

                                    dark:text-white
                                  "
                                >
                                  {agent.name}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    truncate
                                    text-xs
                                    text-slate-500

                                    dark:text-slate-400
                                  "
                                >
                                  {agent.slug}
                                </p>
                              </div>

                              <span
                                className="
                                  shrink-0
                                  rounded-full
                                  bg-white
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-medium
                                  text-slate-600

                                  dark:bg-slate-900
                                  dark:text-slate-300
                                "
                              >
                                {
                                  agent.taskCount
                                }{" "}
                                tasks
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Last Active
                  </span>

                  <span
                    className="
                      text-sm
                      font-medium
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {
                      selectedUser.lastActive
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
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

                  dark:bg-white
                  dark:text-slate-900
                  dark:hover:bg-slate-200
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* EDIT USER MODAL */}
      {/* ====================================================== */}

      {editingUser && (
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
            backdrop-blur-[2px]
          "
          onClick={() => {
            if (!submitting) {
              setEditingUser(null)
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-xl
              border
              border-transparent
              bg-white
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-900
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-slate-200
                p-6

                dark:border-slate-800
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Edit User
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Update this user's account
                  information
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingUser(null)
                }
                disabled={submitting}
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

                  dark:text-slate-500
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleEditUser}
              className="p-6"
            >
              <div className="space-y-4">
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    disabled={submitting}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    disabled={submitting}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Role
                  </label>

                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    disabled={submitting}
                    className={inputClass}
                  >
                    <option value="User">
                      User
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div
                  className="
                    rounded-lg
                    bg-slate-50
                    p-4

                    dark:bg-slate-800
                  "
                >
                  <p
                    className="
                      text-xs
                      font-medium
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    User ID
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-700

                      dark:text-slate-200
                    "
                  >
                    #{editingUser.id}
                  </p>
                </div>

                {formError && (
                  <div
                    className="
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3

                      dark:border-red-900
                      dark:bg-red-950/40
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-medium
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser(null)
                  }
                  disabled={submitting}
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    rounded-lg
                    bg-slate-900
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-slate-800

                    dark:bg-white
                    dark:text-slate-900
                    dark:hover:bg-slate-200
                  "
                >
                  {submitting
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* ADD USER MODAL */}
      {/* ====================================================== */}

      {showAddUser && (
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
            backdrop-blur-[2px]
          "
          onClick={() => {
            if (!submitting) {
              setShowAddUser(false)
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-xl
              border
              border-transparent
              bg-white
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-900
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                flex
                items-start
                justify-between
                border-b
                border-slate-200
                p-6

                dark:border-slate-800
              "
            >
              <div>
                <h2
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Add New User
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Create a new user account
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddUser(false)
                }
                disabled={submitting}
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

                  dark:text-slate-500
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleAddUser}
              className="p-6"
            >
              <div className="space-y-4">
                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    disabled={submitting}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    disabled={submitting}
                    placeholder="Enter email address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Role
                  </label>

                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    disabled={submitting}
                    className={inputClass}
                  >
                    <option value="User">
                      User
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    disabled={submitting}
                    placeholder="Enter password"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      newUser.confirmPassword
                    }
                    onChange={handleNewUserChange}
                    disabled={submitting}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                </div>

                {formError && (
                  <div
                    className="
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-3

                      dark:border-red-900
                      dark:bg-red-950/40
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-medium
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddUser(false)
                  }
                  disabled={submitting}
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:bg-slate-800
                    dark:hover:text-white
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    rounded-lg
                    bg-slate-900
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-slate-800

                    dark:bg-white
                    dark:text-slate-900
                    dark:hover:bg-slate-200
                  "
                >
                  {submitting
                    ? "Creating..."
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users