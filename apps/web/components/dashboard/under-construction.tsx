import { ConstructionIcon } from "lucide-react"

export function UnderConstruction({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-warm)_18%,transparent)]">
        <ConstructionIcon className="size-7 text-[var(--color-warm)]" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          This part of the dashboard is still under construction. Check back soon.
        </p>
      </div>
    </div>
  )
}
