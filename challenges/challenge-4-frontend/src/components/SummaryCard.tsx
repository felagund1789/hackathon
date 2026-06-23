import { TaskStatus } from '../types/task';
import { SUMMARY_CARD_COLORS } from '../constants/taskColors';

interface SummaryCardProps {
  count: number;
  label: string;
  status: TaskStatus;
}

export function SummaryCard({ count, label, status }: SummaryCardProps): JSX.Element {

  return (
    <div className={`h-20 rounded-lg p-4 flex flex-col justify-center ${SUMMARY_CARD_COLORS[status]} shadow-md hover:shadow-lg transition-shadow`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="text-3xl font-bold mt-1">{count}</p>
    </div>
  );
}
