import Papa from 'papaparse';
import { SHEETS_ID, SHEET_NAMES } from './config';

const buildUrl = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

const fetchSheet = async (sheetName) => {
  try {
    const url = buildUrl(sheetName);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
    return data;
  } catch (err) {
    console.error(`Erro ao carregar aba "${sheetName}":`, err);
    return [];
  }
};

const parseNum = (v) => {
  if (!v || v === '' || v === '-') return null;
  const cleaned = String(v).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
};

const parseBeneficiada = (row) => ({
  id: `ben-${Math.random().toString(36).slice(2, 8)}`,
  fornecedor: row['Fornecedor'] || '',
  tipo: row['Tipo'] || '',
  especie: row['Espécie'] || row['Especie'] || '',
  dimensoes: row['Dimensões'] || row['Dimensoes'] || '',
  qualidade: row['Qualidade'] || '1ª',
  qtdDisp: row['M²/ML Disp.'] || row['M2/ML Disp.'] || '',
  comprimento: row['Comprimento'] || '',
  unidade: row['Unidade'] || 'm²',
  precoVista: parseNum(row['Preço À Vista'] || row['Preco A Vista']),
  precoMedio: parseNum(row['Preço Ent+30/45/60'] || row['Preco Ent+30/45/60']),
  precoLongo: parseNum(row['Preço Ent+30/45/60/75/90'] || row['Preco Ent+30/45/60/75/90']),
  condicao: row['Condição'] || row['Condicao'] || '',
  obs: row['Obs'] || '',
  atualizado: row['Atualizado'] || '',
});

const parseNativa = (row) => ({
  id: `nat-${Math.random().toString(36).slice(2, 8)}`,
  fornecedor: row['Fornecedor'] || '',
  especie: row['Espécie'] || row['Especie'] || '',
  produto: row['Produto'] || '',
  disponivel: row['Disponível'] || row['Disponivel'] || '',
  unidade: row['Unidade'] || 'm³',
  precoVista: parseNum(row['Preço À Vista'] || row['Preco A Vista']),
  precoPrazo: parseNum(row['Preço a Prazo'] || row['Preco a Prazo']),
  condicao: row['Condição Pgto'] || row['Condicao Pgto'] || '',
  obs: row['Obs'] || '',
  destaque: (row['Destaque'] || '').toUpperCase() === 'SIM',
  atualizado: row['Atualizado'] || '',
});

const parseReflorestamento = (row) => ({
  id: `ref-${Math.random().toString(36).slice(2, 8)}`,
  fornecedor: row['Fornecedor'] || '',
  especie: row['Espécie'] || row['Especie'] || '',
  produto: row['Produto/Bitola'] || '',
  disponivel: row['Disponível'] || row['Disponivel'] || '',
  unidade: row['Unidade'] || '',
  precoBase: parseNum(row['Preço Base'] || row['Preco Base']),
  frete: parseNum(row['Frete']),
  precoTotal: parseNum(row['Preço Total'] || row['Preco Total']),
  condicao: row['Condição'] || row['Condicao'] || '',
  obs: row['Obs'] || '',
  atualizado: row['Atualizado'] || '',
});

const parsePisosProntos = (row) => ({
  id: `pp-${Math.random().toString(36).slice(2, 8)}`,
  fornecedor: row['Fornecedor'] || '',
  especie: row['Espécie'] || row['Especie'] || '',
  dimensoes: row['Dimensões'] || row['Dimensoes'] || '',
  m2Disp: row['M² Disp.'] || row['M2 Disp.'] || '',
  comprimentoPct: row['Comprimento %'] || '',
  unidade: row['Unidade'] || 'm²',
  precoVista: parseNum(row['Preço À Vista'] || row['Preco A Vista']),
  precoMedio: parseNum(row['Preço Ent+30/45/60'] || row['Preco Ent+30/45/60']),
  precoLongo: parseNum(row['Preço Ent+30/45/60/75/90'] || row['Preco Ent+30/45/60/75/90']),
  obs: row['Obs'] || '',
  atualizado: row['Atualizado'] || '',
});

const parseVendedores = (row) => ({
  id: row['ID'] || '',
  nome: row['Nome'] || '',
  tipo: row['Tipo'] || 'vendedor',
  regiao: row['Região'] || row['Regiao'] || '',
  margemPadrao: parseNum(row['Margem Padrão %'] || row['Margem Padrao %']) || 8,
  comissaoPadrao: parseNum(row['Comissão Padrão %'] || row['Comissao Padrao %']) || 5,
  catPadrao: (row['Categoria Padrão'] || row['Categoria Padrao'] || 'nativa').toLowerCase().includes('comp') ? 'compensados' : 'nativa',
});

export const loadAllData = async () => {
  const [nativaRaw, beneficiadaRaw, reflorestamentoRaw, pisosRaw, vendedoresRaw] = await Promise.all([
    fetchSheet(SHEET_NAMES.nativaBruta),
    fetchSheet(SHEET_NAMES.beneficiada),
    fetchSheet(SHEET_NAMES.reflorestamento),
    fetchSheet(SHEET_NAMES.pisosProntos),
    fetchSheet(SHEET_NAMES.vendedores),
  ]);

  return {
    nativa: nativaRaw.map(parseNativa).filter(r => r.fornecedor),
    beneficiada: beneficiadaRaw.map(parseBeneficiada).filter(r => r.fornecedor),
    reflorestamento: reflorestamentoRaw.map(parseReflorestamento).filter(r => r.fornecedor),
    pisosProntos: pisosRaw.map(parsePisosProntos).filter(r => r.fornecedor),
    vendedores: vendedoresRaw.map(parseVendedores).filter(r => r.id),
  };
};
