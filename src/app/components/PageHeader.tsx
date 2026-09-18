export function PageHeader({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
      <h1 className="text-[#003A70]">{title}</h1>
      <p className="text-[#6C757D]">{subtitle}</p>
    </div>
  );
}
