import { ScanLine, Wallet, Fence, CheckCircle2 } from 'lucide-react';
import { BrandMark } from '../../components/BrandMark';

const FEATURES = [
  { icon: ScanLine, text: 'Escanea el arete y crea el expediente al instante' },
  { icon: Wallet, text: 'Costo de alimento y medicamentos prorrateado por animal' },
  { icon: Fence, text: 'Control de corrales, raciones y movimientos en tiempo real' },
];

export function LoginHero() {
  return (
    <div className="relative hidden overflow-hidden bg-[#0b1526] md:flex md:w-1/2 md:flex-col md:justify-between md:p-10 lg:p-12">
      {/* Fondo aurora: varios blobs vivos en movimiento, colores de marca (teal -> azul -> morado) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-32 h-[26rem] w-[26rem] animate-blob-slow rounded-full bg-brand-400/45 blur-[90px]" />
        <div className="absolute right-[-6rem] top-1/3 h-[22rem] w-[22rem] animate-blob-slower rounded-full bg-accent-400/40 blur-[90px]" />
        <div className="absolute bottom-[-8rem] left-1/4 h-[24rem] w-[24rem] animate-blob-slow rounded-full bg-sky-500/35 blur-[100px] [animation-delay:-6s]" />
      </div>

      {/* Textura de puntos, decorativa */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden="true">
        <defs>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="relative z-10 flex animate-fade-in-up items-center gap-2.5 text-white">
        <BrandMark size="sm" />
        <span className="text-lg font-semibold tracking-tight">Granja</span>
      </div>

      <div className="relative z-10 max-w-md">
        <h2 className="animate-fade-in-up text-3xl font-bold leading-[1.15] tracking-tight text-white [animation-delay:80ms] lg:text-4xl">
          Cada animal, de la báscula al corral,{' '}
          <span className="bg-gradient-to-r from-brand-300 to-accent-300 bg-clip-text text-transparent">
            en un solo lugar
          </span>
          .
        </h2>
        <p className="mt-4 animate-fade-in-up text-sm text-brand-100/80 [animation-delay:160ms]">
          El sistema que conecta escaneo, alimentación, costos y trazabilidad de tu engorda —
          desde la oficina o desde la trampa.
        </p>

        <ul className="mt-8 space-y-3.5">
          {FEATURES.map(({ icon: Icon, text }, index) => (
            <li
              key={text}
              className="flex animate-fade-in-up items-center gap-3 text-sm text-white/90"
              style={{ animationDelay: `${240 + index * 90}ms` }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur-md">
                <Icon size={16} strokeWidth={2.25} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Mockup flotante tipo "vista previa de producto" */}
      <div className="relative z-10 hidden animate-fade-in-up [animation-delay:520ms] sm:block">
        <div className="animate-float-slow w-72 -rotate-2 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400/20 text-brand-200">
                <ScanLine size={16} strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-xs font-medium text-white">Arete MX-00231</p>
                <p className="text-[11px] text-white/50">hace 2 minutos</p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-brand-400/20 px-2 py-0.5 text-[10px] font-medium text-brand-200">
              <CheckCircle2 size={11} /> activo
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/5 py-1.5">
              <p className="text-sm font-semibold text-white">Corral 3</p>
              <p className="text-[10px] text-white/50">ubicación</p>
            </div>
            <div className="rounded-lg bg-white/5 py-1.5">
              <p className="text-sm font-semibold text-white">185 kg</p>
              <p className="text-[10px] text-white/50">peso actual</p>
            </div>
            <div className="rounded-lg bg-white/5 py-1.5">
              <p className="text-sm font-semibold text-accent-200">$1,240</p>
              <p className="text-[10px] text-white/50">costo acum.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
