import createApp from './app.js'

const server = createApp();
const port = process.env.PORT || 3000

server.listen(3000, () => {
    console.log(`I'm express and I'm listening on port ${port}`)
})