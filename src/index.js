import connectdb from "./db/index.js"
import app from "./app.js"
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})

connectdb()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`App listening on port: ${process.env.PORT}`)
        })
    })
    .catch((error)=>{
    console.log("Error: ",error)
})

