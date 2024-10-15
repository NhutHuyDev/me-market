import app from './app'
import config from './config'

const PORT = config.app.port

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'))
})
