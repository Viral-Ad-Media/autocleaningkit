/** The one drawn arrow, used as the last child of a button; it steps 3px right on hover. */
export function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.5 6h8.5M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
