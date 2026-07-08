export default function MetricsCard({ label, value, caption }) {
  return (
    <div className="rounded-card bg-tint p-2">
      <p className="text-caption font-medium text-secondary">{label}</p>
      <p className="text-h1 leading-tight text-primary">{value}</p>
      {caption && <p className="text-caption text-secondary">{caption}</p>}
    </div>
  );
}
