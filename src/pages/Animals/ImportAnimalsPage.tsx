import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { useCorrales } from '../../hooks/useCorrales';
import { createAnimal } from '../../api/animals';
import { parseExcelFile, type ParsedSheet } from '../../utils/excel';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { BackLink } from '../../components/ui/BackLink';
import { ImportColumnMapping } from './ImportColumnMapping';
import { ImportPreviewTable } from './ImportPreviewTable';
import { buildPreviewRows, guessMapping, type FieldMapping } from './ImportPreview';

type ImportSummary = { exitosos: number; fallidos: number } | null;

export function ImportAnimalsPage() {
  const navigate = useNavigate();
  const { animals, reload } = useAnimals();
  const { corrales } = useCorrales();

  const [parsed, setParsed] = useState<ParsedSheet | null>(null);
  const [mapping, setMapping] = useState<Partial<FieldMapping>>({});
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const existingAretes = useMemo(
    () => new Set(animals.map((a) => a.arete.toLowerCase())),
    [animals],
  );

  const mappingComplete =
    !!mapping.arete && !!mapping.fechaIngreso && !!mapping.pesoIngreso && !!mapping.corral;

  const previewRows = useMemo(() => {
    if (!parsed || !mappingComplete) return [];
    return buildPreviewRows(parsed.rows, mapping as FieldMapping, corrales, existingAretes);
  }, [parsed, mapping, mappingComplete, corrales, existingAretes]);

  const importables = previewRows.filter((r) => r.status === 'ok');

  const handleFile = async (file: File) => {
    setFileError(null);
    setSummary(null);
    try {
      const result = await parseExcelFile(file);
      setParsed(result);
      setMapping(guessMapping(result.headers));
    } catch {
      setFileError('No se pudo leer el archivo. Verifica que sea un .xlsx, .xls o .csv válido.');
    }
  };

  const handleImport = async () => {
    setImporting(true);
    let exitosos = 0;
    let fallidos = 0;
    for (const row of importables) {
      try {
        await createAnimal({
          arete: row.arete,
          fechaIngreso: new Date(row.fechaIngreso).toISOString(),
          pesoIngreso: Number(row.pesoIngreso),
          corralId: row.corralId!,
        });
        exitosos += 1;
      } catch {
        fallidos += 1;
      }
    }
    setImporting(false);
    setSummary({ exitosos, fallidos });
    await reload();
  };

  return (
    <div className="max-w-4xl space-y-4">
      <BackLink to="/animales" label="Volver a Animales" />

      <PageHeader
        icon={FileSpreadsheet}
        title="Importar animales desde Excel"
        description="Sube el archivo, adapta las columnas y revisa antes de importar"
      />

      <Card>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-6 py-8 text-center hover:border-brand-400 hover:bg-brand-50">
          <Upload size={22} strokeWidth={1.75} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {parsed ? 'Cambiar archivo' : 'Selecciona un archivo .xlsx, .xls o .csv'}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
        {parsed && (
          <p className="mt-2 text-xs text-slate-500">
            {parsed.rows.length} filas detectadas, {parsed.headers.length} columnas.
          </p>
        )}
      </Card>

      {parsed && (
        <ImportColumnMapping
          headers={parsed.headers}
          mapping={mapping}
          onChange={(field, header) => setMapping((prev) => ({ ...prev, [field]: header }))}
        />
      )}

      {mappingComplete && previewRows.length > 0 && (
        <>
          <Card className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <strong className="text-brand-700">{importables.length}</strong> de {previewRows.length} filas listas
              para importar (las demás se omiten: duplicadas, incompletas o sin corral coincidente).
            </p>
            <Button onClick={handleImport} disabled={importing || importables.length === 0} className="flex items-center gap-1.5">
              <Upload size={15} strokeWidth={2.25} />
              {importing ? 'Importando…' : `Importar ${importables.length} animales`}
            </Button>
          </Card>

          <ImportPreviewTable rows={previewRows} />
        </>
      )}

      {summary && (
        <Card className={summary.fallidos > 0 ? 'border-amber-200 bg-amber-50' : 'border-brand-200 bg-brand-50'}>
          <div className="flex items-start gap-2">
            {summary.fallidos > 0 ? (
              <AlertTriangle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-600" />
            ) : (
              <CheckCircle2 size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-brand-600" />
            )}
            <div className="text-sm">
              <p className="font-medium text-slate-800">
                {summary.exitosos} animales importados correctamente
                {summary.fallidos > 0 && `, ${summary.fallidos} con error`}.
              </p>
              <button
                type="button"
                onClick={() => navigate('/animales')}
                className="mt-1 font-medium text-brand-700 hover:underline"
              >
                Ver lista de animales →
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
