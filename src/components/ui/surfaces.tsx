import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { IconAlert, IconCheck, IconInfo } from "./icons";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-line px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-brand-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "brand";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-brand-50 text-brand-700 ring-brand-100",
  brand: "bg-brand-900 text-white ring-brand-900",
  accent: "bg-accent-50 text-accent-700 ring-accent-100",
  success: "bg-success-50 text-success-700 ring-success-100",
  warning: "bg-warning-50 text-warning-700 ring-warning-100",
  danger: "bg-danger-50 text-danger-700 ring-danger-100",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type AlertTone = "info" | "success" | "warning" | "danger";

const alertConfig: Record<
  AlertTone,
  { classes: string; icon: ReactNode; role: "status" | "alert" }
> = {
  info: {
    classes: "border-brand-200 bg-brand-50 text-brand-800",
    icon: <IconInfo className="h-5 w-5 text-brand-600" />,
    role: "status",
  },
  success: {
    classes: "border-success-100 bg-success-50 text-success-700",
    icon: <IconCheck className="h-5 w-5 text-success-600" />,
    role: "status",
  },
  warning: {
    classes: "border-warning-100 bg-warning-50 text-warning-700",
    icon: <IconAlert className="h-5 w-5 text-warning-600" />,
    role: "status",
  },
  danger: {
    classes: "border-danger-100 bg-danger-50 text-danger-700",
    icon: <IconAlert className="h-5 w-5 text-danger-600" />,
    role: "alert",
  },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const config = alertConfig[tone];
  return (
    <div
      role={config.role}
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
        config.classes,
        className,
      )}
    >
      <span className="mt-0.5 shrink-0">{config.icon}</span>
      <div className="min-w-0 space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="leading-relaxed">{children}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-200 bg-white px-6 py-12 text-center">
      {icon ? (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-brand-900">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-brand-500">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
