export function BusinessCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[18px] overflow-hidden shadow-card animate-pulse">
      <div className="aspect-video w-full bg-verde-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-verde-muted rounded-full" />
        <div className="h-3 w-1/3 bg-verde-muted rounded-full" />
        <div className="h-3 w-full bg-verde-muted rounded-full" />
        <div className="h-3 w-2/3 bg-verde-muted rounded-full" />
      </div>
    </div>
  );
}
