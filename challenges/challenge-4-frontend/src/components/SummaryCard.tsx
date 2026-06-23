interface SummaryCardProps {
  count: number;
  label: string;
  colorClass: string;
}

export function SummaryCard({ count, label, colorClass }: SummaryCardProps): JSX.Element {
  return (
    <div className={`${colorClass} p-4 md:p-6 rounded-lg border shadow-sm`}>
      <p className="text-sm md:text-base font-medium text-gray-700">
        {label}
      </p>
      <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
        {count}
      </p>
    </div>
  );
}
