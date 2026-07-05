import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400 dark:border-slate-800">
        MediBook &mdash; demo app with mock data, no real medical services.
      </footer>
    </div>
  )
}
