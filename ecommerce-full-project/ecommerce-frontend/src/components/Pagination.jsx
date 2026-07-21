const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary !px-3 !py-1.5 text-xs"
      >
        Prev
      </button>

      {pages.map((p, idx) => (
        <span key={p} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="text-stone-400 text-xs">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-tag text-xs font-semibold ${
              p === page ? 'bg-plum-700 text-paper' : 'text-stone-600 hover:bg-plum-50'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="btn-secondary !px-3 !py-1.5 text-xs"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
