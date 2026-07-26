import React from "react";
import { InboxIcon, BoxIcon } from "lucide-react";
export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action





}: {icon?: BoxIcon;title: string;description?: string;action?: React.ReactNode;}) {
  return <div className="flex flex-col items-center justify-center rounded-xl2 border-2 border-dashed border-line bg-canvas/50 px-6 py-14 text-center">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-lime-soft">
        <Icon className="h-6 w-6 text-ink" />
      </span>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-smoke">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>;
}