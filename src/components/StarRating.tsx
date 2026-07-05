export function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="flex text-amber-400" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < full ? '★' : '☆'}</span>
        ))}
      </span>
      <span className="font-medium text-slate-700 dark:text-slate-200">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-slate-400">({reviewCount})</span>
      )}
    </div>
  )
}
