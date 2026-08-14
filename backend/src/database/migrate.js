import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const runMigration = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('🔌 Terhubung ke MySQL server');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database ${process.env.DB_NAME} siap`);

    await connection.query(`USE \`${process.env.DB_NAME}\``);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Hapus comment baris (-- ...) lalu split by ;
    const cleaned = schema.replace(/--[^\n]*/g, '');
    const statements = cleaned
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('✅ Migration berhasil dijalankan');
    console.log('📋 Semua tabel telah dibuat');

  } catch (error) {
    console.error('❌ Error saat migration:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

runMigration()
  .then(() => {
    console.log('🎉 Migration selesai!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration gagal:', error);
    process.exit(1);
  });
