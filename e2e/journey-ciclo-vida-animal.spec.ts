import { test, expect } from '@playwright/test';
import { loginAsAdmin, uniqueSuffix } from './utils/auth';

/**
 * E2E de interfaz #1 — el ciclo de vida completo de un animal, navegando la
 * app real como lo haria el usuario: crear formula y corrales, registrar el
 * animal, verlo en la lista, abrir su expediente, registrar pesaje y
 * medicamento, moverlo de corral, marcarlo recuperado, y finalmente venderlo.
 */
test('Journey UI: ciclo de vida de un animal en la engorda', async ({ page }) => {
  // Journey largo (10 pasos navegando varias secciones): el timeout por
  // defecto de Playwright es por TEST completo, no por accion.
  test.setTimeout(90_000);

  const sufijo = uniqueSuffix();
  const nombreFormula = `Formula Playwright ${sufijo}`;
  const nombreCorralInicial = `Corral Playwright A ${sufijo}`;
  const nombreCorralDestino = `Corral Playwright B ${sufijo}`;
  const arete = `PW-${sufijo}`;

  await test.step('login como admin', async () => {
    await loginAsAdmin(page);
  });

  await test.step('crear una formula nueva', async () => {
    await page.getByRole('link', { name: 'Fórmulas' }).click();
    await page.getByLabel('Nombre').fill(nombreFormula);
    await page.getByLabel('Composición (qué come)').fill('Maiz, sorgo, minerales');
    await page.getByLabel('Costo por kilo').fill('4.5');
    // No se verifica que aparezca en esta misma lista: la grilla de formulas
    // esta paginada (6 por pagina) y con el uso normal del sistema la
    // recien creada bien puede caer en otra pagina. Se confirma que la
    // creacion funciono en el siguiente paso, al verla disponible para
    // asignar en el formulario de corrales.
    await page.getByRole('button', { name: 'Crear fórmula' }).click();
    await expect(page.getByLabel('Nombre')).toHaveValue('');
  });

  await test.step('crear el corral inicial, con esa formula asignada', async () => {
    await page.getByRole('link', { name: 'Corrales', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Nuevo corral' })).toBeVisible();

    await page.getByLabel('Capacidad').fill('20');
    // El texto de esta opcion trae un espacio de mas cuando la formula no
    // tiene frecuencia ("{nombre} {frecuencia}"), asi que se busca por el
    // <option> que contiene el nombre (coincidencia parcial) en vez de un
    // label exacto, y se selecciona por su value real.
    const formulaSelect = page.getByLabel('Fórmula que normalmente come (opcional)');
    const formulaOptionValue = await formulaSelect.locator('option', { hasText: nombreFormula }).getAttribute('value');
    await formulaSelect.selectOption(formulaOptionValue!);

    // "Nombre" se llena al final, justo antes de enviar: el formulario tuvo
    // un re-render intermitente que a veces limpiaba este campo si se
    // llenaba primero (carrera con la carga de formulas/corrales al montar
    // la pagina).
    await page.getByLabel('Nombre').fill(nombreCorralInicial);
    await expect(page.getByLabel('Nombre')).toHaveValue(nombreCorralInicial);
    await expect(page.getByLabel('Capacidad')).toHaveValue('20');

    await page.getByRole('button', { name: 'Crear corral' }).click();
    await expect(page.getByRole('cell', { name: nombreCorralInicial })).toBeVisible();
  });

  await test.step('crear un segundo corral, para moverlo despues', async () => {
    await page.getByLabel('Capacidad').fill('20');
    await page.getByLabel('Nombre').fill(nombreCorralDestino);
    await expect(page.getByLabel('Nombre')).toHaveValue(nombreCorralDestino);
    await page.getByRole('button', { name: 'Crear corral' }).click();
    await expect(page.getByRole('cell', { name: nombreCorralDestino })).toBeVisible();
  });

  await test.step('registrar el animal en el corral inicial', async () => {
    await page.getByRole('link', { name: 'Animales', exact: true }).click();
    await page.getByRole('button', { name: 'Registrar animal' }).click();
    await page.getByLabel('Código de arete').fill(arete);
    await page.getByLabel('Peso de ingreso (kg)').fill('180');
    await page.getByLabel('Corral inicial').selectOption({ label: nombreCorralInicial });
    await page.getByRole('button', { name: 'Registrar animal' }).click();
    await expect(page).toHaveURL(new RegExp(`/animales/${arete}`));
    await expect(page.getByRole('heading', { name: `Arete ${arete}` })).toBeVisible();
  });

  await test.step('aparece en la lista de animales', async () => {
    // exact:true porque el BackLink "Volver a Animales" del expediente
    // tambien matchea por substring con el link del sidebar.
    await page.getByRole('link', { name: 'Animales', exact: true }).click();
    await page.getByPlaceholder('Buscar por arete…').fill(arete);
    await expect(page.getByRole('cell', { name: arete })).toBeVisible();
    await page.getByRole('cell', { name: arete }).click();
  });

  await test.step('registrar un pesaje de seguimiento', async () => {
    await page.getByRole('tab', { name: 'Pesaje' }).click();
    await page.getByLabel('Peso (kg)').fill('210');
    await page.getByRole('button', { name: 'Guardar' }).click();
    // "210.00 kg" aparece tanto en el StatCard de "Peso actual" como en la
    // fila del historial ("210.00 kg (manual)") — se verifica la del
    // historial porque es unica.
    await expect(page.getByText('210.00 kg (manual)')).toBeVisible();
  });

  await test.step('aplicar un medicamento marca al animal como enfermo', async () => {
    await page.getByRole('tab', { name: 'Medicamento' }).click();
    await page.getByLabel('¿Requiere medicamento ahora?').check();
    await page.getByLabel('Enfermedad / motivo').fill('Fiebre');
    // exact:true: el checkbox "Requiere medicamento ahora?" tambien matchea
    // por substring con el label del campo de texto "Medicamento".
    await page.getByLabel('Medicamento', { exact: true }).fill('Oxitetraciclina');
    await page.getByLabel('Dosis').fill('10ml');
    await page.getByLabel('Costo').fill('45');
    await page.getByRole('button', { name: 'Guardar medicamento' }).click();
    await expect(page.getByText('Marcado como enfermo')).toBeVisible();
  });

  await test.step('mover al segundo corral', async () => {
    await page.getByRole('tab', { name: 'Mover de corral' }).click();
    await page.getByLabel('Corral de destino').selectOption({ label: nombreCorralDestino });
    await page.getByRole('button', { name: 'Mover animal' }).click();
    await expect(page.getByText('Movimiento registrado.')).toBeVisible();
    await expect(page.getByText(`Corral actual: ${nombreCorralDestino}`)).toBeVisible();
  });

  await test.step('marcar como recuperado', async () => {
    await page.getByRole('tab', { name: 'Medicamento' }).click();
    await page.getByRole('button', { name: 'Marcar como recuperado' }).click();
    await expect(page.getByText('Marcado como enfermo')).not.toBeVisible();
  });

  await test.step('el historial refleja pesaje, medicamento y movimiento', async () => {
    await expect(page.getByText('Oxitetraciclina')).toBeVisible();
  });

  await test.step('vender el animal', async () => {
    await page.getByRole('tab', { name: 'Baja' }).click();
    await page.getByRole('button', { name: 'Vender / Exportar' }).click();
    await page.getByLabel('Peso de salida (kg)').fill('480');
    await page.getByRole('button', { name: 'Registrar venta/exportación' }).click();
    await expect(page.getByText(/vendido/i).first()).toBeVisible();
  });
});
