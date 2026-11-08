"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart/CartProvider";
import { BagIcon, CloseIcon, CumbreLogo, MenuIcon, UserIcon } from "./Icons";

type HeaderUser = { name: string; email: string; role: "CUSTOMER" | "BRAND" | "ADMIN" } | null;

const LINKS = [
  { href: "/cafes", label: "Cafés" },
  { href: "/marcas", label: "Marcas" },
  { href: "/suscripcion", label: "Suscripción" },
  { href: "/#identidad", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/vender", label: "Vende con nosotros" },
];

export default function SiteHeader({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready, openDrawer } = useCart();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo" id="logo-link">
          <CumbreLogo size={36} />
          <span className="logo-word">Cumbre<span className="logo-dot">.</span></span>
        </Link>
        <nav className={`nav ${open ? "open" : ""}`} aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={!l.href.includes("#") && pathname.startsWith(l.href) ? "active" : ""} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-btn" id="cart-btn" aria-label="Abrir carrito" onClick={openDrawer}>
            <BagIcon />
            {ready && count > 0 && <span className="cart-badge" key={count}>{count}</span>}
          </button>
          {user ? (
            <details className="user-menu">
              <summary className="avatar" id="user-menu-btn" aria-label="Menú de usuario">
                {user.name[0]?.toUpperCase()}
              </summary>
              <div className="dropdown">
                <div className="who">
                  <strong>{user.name}</strong>
                  <span className="meta">{user.email}</span>
                </div>
                <Link href="/cuenta">Mi cuenta</Link>
                <Link href="/cuenta/pedidos">Mis pedidos</Link>
                <Link href="/cuenta/suscripciones">Suscripciones</Link>
                {user.role === "BRAND" && <Link href="/marca">Portal de marca</Link>}
                {user.role === "ADMIN" && <Link href="/admin">Administración</Link>}
                <button onClick={logout} id="logout-btn">Cerrar sesión</button>
              </div>
            </details>
          ) : (
            <Link href={`/ingresar?next=${encodeURIComponent(pathname)}`} id="login-btn" className="icon-btn" aria-label="Ingresar">
              <UserIcon />
            </Link>
          )}
          <button className="icon-btn mobile-toggle" aria-label="Menú" onClick={() => setOpen((o) => !o)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
