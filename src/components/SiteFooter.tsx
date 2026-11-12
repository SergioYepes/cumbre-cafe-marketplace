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
              <div className="logo-block">
                <span className="logo-word">CUMBRE</span>
                <small className="logo-sub">Mercado de Café de Especialidad</small>
              </div>
            </Link>
            <p className="mt-2" style={{ color: "#e8dfd3", fontStyle: "italic", fontSize: ".86rem" }}>
              «Los mejores tostadores de Colombia, del origen a tu taza.»
            </p>
            <p className="mt-1" style={{ maxWidth: 330, fontSize: ".82rem", color: "#b5a694" }}>
              Comercio electrónico directo de café de especialidad colombiano. Tueste semanal certificado y despacho desde las fincas y tostadurías aliadas.
            </p>
          </div>
          <div>
            <h4>Departamentos</h4>
            <ul>
              <li><Link href="/cafes">Catálogo completo</Link></li>
              <li><Link href="/cafes?roast=LIGHT">Tueste Claro · Filtrados</Link></li>
              <li><Link href="/cafes?roast=MEDIUM">Tueste Medio · Balanceados</Link></li>
              <li><Link href="/cafes?roast=MEDIUM_DARK">Espresso y Moka</Link></li>
              <li><Link href="/suscripcion">Club de Suscripción (-15%)</Link></li>
            </ul>
          </div>
          <div>
            <h4>Sobre Cumbre</h4>
            <ul>
              <li><Link href="/#identidad">Identidad corporativa y logo</Link></li>
              <li><Link href="/#mision-vision">Misión y visión</Link></li>
              <li><Link href="/#galeria">Guía de tueste y extracción</Link></li>
              <li><Link href="/marcas">Tostadores verificados</Link></li>
              <li><Link href="/vender">Vender en Cumbre (B2B)</Link></li>
              <li><Link href="/documento-aca">Documento ACA (PDF)</Link></li>
            </ul>
          </div>
          <div>
            <h4>Servicio al Cliente</h4>
            <ul>
              <li>📍 Cra. 11 #82-71, Piso 4 — Bogotá D.C.</li>
              <li>✉️ hola@cumbrecafe.co</li>
              <li>📞 PBX: +57 (601) 742 8910</li>
              <li>💬 WhatsApp: +57 315 840 2219</li>
              <li>📸 @cumbrecafe.co (IG · TikTok · X)</li>
            </ul>
          </div>
        </div>
        <div className="footer-inner">
          <span>
            © 2026 Cumbre Mercado Cafetero S.A.S. · Todos los derechos reservados · Fotografías bajo licencia Unsplash e ilustraciones propias.
          </span>
          <div className="pay">
            <span>Wompi</span><span>PSE</span><span>Nequi</span><span>Bre-B</span><span>Visa / Mastercard</span><span>Contraentrega</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
