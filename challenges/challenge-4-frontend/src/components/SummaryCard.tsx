interface SummaryCardProps {
  count: number;
  label: string;
  color: 'cyan' | 'blue' | 'magenta' | 'green';
}

export function SummaryCard({ count, label, color }: SummaryCardProps): JSX.Element {
  const getColorClasses = (colorType: string): string => {
    switch (colorType) {
      case 'cyan':
        return 'bg-cyan-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'magenta':
        return 'bg-pink-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`h-20 rounded-lg p-4 flex flex-col justify-center ${getColorClasses(color)} shadow-md hover:shadow-lg transition-shadow`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="text-3xl font-bold mt-1">{count}</p>
    </div>
  );
}
