const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Lampiran hanya boleh PNG, JPG/JPEG, atau PDF.'));
    }
    cb(null, true);
  },
});

function canReadTicket(sessionUser, ticket) {
  return sessionUser.role === 'admin' || Number(ticket.user_id) === Number(sessionUser.id);
}

router.get('/my', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email AS user_email,
              COUNT(r.id)::int AS reply_count
       FROM tickets t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN ticket_replies r ON r.ticket_id = t.id
       WHERE t.user_id = $1
       GROUP BY t.id, u.name, u.email
       ORDER BY t.created_at DESC`,
      [req.session.user.id]
    );
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat tiket.' });
  }
});

router.post('/', requireAuth, upload.single('attachment'), async (req, res) => {
  try {
    if (req.session.user.role !== 'user') {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(403).json({ message: 'Tiket baru hanya dapat dibuat oleh User.' });
    }

    const category = String(req.body.category || '').trim();
    const subject = String(req.body.subject || '').trim();
    const description = String(req.body.description || '').trim();
    const priority = String(req.body.priority || 'Sedang').trim();

    if (!category || !subject || !description) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Kategori, judul, dan deskripsi wajib diisi.' });
    }

    if (!['Rendah', 'Sedang', 'Tinggi'].includes(priority)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Prioritas tiket tidak valid.' });
    }

    const ticketCode = `HLP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO tickets (ticket_code, user_id, category, subject, description, priority, status, attachment_path)
       VALUES ($1, $2, $3, $4, $5, $6, 'Menunggu', $7)
       RETURNING *`,
      [ticketCode, req.session.user.id, category, subject, description, priority, attachmentPath]
    );

    res.status(201).json({ message: 'Tiket berhasil dibuat.', ticket: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: 'Gagal membuat tiket.' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email AS user_email
       FROM tickets t
       JOIN users u ON u.id = t.user_id
       WHERE t.id = $1`,
      [req.params.id]
    );
    const ticket = result.rows[0];
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });
    if (!canReadTicket(req.session.user, ticket)) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke tiket ini.' });
    }

    const replies = await pool.query(
      `SELECT r.id, r.message, r.created_at, u.name, u.role
       FROM ticket_replies r
       JOIN users u ON u.id = r.user_id
       WHERE r.ticket_id = $1
       ORDER BY r.created_at ASC`,
      [ticket.id]
    );

    res.json({ ticket, replies: replies.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memuat detail tiket.' });
  }
});

router.post('/:id/replies', requireAuth, async (req, res) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong.' });

    const ticketResult = await pool.query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    const ticket = ticketResult.rows[0];
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });
    if (!canReadTicket(req.session.user, ticket)) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke tiket ini.' });
    }

    const result = await pool.query(
      `INSERT INTO ticket_replies (ticket_id, user_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [ticket.id, req.session.user.id, message]
    );

    res.status(201).json({ message: 'Tanggapan berhasil dikirim.', reply: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengirim tanggapan.' });
  }
});

module.exports = router;
