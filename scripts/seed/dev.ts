import db from '../../src/dbs'
import { nanoid } from 'nanoid'

const run = async () => {
  await db.post.createMany({
    data: [
      {
        id: nanoid(16),
        slug: 'ultimate-node-stack',
        title: 'Ultimate Node Stack 2023',
        publishedAt: new Date()
      },
      {
        id: nanoid(16),
        slug: 'draft-post',
        title: 'Draft Post'
      }
    ]
  })
}

// Auto-run if main script (not imported)
if (require.main === module) {
  run().then(() => {
    console.log('Data seed complete')
    process.exit()
  })
}
