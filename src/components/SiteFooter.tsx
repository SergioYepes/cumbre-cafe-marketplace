import Link from "next/link";
import { CumbreLogo } from "./Icons";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo">
              <CumbreLogo size={38} />
              <span className="logo-word">Cumbre<span className="logo-dot">.</span></span>
            </Link>
            <p className="mt-1 text-accent" style={{ fontSize: ".88rem", fontWeight: 500 }}>
              «Los mejores tostadores de Colombia, del origen a tu taza.»
            </p>
            <p className="mt-1" style={{ maxWidth: 320 }}>
              Marketplace de café de especialidad de tostadores colombianos verificados, tostado hace días y enviado directo a tu puerta.
            </p>
          </div>
          <div>
            <h4>Explorar</h4>
            <ul>
              <li><Link href="/cafes">Todos los cafés</Link></li>
              <li><Link href="/marcas">Nuestras marcas</Link></li>
              <li><Link href="/suscripcion">Suscripción</Link></li>
              <li><Link href="/vender">Vende en Cumbre</Link></li>
            </ul>
          </div>
          <div>
            <h4>Identidad</h4>
            <ul>
              <li><Link href="/#identidad">Nuestra marca y logo</Link></li>
              <li><Link href="/#mision-vision">Misión y visión</Link></li>
              <li><Link href="/#galeria">Galería del café</Link></li>
              <li><Link href="/#contacto">Contacto directo</Link></li>
              <li><Link href="/documento-aca">Documento ACA (PDF)</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>📍 Cra. 11 #82-71, Bogotá D.C., Colombia</li>
              <li>✉️ hola@cumbrecafe.co</li>
              <li>📞 +57 (601) 742 8910 · +57 315 840 2219</li>
              <li>📸 @cumbrecafe.co (IG · TikTok · X)</li>
            </ul>
          </div>
        </div>
        <div className="footer-inner">
          <span>
            © 2026 Cumbre · Proyecto Académico (ACA — Informática y Convergencia) · Fotografías bajo licencia libre (Unsplash) e ilustraciones propias.
          </span>
          <div className="pay">
            <span>Wompi</span><span>PSE</span><span>Nequi</span><span>Bre-B</span><span>Contraentrega</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
