import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()

  // // all data
  // const data = await prisma.vaccineEvent.findMany()
  // console.log(data)

  // // by state
  // const data = await prisma.vaccineEvent.groupBy({
  //   by: ['state'],
  //   sum: {
  //     vaccinationsCumulative: true,
  //   },
  // })
  // console.log(data)

  // // only berlin
  const data = await prisma.vaccineEvent.groupBy({
    by: ['state'],
    where: {
      state: 'Berlin',
    },
  })
  // data[0].vaccinationsDueToAge
  console.log(data)

  prisma.$disconnect()
}

main()
