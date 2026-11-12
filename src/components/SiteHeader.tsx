"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart/CartProvider";
import { BagIcon, CloseIcon, CumbreLogo, MenuIcon, SearchIcon, UserIcon } from "./Icons";

type HeaderUser = { name: string; email: string; role: "CUSTOMER" | "BRAND" | "ADMIN" } | null;

const CATEGORIES = [
  { href: "/cafes", label: "Tienda · Todos los cafés" },
  { href: "/cafes?roast=LIGHT", label: "Tueste Claro (Filtrados)" },
  { href: "/cafes?roast=MEDIUM", label: "Tueste Medio" },
  { href: "/cafes?roast=MEDIUM_DARK", label: "Espresso y Moka" },
  { href: "/marcas", label: "Marcas Tostadoras" },
  { href: "/suscripcion", label: "Suscripción (-15%)" },
  { href: "/#identidad", label: "Nosotros (Misión y Visión)" },
  { href: "/#contacto", label: "Atención al Cliente" },
  { href: "/vender", label: "Vender en Cumbre" },
];

export default function SiteHeader({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready, openDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cafes?q=${encodeURIComponent(q)}` : "/cafes");
    setOpen(false);
  }

  return (
    <header className="header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>🚚 <strong>Envío GRATIS</strong> desde $90.000 COP a toda Colombia · Despacho directo de tostaduría en 24–48 h</span>
          <div className="topbar-links">
            <Link href="/#identidad">Quiénes somos</Link>
            <span>·</span>
            <Link href="/#contacto">Ayuda y soporte</Link>
            <span>·</span>
            <Link href="/vender">Portal de tostadores</Link>
          </div>
        </div>
      </div>

      <div className="container header-inner">
        <Link href="/" className="logo" id="logo-link">
          <CumbreLogo size={38} />
          <div className="logo-block">
            <span className="logo-word">CUMBRE</span>
            <small className="logo-sub">Mercado de Café de Especialidad</small>
          </div>
        </Link>

        <form className="header-search" onSubmit={handleSearch} role="search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Buscar café por origen (Huila, Nariño), marca, proceso o nota..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar productos en la tienda"
          />
          <button type="submit" className="header-search-btn">
            Buscar
          </button>
        </form>

        <div className="header-actions">
          {user ? (
            <details className="user-menu">
              <summary className="header-action-link" id="user-menu-btn" aria-label="Menú de usuario">
                <UserIcon />
                <div className="action-text">
                  <small>Hola, {user.name.split(" ")[0]}</small>
                  <strong>Mi cuenta</strong>
                </div>
              </summary>
              <div className="dropdown">
                <div className="who">
                  <strong>{user.name}</strong>
                  <span className="meta">{user.email}</span>
                </div>
                <Link href="/cuenta">Resumen de cuenta</Link>
                <Link href="/cuenta/pedidos">Mis pedidos</Link>
                <Link href="/cuenta/suscripciones">Mis suscripciones</Link>
                {user.role === "BRAND" && <Link href="/marca">Portal de marca</Link>}
                {user.role === "ADMIN" && <Link href="/admin">Administración</Link>}
                <button onClick={logout} id="logout-btn">Cerrar sesión</button>
              </div>
            </details>
          ) : (
            <Link href={`/ingresar?next=${encodeURIComponent(pathname)}`} id="login-btn" className="header-action-link" aria-label="Ingresar">
              <UserIcon />
              <div className="action-text">
                <small>Bienvenido</small>
                <strong>Ingresar / Cuenta</strong>
              </div>
            </Link>
          )}

          <button className="cart-trigger" id="cart-btn" aria-label="Abrir carrito" onClick={openDrawer}>
            <BagIcon />
            <div className="action-text">
              <small>Tu compra</small>
              <strong>Carrito ({ready ? count : 0})</strong>
            </div>
          </button>

          <button className="icon-btn mobile-toggle" aria-label="Menú" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className="catbar">
        <div className="container">
          <nav className={`nav ${open ? "open" : ""}`} aria-label="Categorías de tienda">
            {CATEGORIES.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
