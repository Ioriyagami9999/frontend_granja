const SIZES = {
  sm: 'h-9 w-9 rounded-xl',
  md: 'h-11 w-11 rounded-xl',
  lg: 'h-14 w-14 rounded-2xl',
};

/**
 * Logo real de la empresa (E2E Tech Solutions), provisto por el cliente
 * (logo.jpg) y servido como estatico desde /public.
 */
export function BrandMark({ size = 'md' }: { size?: keyof typeof SIZES }) {
  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 ${SIZES[size]}`}>
      <img src="/logo-e2e.jpg" alt="E2E Tech Solutions" className="h-full w-full object-cover" />
    </span>
  );
}
