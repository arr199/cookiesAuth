import express  from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import  { v4 }  from "uuid"


const app = express()
const PORT = process?.env.PORT ?? 3200

const passwords = {}
app.use(express.json())
app.use(cors({ credentials : true , origin : ["http://localhost:5173"] }))

app.post("/api/signUp" , async (req,res) => {
    const {  name , password   } = await req.body
    //  EMPTY DATA
    if (name.length === 0 || password.length === 0) {
        return  res.json({ error : "Empty credentials"  , users : Object.values(passwords) }).status(400)
    }
       // CHECK IF USER EXIST
    if (passwords[name]) {
        return res.status(400).json({ error : "User already exists"  , users : Object.values(passwords)})
    }

    const hashedPassword =  await bcrypt.hash(password, 10 )
    passwords[name] = ({ name , hashedPassword })

    return  res.json({ hashedPassword  , users : Object.values(passwords)   })

} )

app.post("/api/login" , async (req, res) => {
    const {  name , password } = req.body
    if (name.length === 0 || password.length === 0) {
        return  res.json({ error : "Empty credentials"  , users : Object.values(passwords) }).status(400)
    }
 
    const user = passwords[name]
    if (!user) {
        return res.json({ error : "User does not exist !!!"})
    }
 
    const validate = await bcrypt.compare(password , user.hashedPassword)
    console.log(validate)
    // SUCCESSFULLY LOGIN
    if (validate) {
      
      
      const sessionId = v4()
      passwords[name]["session"] = sessionId
      res.cookie("session", `${sessionId}` , { httpOnly : true } )
      return res.json({ success : "ok" })

        
    }else {
        return res.json({ error : "Password does not match" })
    }

})


app.listen(PORT , () => {
    console.log(`Listening in http://localhost:${PORT}`)
})

