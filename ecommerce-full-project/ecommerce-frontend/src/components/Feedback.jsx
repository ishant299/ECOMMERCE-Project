export const Spinner = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-400">
    <div className="w-8 h-8 border-2 border-stone-200 border-t-plum-700 rounded-full animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);

const STATUS_STYLES = {
  pending: 'bg-amber-400/20 text-amber-600',
  processing: 'bg-plum-50 text-plum-700',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
};

export const StatusBadge = ({ status }) => (
  <span className={`tag-chip ${STATUS_STYLES[status] || 'bg-stone-100 text-stone-600'} capitalize`}>
    {status}
  </span>
);
