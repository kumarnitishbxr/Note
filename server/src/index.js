// import express from 'express'
// import dotenv from 'dotenv'
// dotenv.config();
// import cookieParser from 'cookie-parser'
// import authRouter from './routes/AuthRoutes.js'
// import noteRouter from './routes/NoteRoute.js';
// import main from './config/db.js';
// import redisClient from './config/redis.js';
// import cors from 'cors'
// const app = express();


// app.use(cors({
//    origin: 'http://localhost:5173',
//    credentials: true
// }))

// app.use(express.json())
// app.use(cookieParser())


// app.use('/api/auth', authRouter)
// app.use("/notes", noteRouter);



// const InitializeConnection = async ()=>{

//     try {

//         await Promise.all([main(), redisClient.connect()])
//         console.log('DB connected successfully.')
       

//         app.listen(process.env.PORT, ()=>{
//             console.log('Listening at PORT', process.env.PORT)
//         })
        
//     } catch (error) {

//         console.log(error.message)
//     }
// }


// InitializeConnection()






import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/AuthRoutes.js';
import noteRouter from './routes/NoteRoute.js';
import main from './config/db.js';
import redisClient from './config/redis.js';

dotenv.config();

const app = express();

/* =========================
   CORS CONFIG (IMPORTANT)
========================= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',                 // local
      'https://your-site-name.netlify.app'     // production
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRouter);
app.use('/notes', noteRouter);

/* =========================
   HEALTH CHECK (IMPORTANT)
========================= */
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

/* =========================
   SERVER INIT
========================= */
const PORT = process.env.PORT || 5000;

const InitializeConnection = async () => {
  try {
    await main();

    // Redis optional safeguard
    if (redisClient) {
      await redisClient.connect();
      console.log('Redis connected');
    }

    console.log('DB connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
};

InitializeConnection();
