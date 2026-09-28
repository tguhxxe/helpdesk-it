import "./globals.css";

export const metadata = {
  title: { default: "Helpdesk IT — Pusat Bantuan IT", template: "%s — Helpdesk IT" },
  description:
    "Pusat bantuan IT untuk melaporkan kendala, memantau tiket, dan terhubung dengan tim IT Support.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
