"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email:    form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Credenciales incorrectas");
    }
  }

  async function handleGuest() {
    setError("");
    setGuestLoading(true);
    const result = await signIn("guest", { redirect: false });
    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setGuestLoading(false);
      setError("No se pudo iniciar la demo");
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(20% 0.08 285 / 0.4), transparent)",
        }}
      />

      <div
        className="relative w-full max-w-sm animate-fade-up"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
        }}
      >
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <span
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            Sumaq Studios
          </span>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--color-foreground)",
              marginTop: "0.25rem",
            }}
          >
            Dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              style={{
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                color: "var(--color-foreground)",
                fontSize: "var(--text-sm)",
                padding: "0.625rem 0.875rem",
                outline: "none",
                transition: `border-color var(--dur-fast) var(--ease-out-quart)`,
              }}
              onFocus={e => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              style={{
                background: "var(--color-background)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
                color: "var(--color-foreground)",
                fontSize: "var(--text-sm)",
                padding: "0.625rem 0.875rem",
                outline: "none",
                transition: `border-color var(--dur-fast) var(--ease-out-quart)`,
              }}
              onFocus={e => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {error && (
            <p
              role="alert"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-destructive)",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              padding: "0.75rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: `opacity var(--dur-fast) var(--ease-out-quart), background var(--dur-fast) var(--ease-out-quart)`,
            }}
            onMouseEnter={e => {
              if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-accent-hover)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-accent)";
            }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        {/* Acceso de demostración */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "1.5rem 0",
          }}
        >
          <span style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>o</span>
          <span style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        </div>

        <button
          type="button"
          onClick={handleGuest}
          disabled={guestLoading}
          style={{
            width: "100%",
            background: "transparent",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            padding: "0.75rem",
            cursor: guestLoading ? "not-allowed" : "pointer",
            opacity: guestLoading ? 0.7 : 1,
            transition: `border-color var(--dur-fast) var(--ease-out-quart), background var(--dur-fast) var(--ease-out-quart)`,
          }}
          onMouseEnter={e => {
            if (!guestLoading) (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
          }}
        >
          {guestLoading ? "Abriendo demo…" : "Explorar demo como invitado"}
        </button>

        <p
          style={{
            marginTop: "0.875rem",
            fontSize: "var(--text-xs)",
            color: "var(--color-muted)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Acceso completo a una demo con datos de ejemplo. Nada se guarda.
        </p>
      </div>
    </div>
  );
}
