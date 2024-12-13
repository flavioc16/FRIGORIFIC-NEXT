import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

// Função para capitalizar a primeira letra de cada palavra
function capitalizeWords(str: string) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function main() {
  const produtos = [
    { nome: 'boi 1ª', descricao: '', precoAVista: 36, precoAPrazo: 40 },
    { nome: 'salsicha', descricao: 'perdigão', precoAVista: 18, precoAPrazo: 20 },
    { nome: 'linguiça de frango', descricao: 'aurora', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'linguiça apimentada', descricao: 'laredo', precoAVista: 25, precoAPrazo: 30 },
    { nome: 'empanado', descricao: 'perdigão', precoAVista: 3, precoAPrazo: 4 },
    { nome: 'humburguer', descricao: 'perdigão', precoAVista: 2.5, precoAPrazo: 3 },
    { nome: 'queijo', descricao: '', precoAVista: 35, precoAPrazo: 38 },
    { nome: 'frango diário', descricao: '', precoAVista: 15, precoAPrazo: 20 },
    { nome: 'corredor', descricao: '', precoAVista: 23, precoAPrazo: 25 },
    { nome: 'figado puro', descricao: '', precoAVista: 22, precoAPrazo: 24 },
    { nome: 'figado misturado', descricao: '', precoAVista: 20, precoAPrazo: 23 },
    { nome: 'lingua de boi', descricao: '', precoAVista: 20, precoAPrazo: 25 },
    { nome: 'filé de boi', descricao: '', precoAVista: 40, precoAPrazo: 45 },
    { nome: 'picanha', descricao: '', precoAVista: 40, precoAPrazo: 45 },
    { nome: 'carneiro', descricao: '', precoAVista: 25, precoAPrazo: 28 },
    { nome: 'Boi 2ª', descricao: '', precoAVista: 33, precoAPrazo: 35 },
    { nome: 'Boi 3ª', descricao: '', precoAVista: 30, precoAPrazo: 33 },
    { nome: 'calabresa', descricao: 'Perdigão', precoAVista: 35, precoAPrazo: 38 },
    { nome: 'calabresa', descricao: 'seara', precoAVista: 33, precoAPrazo: 35 },
    { nome: 'costela', descricao: 'bovina', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'Linguiça De Porco', descricao: 'aurora', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'Linguiça De Porco', descricao: 'laredo', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'Mortadela Frango', descricao: 'Perdigão', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Porco', descricao: 'Perdigão', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Frango', descricao: 'confiança', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Porco', descricao: 'confiança', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Nata 250g', descricao: '', precoAVista: 6, precoAPrazo: 8 },
    { nome: 'Nata 500g', descricao: '', precoAVista: 10, precoAPrazo: 12 },
    { nome: 'Ovo', descricao: '', precoAVista: 12, precoAPrazo: 15 },
    { nome: 'Panelada', descricao: '', precoAVista: 22, precoAPrazo: 25 },
    { nome: 'Picadinho', descricao: '', precoAVista: 30, precoAPrazo: 33 },
    { nome: 'Porco Com Toicinho', descricao: '', precoAVista: 22, precoAPrazo: 24 },
    { nome: 'porco sem toicinho', descricao: '', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'Salsicha', descricao: 'estrela', precoAVista: 14, precoAPrazo: 18 },
    { nome: 'figado de porco', descricao: '', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Frango promocional (quarta feira)', descricao: '', precoAVista: 11.99, precoAPrazo: 16 },
    { nome: 'Costelinha com toicinho', descricao: 'suína', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'coxão mole', descricao: 'bovino', precoAVista: 38, precoAPrazo: 42 },
    { nome: 'coxão suíno', descricao: 'suino', precoAVista: 19.99, precoAPrazo: 23 },
    { nome: 'tripa de porco', descricao: '', precoAVista: 14.99, precoAPrazo: 17 },
    { nome: 'bacon', descricao: 'perdigão', precoAVista: 36, precoAPrazo: 38 },
    { nome: '1 litro de mel', descricao: 'caseiro', precoAVista: 30, precoAPrazo: 35 },
    { nome: '1 litro manteiga da terra', descricao: 'caseiro', precoAVista: 35, precoAPrazo: 40 },
    { nome: 'Costelinha sem Toicinho', descricao: 'suína', precoAVista: 25, precoAPrazo: 28 },
    { nome: 'toicinho de porco', descricao: '', precoAVista: 18, precoAPrazo: 20 },
  ]

  // Capitalizando a primeira letra de cada palavra do nome e da descrição
  const produtosCapitalizados = produtos.map(produto => ({
    nome: capitalizeWords(produto.nome),
    descricao: capitalizeWords(produto.descricao),
    precoAVista: produto.precoAVista,
    precoAPrazo: produto.precoAPrazo
  }))

  // Inserindo os produtos no banco de dados
  for (const produto of produtosCapitalizados) {
    await prisma.produto.create({
      data: produto,
    })
  }

  console.log("Produtos inseridos com sucesso!")
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
