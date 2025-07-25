import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI;

class DBconnection {
    static async connect() {
        try {
            const conn = await mongoose.connect(URI);
            console.log('Database connected successfully');
            return conn;
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }
}

export default DBconnection;
