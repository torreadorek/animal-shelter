require('dotenv').config({path:'./config/.env'})
const app = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.PORT


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
}).on('error',(error)=>{
    if(error) console.log(`Cannot start listening on ${PORT}`)
})