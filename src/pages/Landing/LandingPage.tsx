import { Link, Navigate } from 'react-router-dom';
import {
  ScanLine,
  Fence,
  Beef,
  ShieldCheck,
  Map,
  ScrollText,
  MessageCircle,
  LogIn,
  Wallet,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDefaultRoute } from '../../utils/permissions';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/ui/Button';

const WHATSAPP_NUMBER = '526141304205';
const WHATSAPP_MESSAGE = 'Hola, quiero más información sobre el sistema Granja.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const FEATURES = [
  {
    icon: ScanLine,
    title: 'Escaneo de arete',
    description:
      'Escanea con cámara o lector físico (RFID/USB) y accede al instante al expediente completo del animal, o date de alta si es nuevo.',
  },
  {
    icon: Fence,
    title: 'Corrales y fórmulas relacionados',
    description:
      'Cada corral sabe qué fórmula come, cada cuándo y cuántos animales tiene activos — calculado en tiempo real, no capturado a mano.',
  },
  {
    icon: Wallet,
    title: 'Costo y peso siempre al día',
    description:
      'El costo de alimento y medicamentos se prorratea automáticamente por animal y por día. El peso mostrado siempre es el más reciente.',
  },
  {
    icon: ShieldCheck,
    title: 'Roles y permisos dinámicos',
    description:
      'Administrador, veterinario, pasturero o los roles que definas — los permisos se administran desde el panel y aplican de inmediato.',
  },
  {
    icon: Map,
    title: 'Mapa de distribución',
    description: 'Sube una foto o plano del rancho y ubica cada corral arrastrándolo a su lugar real.',
  },
  {
    icon: ScrollText,
    title: 'Bitácora del sistema',
    description:
      'Cada petición al backend queda registrada (ruta, usuario, fecha y hora) en una página exclusiva para el equipo de sistemas.',
  },
];

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) return <Navigate to={getDefaultRoute(user?.permissions ?? [])} replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BrandMark size="sm" />
            <div>
              <p className="text-base font-semibold leading-none text-slate-900">Granja</p>
              <p className="mt-1 text-xs text-slate-500">E2E Tech Solutions</p>
            </div>
          </div>
          <Link to="/login">
            <Button className="flex items-center gap-1.5">
              <LogIn size={15} strokeWidth={2.25} />
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-brand-400/30 blur-[100px]" />
          <div className="absolute -right-24 top-1/4 h-[22rem] w-[22rem] rounded-full bg-accent-400/25 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Todo el ciclo de engorda de tu ganado,{' '}
            <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-accent-300 bg-clip-text text-transparent">
              en un solo lugar
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            Granja conecta escaneo de arete, corrales, fórmulas de alimento, pesajes, medicamentos, costos y
            trazabilidad completa — desde la oficina o desde el corral, con el mismo sistema.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login">
              <Button large className="flex items-center gap-2">
                <LogIn size={18} strokeWidth={2.25} />
                Iniciar sesión
              </Button>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button large variant="secondary" className="flex items-center gap-2 bg-white">
                <MessageCircle size={18} strokeWidth={2.25} />
                Contactar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">¿Qué hace el sistema?</h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Pensado para reemplazar hojas de cálculo y libretas: cada dato queda relacionado con el resto,
            sin capturarlo dos veces.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-sky-500 to-accent-500 text-white shadow-sm shadow-brand-500/25 ring-1 ring-inset ring-white/25">
                <Icon size={20} strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trazabilidad */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-2">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Beef size={20} strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Expediente por animal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {['Historial de pesajes y medicamentos', 'Movimientos entre corrales', 'Costo acumulado real', 'Salud: días en tratamiento vs. promedio histórico de curación'].map(
                (item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={15} strokeWidth={2.25} className="mt-0.5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <ShieldCheck size={20} strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Acceso controlado por rol</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {['Administrador, veterinario, pasturero o roles a la medida', 'Permisos administrables desde el panel, sin tocar código', 'Cambios de acceso aplican de inmediato', 'Bitácora exclusiva para el equipo de sistemas'].map(
                (item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={15} strokeWidth={2.25} className="mt-0.5 shrink-0 text-accent-600" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">¿Listo para entrar?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
          Ingresa con tu cuenta, o escríbenos por WhatsApp si necesitas acceso o tienes dudas sobre el
          sistema.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login">
            <Button large className="flex items-center gap-2">
              <LogIn size={18} strokeWidth={2.25} />
              Iniciar sesión
            </Button>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button large variant="secondary" className="flex items-center gap-2">
              <MessageCircle size={18} strokeWidth={2.25} />
              WhatsApp: 614 130 4205
            </Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-6 text-center text-xs text-slate-400">
          <BrandMark size="sm" />
          <span>Granja — un sistema de E2E Tech Solutions</span>
        </div>
      </footer>
    </div>
  );
}
