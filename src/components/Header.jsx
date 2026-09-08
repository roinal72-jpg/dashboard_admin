function Header() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-7">

      {/* LEFT */}

      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-0.5 text-xs text-slate-500">
          Manage your Agentic AI platform
        </p>
      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-3">

        {/* NOTIFICATION */}

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Notifications"
        >
          <span className="text-base">
            ♢
          </span>

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>


        {/* HELP */}

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          aria-label="Help"
        >
          ?
        </button>


        {/* PROFILE */}

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
        >

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            A
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-xs font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-[10px] text-slate-400">
              Administrator
            </p>

          </div>

          <span className="text-xs text-slate-400">
            ▾
          </span>

        </button>

      </div>

    </header>
  )
}

export default Header