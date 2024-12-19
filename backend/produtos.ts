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
    { nome: 'Boi 1ª', descricao: '', precoAVista: 36, precoAPrazo: 40 },
    { nome: 'Salsicha', descricao: 'Perdigão', precoAVista: 18, precoAPrazo: 20 },
    { nome: 'Linguiça De Frango', descricao: 'Aurora', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'Linguiça Apimentada', descricao: 'Laredo', precoAVista: 25, precoAPrazo: 30 },
    { nome: 'Empanado', descricao: 'Perdigão', precoAVista: 3, precoAPrazo: 4 },
    { nome: 'Humburguer', descricao: 'Perdigão', precoAVista: 2.5, precoAPrazo: 3 },
    { nome: 'Queijo', descricao: '', precoAVista: 35, precoAPrazo: 38 },
    { nome: 'Frango Diário', descricao: '', precoAVista: 15, precoAPrazo: 20 },
    { nome: 'Corredor', descricao: '', precoAVista: 23, precoAPrazo: 25 },
    { nome: 'Fígado Puro', descricao: '', precoAVista: 22, precoAPrazo: 24 },
    { nome: 'Fígado Misturado', descricao: '', precoAVista: 20, precoAPrazo: 23 },
    { nome: 'Lingua de Boi', descricao: '', precoAVista: 20, precoAPrazo: 25 },
    { nome: 'Filé de Boi', descricao: '', precoAVista: 40, precoAPrazo: 45 },
    { nome: 'Picanha', descricao: '', precoAVista: 40, precoAPrazo: 45 },
    { nome: 'Carneiro', descricao: '', precoAVista: 25, precoAPrazo: 28 },
    { nome: 'Boi 2ª', descricao: '', precoAVista: 33, precoAPrazo: 35 },
    { nome: 'Boi 3ª', descricao: '', precoAVista: 30, precoAPrazo: 33 },
    { nome: 'Calabresa', descricao: 'Perdigão', precoAVista: 35, precoAPrazo: 38 },
    { nome: 'Calabresa', descricao: 'Seara', precoAVista: 33, precoAPrazo: 35 },
    { nome: 'Costela', descricao: 'Bovina', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'Linguiça De Porco', descricao: 'Aurora', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'Linguiça De Porco', descricao: 'Laredo', precoAVista: 22, precoAPrazo: 28 },
    { nome: 'Mortadela Frango', descricao: 'Perdigão', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Porco', descricao: 'Perdigão', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Frango', descricao: 'Confiança', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Mortadela Porco', descricao: 'Confiança', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Nata 250g', descricao: '', precoAVista: 6, precoAPrazo: 8 },
    { nome: 'Nata 500g', descricao: '', precoAVista: 10, precoAPrazo: 12 },
    { nome: 'Ovo', descricao: '', precoAVista: 12, precoAPrazo: 15 },
    { nome: 'Panelada', descricao: '', precoAVista: 22, precoAPrazo: 25 },
    { nome: 'Picadinho', descricao: '', precoAVista: 30, precoAPrazo: 33 },
    { nome: 'Porco Com Toicinho', descricao: '', precoAVista: 22, precoAPrazo: 24 },
    { nome: 'Porco sem Toicinho', descricao: '', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'Salsicha', descricao: 'Estrela', precoAVista: 14, precoAPrazo: 18 },
    { nome: 'Fígado de Porco', descricao: '', precoAVista: 15, precoAPrazo: 18 },
    { nome: 'Frangogo promocional (quarta feira)', descricao: '', precoAVista: 11.99, precoAPrazo: 16 },
    { nome: 'Costelinha com Toicinho', descricao: 'Suína', precoAVista: 24, precoAPrazo: 26 },
    { nome: 'Coxão Mole', descricao: 'Bovino', precoAVista: 38, precoAPrazo: 42 },
    { nome: 'Coxão Suino', descricao: 'Suino', precoAVista: 19.99, precoAPrazo: 23 },
    { nome: 'Tripa De Porco', descricao: '', precoAVista: 14.99, precoAPrazo: 17 },
    { nome: 'Bacon', descricao: 'Perdigão', precoAVista: 36, precoAPrazo: 38 },
    { nome: '1 Litro De Mel', descricao: 'Caseiro', precoAVista: 30, precoAPrazo: 35 },
    { nome: '1 Litro Manteiga Da Terra', descricao: 'Caseiro', precoAVista: 35, precoAPrazo: 40 },
    { nome: 'Costelinha Sem Toicinho', descricao: 'Suína', precoAVista: 25, precoAPrazo: 28 },
    { nome: 'Toicinho De Porco', descricao: '', precoAVista: 18, precoAPrazo: 20 },
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
