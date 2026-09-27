const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Email atau password tidak sesuai.' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: 'Login berhasil.',
      user: req.session.user,
      redirect: user.role === 'admin' ? '/admin' : '/user',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('helpdesk.sid');
    res.json({ message: 'Logout berhasil.' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session?.user) return res.status(401).json({ message: 'Belum login.' });
  res.json({ user: req.session.user });
});

module.exports = router;
