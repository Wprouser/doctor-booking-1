import { NavLink, useNavigate } from 'react-router-dom'
import { signOut, useSession } from '../lib/auth-client'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
    isActive
      ? 'bg-teal-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

const authLinkClasses =
  'whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:px-4 sm:py-2 sm:text-sm dark:text-slate-300 dark:hover:bg-slate-800'

export function Navbar() {
  const { data: session } = useSession()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-1.5 px-3 py-3 sm:gap-4 sm:px-6">
        <NavLink to="/" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-900 sm:text-lg dark:text-white">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white sm:h-8 sm:w-8">+</span>
          MediBook
        </NavLink>
        <nav className="flex shrink-0 flex-wrap items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={linkClasses}>
            Find Doctors
          </NavLink>
          <NavLink to="/appointments" className={linkClasses}>
            My Appointments
          </NavLink>
          <span className="mx-0.5 h-4 w-px bg-slate-200 sm:mx-1 dark:bg-slate-700" />
          {session ? (
            <>
              <span className="max-w-20 truncate text-[11px] font-medium text-slate-500 sm:max-w-none sm:text-sm dark:text-slate-400">
                {session.user.name}
              </span>
              <button type="button" onClick={handleSignOut} className={authLinkClasses}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/sign-in" className={linkClasses}>
                Sign in
              </NavLink>
              <NavLink to="/sign-up" className={linkClasses}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
