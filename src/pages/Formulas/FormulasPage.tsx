import { Wheat } from 'lucide-react';
import { useFormulas } from '../../hooks/useFormulas';
import { usePagination } from '../../hooks/usePagination';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { PageHeader } from '../../components/ui/PageHeader';
import { FormulaCard } from './FormulaCard';
import { CreateFormulaForm } from './CreateFormulaForm';

export function FormulasPage() {
  const { formulas, loading, error, reload } = useFormulas();
  const { page, setPage, totalPages, pageItems, totalItems, pageSize } = usePagination(formulas, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wheat}
        title="Fórmulas de alimento"
        description="Qué come cada corral, por qué, cada cuándo y cómo aplicarla"
      />

      {loading && <LoadingSkeleton rows={3} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && formulas.length === 0 && <EmptyState title="Sin fórmulas registradas" />}
      {!loading && !error && formulas.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pageItems.map((formula) => (
              <FormulaCard key={formula.id} formula={formula} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </div>
      )}

      <CreateFormulaForm onCreated={reload} />
    </div>
  );
}
