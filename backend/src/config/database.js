import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Terhubung ke MySQL database');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Error koneksi database:', error.message);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool belum diinisialisasi');
  }
  return pool;
};

export default pool;
