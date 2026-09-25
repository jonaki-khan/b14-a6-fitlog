interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
}

export default function StatsCard({
  title,
  value,
  suffix,
}: StatsCardProps) {
  return (
    <div className="card-dark p-5">
      <p className="text-gray-500 text-xs font-bold uppercase">
        {title}
      </p>

      <p className="text-3xl font-black mt-2 text-[#ccff00]">
        {value}
        {suffix && (
          <span className="text-sm text-gray-500 ml-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}