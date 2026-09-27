require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'helpdesk.sid',
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use((error, _req, res, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Ukuran lampiran maksimal 5 MB.' });
  }
  if (error?.message?.startsWith('Lampiran hanya boleh')) {
    return res.status(400).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

app.listen(PORT, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`Helpdesk IT berjalan di http://localhost:${PORT}`);
    console.log('PostgreSQL: terhubung');
  } catch (error) {
    console.log(`Helpdesk IT berjalan di http://localhost:${PORT}`);
    console.error('PostgreSQL belum terhubung. Periksa .env / Docker PostgreSQL.');
  }
});
