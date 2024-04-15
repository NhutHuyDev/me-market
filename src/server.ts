import express from 'express'
import morgan from 'morgan'
import db from './dbs'

const app = express()
app.use(morgan('dev'))

app.get('/', async (req, res) => {
  const posts = await db.post.findMany()
  res.send(`posts: ${JSON.stringify(posts)}`)
})

const port = Number(process.env.PORT ?? 8080)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`)
})
