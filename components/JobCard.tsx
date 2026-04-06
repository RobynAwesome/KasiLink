// components/JobCard.tsx
import { formatRelativeTime } from "@/lib/format";

interface JobCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  postedAt: Date;
  pay: string;
}

export default function JobCard({
  title,
  description,
  category,
  location,
  postedAt,
  pay,
}: JobCardProps) {
  return (
    <article className="kasi-card h-full">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-on-surface-variant">{description}</p>
      <div className="mt-2 text-sm text-outline">
        <span>{category}</span> • <span>{location}</span>
      </div>
      <div className="mt-2 text-sm text-outline">
        Posted: {formatRelativeTime(postedAt)}
      </div>
      <div className="mt-2 font-bold text-primary">{pay}</div>
    </article>
  );
}
