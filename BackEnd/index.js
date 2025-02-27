import express from 'express';
import { connectDB } from './db/connectDB.js'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'; 
import auth from './routes/auth.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(express.json());//allows us to parse incoming request with JSON payloads
app.use(cookieParser());//allows us to parse incoming cookies

// Route middleware
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Listening on port ${port}`);
});
