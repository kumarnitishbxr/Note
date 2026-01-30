import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser'
import authRouter from './routes/AuthRoutes.js'
import noteRouter from './routes/NoteRoute.js';
import main from './config/db.js';
import redisClient from './config/redis.js';
import cors from 'cors'
const app = express();



const allowedOrigins = [
  "https://notepadpro.netlify.app", // production URL
  "https://697cb3347995cb25de431347--heroic-salmiakki-d44f4a.netlify.app" // preview URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(cors({
//    origin: process.env.CLIENT_URL,
//    credentials: true
// }))

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use("/notes", noteRouter);



const InitializeConnection = async ()=>{

    try {

        await Promise.all([main(), redisClient.connect()])
        console.log('DB connected successfully.')
       

        app.listen(process.env.PORT, ()=>{
            console.log('Listening at PORT', process.env.PORT)
        })
        
    } catch (error) {

        console.log(error.message)
    }
}


InitializeConnection()




