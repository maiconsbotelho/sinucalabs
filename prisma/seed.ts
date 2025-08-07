import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const players = [
  'Maicão Marreta',
  'Johnny do Boteco',
  'Dief o Filosofo',
  'Osi o Sábio',
  'Henrique Sai da Frente',
  'Bryan o Estagiário',
  'Alison Parsa',
  'Cesar o Profissional',
  'Juan do Basquete'
]

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Criar jogadores
  for (const playerName of players) {
    await prisma.player.upsert({
      where: { name: playerName },
      update: {},
      create: {
        name: playerName,
      },
    })
  }
  
  console.log('✅ Seed concluído! Jogadores criados:')
  const allPlayers = await prisma.player.findMany()
  console.log(allPlayers.map(p => p.name).join(', '))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })