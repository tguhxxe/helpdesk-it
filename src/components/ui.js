"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import {
  AlertCircle,
  ArrowUp,
  Check,
  Circle,
  CircleCheck,
  Clock3,
  Headphones,
  Loader2,
  Minus,
  X,
} from "lucide-react";

export function Brand({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}
      >
        <Headphones size={20} strokeWidth={1.7} />
      </span>
      <span
        className={`text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        Helpdesk
        <span className={dark ? "text-zinc-400" : "text-zinc-400"}> IT</span>
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  busy = false,
  disabled,
  ...props
}) {
  const style =
    variant === "primary"
      ? "border-ink bg-ink text-white hover:bg-zinc-700"
      : variant === "ghost"
        ? "border-transparent bg-transparent text-zinc-500 hover:bg-zinc-100 hover:text-ink"
        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50";
  return (
    <button
      disabled={disabled || busy}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${style} ${className}`}
      {...props}
    >
      {busy && (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export function Notice({ children, success = false }) {
  if (!children) return null;
  const Icon = success ? Check : AlertCircle;
  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    Menunggu: "border-amber-200/70 bg-amber-50 text-amber-800",
    Diproses: "border-blue-200/70 bg-blue-50 text-blue-700",
    Selesai: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
  };
  const Icon =
    status === "Selesai"
      ? CircleCheck
      : status === "Diproses"
        ? Circle
        : Clock3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-sm ${styles[status] || "border-zinc-200 text-zinc-600"}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export function Priority({ value }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm ${value === "Tinggi" ? "text-red-700" : "text-zinc-500"}`}
    >
      {value === "Tinggi" ? <ArrowUp size={14} /> : <Minus size={14} />}
      {value}
    </span>
  );
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  drawer = false,
}) {
  const returnFocus = useRef(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-[2px]" />
        <Dialog.Content
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement;
          }}
          onCloseAutoFocus={(event) => {
            if (returnFocus.current?.isConnected) {
              event.preventDefault();
              returnFocus.current.focus();
            }
          }}
          className={`fixed z-50 flex flex-col bg-white shadow-2xl focus:outline-none ${drawer ? "inset-y-0 right-0 w-full max-w-[620px]" : "left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl"}`}
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 px-6 py-5">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-tight">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-zinc-500">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Tutup panel"
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-ink"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Loading({ label = "Memuat..." }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 py-20 text-sm text-zinc-500"
    >
      <Loader2 size={18} className="animate-spin" />
      {label}
    </div>
  );
}
