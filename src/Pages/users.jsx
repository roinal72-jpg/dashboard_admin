import { useMemo, useState } from "react"

const initialUsers = [
  {
    id: 1,
    name: "Ahmad",
    email: "ahmad@example.com",
    role: "Admin",
    status: "Active",
    agents: 12,
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    agents: 5,
    lastActive: "10 min ago",
  },
  {
    id: 3,
    name: "Sarah",
    email: "sarah@example.com",
    role: "User",
    status: "Suspended",
    agents: 2,
    lastActive: "2 hours ago",
  },
  {
    id: 4,
    name: "Michael",
    email: "michael@example.com",
    role: "Operator",
    status: "Active",
    agents: 8,
    lastActive: "30 min ago",
  },
  {
    id: 5,
    name: "David",
    email: "david@example.com",
    role: "User",
    status: "Inactive",
    agents: 0,
    lastActive: "2 days ago",
  },
]

function Users() {
  const [users, setUsers] = useState(initialUsers)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [openMenu, setOpenMenu] = useState(null)

  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  const [showAddUser, setShowAddUser] = useState(false)

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
    password: "",
    confirmPassword: "",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  })

  const [formError, setFormError] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    )

    if (!confirmed) return

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    )

    setOpenMenu(null)
  }

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "bg-green-100 text-green-700"
    }

    if (status === "Suspended") {
      return "bg-red-100 text-red-700"
    }

    return "bg-slate-100 text-slate-600"
  }

  const getRoleClass = (role) => {
    if (role === "Admin") {
      return "bg-purple-100 text-purple-700"
    }

    if (role === "Operator") {
      return "bg-blue-100 text-blue-700"
    }

    return "bg-slate-100 text-slate-600"
  }

  // Avatar color follows the user's role
  const getAvatarClass = (role) => {
    if (role === "Admin") {
      return "bg-purple-600 text-white"
    }

    if (role === "Operator") {
      return "bg-blue-600 text-white"
    }

    return "bg-slate-500 text-white"
  }

  const handleNewUserChange = (event) => {
    const { name, value } = event.target

    setNewUser((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError("")
  }

  const handleAddUser = (event) => {
    event.preventDefault()

    const name = newUser.name.trim()
    const email = newUser.email.trim()

    if (!name || !email || !newUser.password) {
      setFormError("Please fill in all required fields.")
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      setFormError("Passwords do not match.")
      return
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase()
    )

    if (emailExists) {
      setFormError(
        "A user with this email already exists."
      )
      return
    }

    const newUserData = {
      id:
        users.length > 0
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1,
      name,
      email,
      role: newUser.role,
      status: newUser.status,
      agents: 0,
      lastActive: "Just now",
    }

    setUsers((currentUsers) => [
      newUserData,
      ...currentUsers,
    ])

    setNewUser({
      name: "",
      email: "",
      role: "User",
      status: "Active",
      password: "",
      confirmPassword: "",
    })

    setFormError("")
    setShowAddUser(false)
  }

  const openEditUser = (user) => {
    setEditingUser(user)

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
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

  const handleEditUser = (event) => {
    event.preventDefault()

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
        user.email.toLowerCase() === email.toLowerCase()
    )

    if (emailExists) {
      setFormError(
        "A user with this email already exists."
      )
      return
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name,
              email,
              role: editForm.role,
              status: editForm.status,
            }
          : user
      )
    )

    setEditingUser(null)
    setFormError("")
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Users
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage users and their access
        </p>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search users..."
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

          {/* Filters + Add User */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
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
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Operator">Operator</option>
              <option value="User">User</option>
            </select>

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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            <button
              onClick={() => {
                setFormError("")
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
              "
            >
              <span className="text-base leading-none">
                +
              </span>

              Add User
            </button>
          </div>
        </div>

        {/* Result Info */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {users.length}
            </span>{" "}
            users
          </p>

          {(search ||
            roleFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("")
                setRoleFilter("All")
                setStatusFilter("All")
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
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Agents
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Active
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  {/* User */}
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
                          transition-colors
                          duration-200
                          ${getAvatarClass(user.role)}
                        `}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        user.status
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>

                  {/* Agents */}
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {user.agents}
                  </td>

                  {/* Last Active */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {user.lastActive}
                  </td>

                  {/* Action */}
                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === user.id
                            ? null
                            : user.id
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
                      aria-label={`Actions for ${user.name}`}
                    >
                      ⋮
                    </button>

                    {openMenu === user.id && (
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
                        {/* View */}
                        <button
                          onClick={() => {
                            setSelectedUser(user)
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

                        {/* Edit */}
                        <button
                          onClick={() =>
                            openEditUser(user)
                          }
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
                          Edit User
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(user.id)
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
                          Delete User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                ?
              </div>

              <h3 className="font-semibold text-slate-800">
                No users found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
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
          "
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  User Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View account information
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
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

            {/* User Profile */}
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
                    transition-colors
                    duration-200
                    ${getAvatarClass(selectedUser.role)}
                  `}
                >
                  {selectedUser.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {selectedUser.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-6 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Role
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClass(
                      selectedUser.role
                    )}`}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Assigned Agents
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {selectedUser.agents}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Last Active
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {selectedUser.lastActive}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
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
          "
          onClick={() => setEditingUser(null)}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update this user's account information
                </p>
              </div>

              <button
                onClick={() => setEditingUser(null)}
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

            {/* Edit Form */}
            <form
              onSubmit={handleEditUser}
              className="p-6"
            >
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="
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
                      focus:border-slate-400
                      focus:ring-2
                      focus:ring-slate-100
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="
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
                      focus:border-slate-400
                      focus:ring-2
                      focus:ring-slate-100
                    "
                  />
                </div>

                {/* Role + Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleEditChange}
                      className="
                        w-full
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
                      <option value="User">
                        User
                      </option>

                      <option value="Operator">
                        Operator
                      </option>

                      <option value="Admin">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      className="
                        w-full
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
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="Suspended">
                        Suspended
                      </option>
                    </select>
                  </div>
                </div>

                {/* Info */}
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    #{editingUser.id}
                  </p>
                </div>

                {/* Error */}
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-600">
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditingUser(null)
                  }
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
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
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
                    hover:shadow-md
                  "
                >
                  Save Changes
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
          "
          onClick={() => setShowAddUser(false)}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-xl
              bg-white
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new user account
                </p>
              </div>

              <button
                onClick={() => setShowAddUser(false)}
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

            {/* Form */}
            <form
              onSubmit={handleAddUser}
              className="p-6"
            >
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="Enter full name"
                    className="
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
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Enter email address"
                    className="
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
                    "
                  />
                </div>

                {/* Role + Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <select
                      name="role"
                      value={newUser.role}
                      onChange={handleNewUserChange}
                      className="
                        w-full
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
                      <option value="User">
                        User
                      </option>

                      <option value="Operator">
                        Operator
                      </option>

                      <option value="Admin">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={newUser.status}
                      onChange={handleNewUserChange}
                      className="
                        w-full
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
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="Suspended">
                        Suspended
                      </option>
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Enter password"
                    className="
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
                    "
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={newUser.confirmPassword}
                    onChange={handleNewUserChange}
                    placeholder="Confirm password"
                    className="
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
                    "
                  />
                </div>

                {/* Error */}
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-600">
                      {formError}
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddUser(false)
                  }
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
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
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
                    hover:shadow-md
                  "
                >
                  Create User
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