import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import passport from "passport"
import expressSession from "express-session"
import { envVars } from "./app/config/env"
import "./app/config/passport"

const app = express()

app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cors({
  origin: envVars.FRONTEND_URL,
  credentials: true
}))
app.use(cookieParser())

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to PH Tour Management System")
})

app.use(globalErrorHandler)

app.use(notFound)

export default app