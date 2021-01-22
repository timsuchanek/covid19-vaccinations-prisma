import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const DELIMITER = ','

const deserializers: Record<string, (x: any) => any> = {
  date: (val) => {
    let [year, month, day] = val.split('-')
    if (month[0] === '0') {
      month = month.slice(1)
    }
    return new Date(
      Number(year),
      Number(month),
      Number(day),
      0,
      0,
      0,
      0,
    ).toISOString()
  },
  vaccinationsCumulative: Number,
  deltaToPreviousDay: Number,
  vaccinationsPerMille: Number,
  vaccinationsDueToAge: Number,
  vaccinationsDueToProfession: Number,
  vaccinationsDueToMedicalReasons: Number,
  vaccinationsToNursingHomeResidents: Number,
}

async function importData() {
  const file = fs.readFileSync(path.join(__dirname, './data.csv'), 'utf-8')
  const [head, ...lines] = file.trim().split('\n')
  const columns = head.split(DELIMITER)
  const data = lines.map((line) => {
    const result = Object.create(null)
    const date = line.split(DELIMITER)
    if (date && date.length > 1) {
      for (let i = 0; i < date.length; i++) {
        const column = columns[i]
        const deserializer = deserializers[column] || String
        result[column] = deserializer(date[i])
      }
    }
    return result
  })
  const prisma = new PrismaClient()
  await prisma.vaccineEvent.deleteMany()
  await Promise.all(
    data.map((d) =>
      prisma.vaccineEvent.create({
        data: d,
      }),
    ),
  )
  await prisma.$disconnect()
}

importData()
