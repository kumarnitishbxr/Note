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



app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin.endsWith(".netlify.app")) cb(null, true);
    else cb(null, false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.options("*", cors());

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




