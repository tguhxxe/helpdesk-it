require("dotenv").config();

const dev = process.argv.includes("--dev");
process.env.NODE_ENV = dev ? "development" : "production";
const path = require("path");
const express = require("express");
const next = require("next");
const session = require("express-session");
const pool = require("./db");
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const nextApp = next({ dev, port: PORT });
const handle = nextApp.getRequestHandler();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "helpdesk.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 8 * 60 * 60 * 1000,
    },
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use((error, _req, res, _next) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Ukuran lampiran maksimal 5 MB." });
  }
  if (error?.message?.startsWith("Lampiran hanya boleh")) {
    return res.status(400).json({ message: error.message });
  }
  console.error(error);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

// Keep existing bookmarks working after the move from static pages to Next.js.
app.get("/index.html", (_req, res) => res.redirect(301, "/"));
app.get("/user.html", (_req, res) => res.redirect(301, "/user"));
app.get("/admin.html", (_req, res) => res.redirect(301, "/admin"));

app.use((req, res, nextMiddleware) => {
  const route = req.path.replace(/\/$/, "");
  if (route === "/admin" || route === "/user") {
    res.set("Cache-Control", "no-store");
    if (!req.session?.user) return res.redirect("/");
    const destination = req.session.user.role === "admin" ? "/admin" : "/user";
    if (route !== destination) return res.redirect(destination);
  }
  nextMiddleware();
});

nextApp
  .prepare()
  .then(() => {
    app.use((req, res) => handle(req, res));
    app.listen(PORT, async () => {
      console.log(`Helpdesk IT berjalan di http://localhost:${PORT}`);
      try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL: terhubung");
      } catch (error) {
        console.error(
          "PostgreSQL belum terhubung. Periksa .env / Docker PostgreSQL.",
        );
      }
    });
  })
  .catch((error) => {
    console.error("Gagal menjalankan Next.js:", error);
    process.exit(1);
  });
