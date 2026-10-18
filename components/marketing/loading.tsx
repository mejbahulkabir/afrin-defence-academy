export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-12 w-2/3 animate-pulse rounded-md bg-muted" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />))}
      </div>
    </div>
  );
}
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
