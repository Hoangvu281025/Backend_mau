import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from "./routers/postRouters.js";
import categoryRoutes from "./routers/categoryRouters.js";
import uploadRoutes from "./routers/uploadRouters.js";
import authRoutes from "./routers/authRouters.js";
import userRoutes from "./routers/userRouters.js";
import bannerRoutes from "./routers/bannerRouters.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/banners', bannerRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

