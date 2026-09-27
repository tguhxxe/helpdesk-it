INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Demo User', 'user@helpdesk.local', crypt('user123', gen_salt('bf')), 'user'),
  ('Admin IT Support', 'admin@helpdesk.local', crypt('admin123', gen_salt('bf')), 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tickets (ticket_code, user_id, category, subject, description, priority, status)
SELECT
  'HLP-DEMO-001',
  u.id,
  'Jaringan',
  'Wi-Fi kantor tidak dapat terhubung',
  'Laptop sudah tersambung ke SSID kantor tetapi internet tidak dapat digunakan. Sudah dicoba reconnect dan restart.',
  'Tinggi',
  'Diproses'
FROM users u
WHERE u.email = 'user@helpdesk.local'
  AND NOT EXISTS (SELECT 1 FROM tickets WHERE ticket_code = 'HLP-DEMO-001');

INSERT INTO ticket_replies (ticket_id, user_id, message)
SELECT t.id, a.id, 'Tiket sudah diterima. Kami sedang memeriksa konfigurasi jaringan dan access point.'
FROM tickets t
JOIN users a ON a.email = 'admin@helpdesk.local'
WHERE t.ticket_code = 'HLP-DEMO-001'
  AND NOT EXISTS (
    SELECT 1 FROM ticket_replies r WHERE r.ticket_id = t.id
  );
