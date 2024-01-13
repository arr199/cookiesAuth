import express  from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import  { v4 }  from "uuid"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const PORT = process?.env.PORT ?? 3200

const users = {}
const sessions = {}
app.use(cookieParser())
app.use(express.json())
app.use(cors({ credentials : true , origin : ["http://localhost:5173"] }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.post("/api/signUp" , async (req,res) => {
    const {  name , password   } = await req.body
    //  EMPTY DATA
    if (name.length === 0 || password.length === 0) {
        return  res.json({ error : "Empty credentials"  , users : Object.values(users) }).status(400)
    }
       // CHECK IF USER EXIST
    if (users[name]) {
        return res.status(400).json({ error : "User already exists"  , users : Object.values(users)})
    }

    const hashedPassword =  await bcrypt.hash(password, 10 )
    users[name] = ({ name , hashedPassword })

    return  res.json({ hashedPassword  , users : Object.values(users)   })
} )

app.post("/api/login" , async (req, res) => {
    const {  name , password } = req.body
    if (name.length === 0 || password.length === 0) {
        return  res.json({ error : "Empty credentials"  , users : Object.values(users) }).status(400)
    }
 
    const user = users[name]
    if (!user) {
        return res.json({ error : "User does not exist !!!"})
    }
 
    const validate = await bcrypt.compare(password , user.hashedPassword)
    console.log(validate)
    // SUCCESSFULLY LOGIN
    if (validate) {
      
      
      const sessionId = v4()
      sessions[sessionId] = { name }
      res.cookie("session", `${sessionId}` , { httpOnly : false , expires :  new Date(Date.now() + 1000000)  } )
      return res.json({ success : "ok" })
    }
    else {
        return res.json({ error : "Password does not match" })
    }

})

// Only authenticated users
app.get("/secret" , (req, res) => {
    const sessionId = req.cookies.session
    console.log(sessionId)
    if (sessions[sessionId]){
      
        res.sendFile(path.join(__dirname , "index.html"))
        return
    }
    else res.send("<h1>Loggin first please</h1>")
} )


app.listen(PORT , () => {
    console.log(`Listening in http://localhost:${PORT}`)
})

