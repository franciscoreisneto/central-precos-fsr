export const SHEETS_ID = '1hdSXJYd1D7pZ1CaFhVTPrzjn-Hf6yiLgaYdhoua7Usw';

export const SHEET_NAMES = {
  nativaBruta: 'Nativa Bruta',
  beneficiada: 'Beneficiada',
  compensados: 'Compensados',
  reflorestamento: 'Reflorestamento',
  portas: 'Portas',
  pisosProntos: 'Piso Pronto',
  vendedores: 'Vendedores',
};

export const ROBERTO_EMAIL = 'roberto@fsilvareis.com.br';

export const EMPRESA = {
  nome: 'F. Silva Reis',
  razaoSocial: 'F. Silva Reis Representações Ltda',
  site: 'www.fsilvareis.com.br',
  instagram: '@f.silvareis',
  telefone: '(21) XXXX-XXXX',
  email: 'contato@fsilvareis.com.br',
  endereco: 'Rio de Janeiro — RJ',
};

export const PERFIS = [
  { id: 'admin', nome: 'Admin', tipo: 'admin', icon: '👑', desc: 'Visão completa com custos', margemPadrao: 0, catPadrao: 'nativa' },
  { id: 'rj', nome: 'RJ', tipo: 'vendedor', icon: '🏙️', desc: 'Vendedores Rio de Janeiro', margemPadrao: 8, catPadrao: 'nativa' },
  { id: 'sp', nome: 'SP', tipo: 'vendedor', icon: '🏗️', desc: 'Vendedores São Paulo', margemPadrao: 10, catPadrao: 'nativa' },
  { id: 'matcon', nome: 'MATCON', tipo: 'vendedor', icon: '🧱', desc: 'Materiais de Construção', margemPadrao: 8, catPadrao: 'nativa' },
  { id: 'marcenaria', nome: 'MARCENARIA', tipo: 'vendedor', icon: '🪚', desc: 'Marcenaria e Compensados', margemPadrao: 10, catPadrao: 'compensados' },
];

export const CATEGORIAS = [
  { id: 'nativa', nome: 'Nativa Bruta', icon: '🌳', cor: '#2D5016', sheet: 'nativaBruta' },
  { id: 'beneficiada', nome: 'Beneficiada', icon: '🪵', cor: '#6B4226', sheet: 'beneficiada' },
  { id: 'compensados', nome: 'Compensados', icon: '📦', cor: '#8B6914', sheet: 'compensados' },
  { id: 'reflorestamento', nome: 'Reflor.', icon: '🌲', cor: '#4A7C2E', sheet: 'reflorestamento' },
  { id: 'portas', nome: 'Portas', icon: '🚪', cor: '#6B3A2A', sheet: 'portas' },
  { id: 'pisopronto', nome: 'Piso Pronto', icon: '🏠', cor: '#5A4A38', sheet: 'pisosProntos' },
];

export const CONDICOES = [
  'À vista', '15 dias', '30 dias', '30/60', '30/60/90',
  '28 DDL', 'Antecipado', 'A combinar',
  'Ent+30/45/60', 'Ent+30/45/60/75/90',
];
