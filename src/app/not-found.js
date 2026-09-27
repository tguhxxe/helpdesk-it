import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 / Halaman tidak ditemukan</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Sepertinya Anda tersesat.
        </h1>
        <p className="mt-3 text-zinc-500">
          Halaman ini tidak tersedia atau sudah dipindahkan.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
