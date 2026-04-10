import type { ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type EyebrowTone = "primary" | "success" | "danger" | "neutral";

const EYEBROW_TONE_CLASS: Record<EyebrowTone, string> = {
  primary: "bg-primary-container text-primary",
  success: "bg-success-container text-success",
  danger: "bg-error-container text-error",
  neutral: "bg-surface-container text-on-surface-variant",
};

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  className?: string;
}

export function Eyebrow({
  children,
  tone = "primary",
  className,
}: EyebrowProps) {
  return (
    <span
      className={cx(
        "hero-kicker",
        EYEBROW_TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cx(
        "section-heading",
        centered && "section-heading-center",
        className,
      )}
    >
      <div className="section-heading-copy">
        {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
        <h2 className="section-heading-title">{title}</h2>
        {description ? (
          <p className="section-heading-description">{description}</p>
        ) : null}
      </div>
      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  );
}

interface MetricItem {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
}

interface MetricGridProps {
  items: MetricItem[];
  className?: string;
}

export function MetricGrid({ items, className }: MetricGridProps) {
  return (
    <div className={cx("metric-grid", className)}>
      {items.map((item) => (
        <article key={item.label} className="metric-card">
          <p className="metric-label">{item.label}</p>
          <p className="metric-value">{item.value}</p>
          {item.helper ? <p className="metric-helper">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  secondary?: ReactNode;
  className?: string;
}

export function EmptyStateCard({
  title,
  description,
  action,
  secondary,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx("empty-state-card", className)}>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action || secondary ? (
        <div className="empty-state-actions">
          {action}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
