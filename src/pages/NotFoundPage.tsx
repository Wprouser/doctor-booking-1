import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="rounded-full bg-teal-600 px-5 py-2 font-medium text-white hover:bg-teal-700">
        Back to search
      </Link>
    </div>
  )
}
