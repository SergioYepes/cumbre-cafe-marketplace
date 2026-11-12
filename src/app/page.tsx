import Link from "next/link";
import Catalog from "@/components/Catalog";
import ContactForm from "@/components/ContactForm";
import { CumbreLogo } from "@/components/Icons";
import { type ProductItem } from "@/components/ProductCard";
import { listBrands, listProducts } from "@/server/services/catalog";
import { demoBrands } from "@/lib/demo-data";

const BREW_CATEGORIES = [
  {
    title: "Filtrados · V60 y Chemex",
    subtitle: "Tueste claro · Alta acidez floral y frutal",
    href: "/cafes?roast=LIGHT",
    badge: "3 lotes disponibles",
  },
  {
    title: "Balanceados · Taza diaria",
    subtitle: "Tueste medio · Notas a panela, cacao y cítricos",
    href: "/cafes?roast=MEDIUM",
    badge: "2 lotes disponibles",
  },
  {
    title: "Espresso y Moka Italiana",
    subtitle: "Tueste medio-oscuro · Cuerpo denso y chocolate",
    href: "/cafes?roast=MEDIUM_DARK",
    badge: "Especial para máquina",
  },
  {
    title: "Microlotes de Competencia",
    subtitle: "Puntaje SCA 87–90 pts · Geisha, Sidra y Pink Bourbon",
    href: "/cafes?sort=rating",
    badge: "Edición limitada",
  },
];

const GALLERY_ITEMS = [
  {
    src: "/images/hero.png",
    alt: "Taza de café de especialidad colombiano rodeada de granos recién tostados",
    tag: "Control de Calidad · SCA 84–90",
    title: "Catación y extracción en origen",
    description:
      "Cada lote publicado en Cumbre es catado bajo protocolo SCA antes de salir de la tostaduría, garantizando ausencia de defectos y trazabilidad por vereda.",
    source: "Fuente: Fotografía de producto Cumbre (2026) — Libre de derechos.",
  },
  {
    src: "/images/products/light.jpg",
    alt: "Café de tueste claro para métodos de filtrado como V60 y Chemex",
    tag: "Perfil 01 · Tueste Claro",
    title: "Filtrados: V60, Chemex y Aeropress",
    description:
      "Desarrollo corto que preserva los ácidos orgánicos y aromas enzimáticos: jazmín, bergamota, té negro y durazno en cafés de Huila y Quindío.",
    source: "Fuente: Fotografía por Unsplash (Licencia libre Unsplash).",
  },
  {
    src: "/images/products/medium.jpg",
    alt: "Granos de café de tueste medio con balance entre dulzura y cuerpo",
    tag: "Perfil 02 · Tueste Medio",
    title: "Métodos versátiles: Prensa y Goteo",
    description:
      "Caramelización equilibrada de azúcares naturales. Destaca notas de panela, mandarina dulce y cacao fino en lotes de Nariño y Santander.",
    source: "Fuente: Fotografía por Unsplash (Licencia libre Unsplash).",
  },
  {
    src: "/images/products/dark.jpg",
    alt: "Café de tueste medio-oscuro ideal para máquina de espresso y moka",
    tag: "Perfil 03 · Tueste Medio-Oscuro",
    title: "Presión: Espresso y Moka Italiana",
    description:
      "Mayor solubilidad y cuerpo sedoso para extracciones cortas. Resalta chocolate amargo, avellana tostada y caramelo en cafés del Cauca.",
    source: "Fuente: Fotografía por Unsplash (Licencia libre Unsplash).",
  },
];

export default async function Home() {
  let products: ProductItem[] = [];
  try {
    const res = await listProducts({ page: 1, pageSize: 24 });
    products = res.items;
  } catch (err) {
    console.error("Error cargando productos de catálogo:", err);
  }

  let brands: { id: string; name: string; slug: string; city: string; story: string | null; _count?: { products: number } }[] = [];
  try {
    brands = await listBrands();
  } catch (err) {
    console.error("Error cargando marcas:", err);
  }

  return (
    <main>
      {/* ───────── Banner Comercial Principal (E-Commerce Split Hero) ───────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-kicker">
                <span className="kicker-pill">COSECHA FRESCA 2026</span>
                <span>Tueste semanal directo de origen · Colombia</span>
              </div>
              <h1>
                Café de especialidad recién tostado, directo de las mejores tostadurías del país.
              </h1>
              <p className="hero-slogan">
                «Los mejores tostadores de Colombia, del origen a tu taza.»
              </p>
              <p className="hero-lead">
                Compra café en grano o molido a la medida de tu cafetera. Sin intermediarios ni meses en estantería: cada bolsa se empaca días antes de llegar a tu casa.
              </p>
              <div className="hero-cta">
                <a href="#catalogo" id="cta-shop" className="btn btn-primary">
                  Comprar cafés ahora →
                </a>
                <Link href="/suscripcion" id="cta-sub" className="btn btn-ghost">
                  Suscripción mensual (-15%)
                </Link>
              </div>

              <div className="trust-bar">
                <div className="trust-item">
                  <strong>24 – 48 h</strong>
                  <span>Despacho desde tostaduría</span>
                </div>
                <div className="trust-item">
                  <strong>SCA 84 – 90</strong>
                  <span>Puntaje certificado en taza</span>
                </div>
                <div className="trust-item">
                  <strong>5 moliendas</strong>
                  <span>Grano, V60, Espresso, Prensa, Moka</span>
                </div>
                <div className="trust-item">
                  <strong>Pago seguro</strong>
                  <span>PSE, Nequi, Tarjeta y Contraentrega</span>
                </div>
              </div>
            </div>

            {/* Tarjeta de Lote Destacado de la Semana */}
            <aside className="hero-spotlight" aria-label="Lote destacado de la semana">
              <div className="spotlight-top">
                <span className="spotlight-tag">★ LOTE DESTACADO DE LA SEMANA</span>
                <span className="spotlight-score">SCA 89 pts</span>
              </div>
              <div className="spotlight-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/light.jpg"
                  alt="Geisha Washed — Finca Aurora, Pitalito Huila"
                />
              </div>
              <div className="spotlight-body">
                <div className="row-flex between">
                  <span className="brand-name">FINCA AURORA · PITALITO, HUILA</span>
                  <span className="fresh">● Tostado hace 3 días</span>
                </div>
                <h2 style={{ fontSize: "1.45rem", margin: ".2rem 0" }}>
                  Geisha Washed — Vereda El Mirador
                </h2>
                <div className="spotlight-specs">
                  <div>
                    <small>PROCESO</small>
                    <strong>Lavado · 1.950 m</strong>
                  </div>
                  <div>
                    <small>NOTAS EN TAZA</small>
                    <strong>Jazmín, Bergamota, Durazno</strong>
                  </div>
                  <div>
                    <small>PRESENTACIÓN</small>
                    <strong>250 g · Grano / Molido</strong>
                  </div>
                </div>
                <div className="spotlight-foot">
                  <div>
                    <small className="meta" style={{ display: "block", fontSize: ".75rem" }}>Precio por bolsa (250 g)</small>
                    <strong className="price">$78.000 COP</strong>
                  </div>
                  <Link href="/cafes/geisha-washed-huila" className="btn btn-primary btn-sm">
                    Ver ficha y comprar →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ───────── Franja de Categorías por Método ───────── */}
      <section className="dept-strip">
        <div className="container">
          <div className="dept-grid">
            {BREW_CATEGORIES.map((cat) => (
              <Link href={cat.href} key={cat.title} className="dept-card">
                <span className="dept-badge">{cat.badge}</span>
                <h3>{cat.title}</h3>
                <p>{cat.subtitle}</p>
                <span className="dept-link">Explorar categoría →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Catálogo Principal de Tienda (#catalogo) ───────── */}
      <section className="section" id="catalogo">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Tienda Oficial · Envío Nacional</span>
              <h2>Cafés disponibles para despacho inmediato</h2>
              <p>Selecciona tu perfil de tueste o busca por departamento de origen, variedad o nota sensorial.</p>
            </div>
            <Link href="/cafes" className="btn btn-ghost btn-sm">
              Abrir catálogo avanzado con filtros →
            </Link>
          </div>
          <Catalog initialProducts={products} />
        </div>
      </section>

      {/* ───────── Guía Visual de Perfiles y Tueste (#galeria — ≥3 imágenes con fuente) ───────── */}
      <section className="section section-alt" id="galeria">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Guía del Comprador · Cultura Cafetera</span>
              <h2>Cómo elegir tu café según el tueste y método</h2>
              <p>
                Conoce el proceso detrás de cada bolsa y elige el perfil ideal para tu cafetera en casa.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {GALLERY_ITEMS.map((item) => (
              <article className="gallery-card" key={item.src}>
                <div className="gallery-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </div>
                <div className="gallery-body">
                  <span className="brand-name">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p className="meta">{item.description}</p>
                  <div className="gallery-source">{item.source}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Tostadurías y Marcas Oficiales (#marcas) ───────── */}
      <section className="section" id="marcas">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Tostadores Verificados</span>
              <h2>Tiendas oficiales en Cumbre</h2>
              <p>Trabajamos directamente con tostadurías en origen que cumplen con registro INVIMA y puntaje SCA superior a 84 puntos.</p>
            </div>
            <Link href="/marcas" className="btn btn-ghost btn-sm">
              Ver todas las marcas →
            </Link>
          </div>
          <div className="brands">
            {brands.length > 0
              ? brands.map((b) => (
                  <article className="brand-card" key={b.id || b.slug}>
                    <div className="row-flex between">
                      <div className="mark">{b.name[0]}</div>
                      <span className="tag tag-good">✓ Tostador verificado</span>
                    </div>
                    <h3>
                      <Link href={`/marcas/${b.slug}`}>{b.name}</Link>
                    </h3>
                    <span className="meta">📍 {b.city} · Despacho en 24–48 h</span>
                    <p>{b.story || "Lotes seleccionados de café de especialidad colombiano."}</p>
                    <div className="brand-card-foot">
                      <span className="meta" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                        {b._count?.products ?? 2} lotes en catálogo
                      </span>
                      <Link href={`/marcas/${b.slug}`} className="btn-link" style={{ fontSize: ".86rem" }}>
                        Visitar tienda →
                      </Link>
                    </div>
                  </article>
                ))
              : demoBrands.map((b) => (
                  <article className="brand-card" key={b.name}>
                    <div className="mark">{b.name[0]}</div>
                    <h3>{b.name}</h3>
                    <span className="meta">📍 {b.city}</span>
                    <p>{b.blurb}</p>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* ───────── Club de Suscripción y Portal B2B (#suscripcion / #vende) ───────── */}
      <section className="section section-alt" id="suscripcion">
        <div className="container">
          <div className="promo-split">
            <div className="promo-box promo-box-dark">
              <span className="eyebrow" style={{ background: "rgba(255,255,255,0.1)", color: "#FAF7F2", borderColor: "rgba(255,255,255,0.2)" }}>
                Club de Suscripción Cumbre
              </span>
              <h2 style={{ color: "#FAF7F2" }}>Recibe café recién tostado cada mes y ahorra 15%</h2>
              <p style={{ color: "#D5CBBF", margin: ".7rem 0 1.4rem" }}>
                Configura tu método de preparación, peso y frecuencia (semanal, quincenal o mensual). Sin cláusulas de permanencia.
              </p>
              <ul className="promo-list">
                <li>Rotación por microlotes exclusivos de Huila, Nariño, Quindío y Cauca</li>
                <li>Envío prioritario incluido desde el segundo paquete</li>
                <li>Pausa, cambia de molienda o cancela en un clic desde tu cuenta</li>
              </ul>
              <div className="mt-3">
                <Link href="/suscripcion" id="cta-subscribe" className="btn btn-primary">
                  Configurar mi suscripción →
                </Link>
              </div>
            </div>

            <div className="promo-box" id="vende">
              <span className="eyebrow">Comercio Directo · B2B</span>
              <h2>¿Tienes una finca o marca tostadora?</h2>
              <p className="meta" style={{ margin: ".7rem 0 1.4rem" }}>
                Abre tu tienda oficial en Cumbre: tú tuestas y despachas en origen, nosotros procesamos la pasarela de pagos y liquidamos quincenalmente.
              </p>
              <ul className="promo-list promo-list-light">
                <li>Panel de control para inventario, lotes, fechas de tueste y guías</li>
                <li>Posicionamiento patrocinado dentro del catálogo nacional</li>
                <li>Pagos integrados con Wompi, PSE, Nequi, Bre-B y tarjetas</li>
              </ul>
              <div className="mt-3">
                <Link href="/vender" id="cta-sell" className="btn btn-ghost">
                  Postular mi marca tostadora →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Identidad Corporativa: Marca, Logo, Eslogan, Misión y Visión (#identidad) ───────── */}
      <section className="section" id="identidad">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sobre Nuestra Empresa · Identidad Corporativa</span>
              <h2>Manifiesto e Identidad de Cumbre</h2>
              <p>
                Conoce el propósito, símbolo gráfico, misión y visión que respaldan nuestro mercado electrónico de café colombiano.
              </p>
            </div>
          </div>

          <div className="identity-banner">
            <div className="identity-logo-showcase">
              <CumbreLogo size={84} />
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", letterSpacing: "0.04em" }}>
                CUMBRE
              </strong>
              <span className="tag tag-muted">Logo Oficial Registrado</span>
            </div>
            <div>
              <span className="brand-name">NOMBRE DE LA MARCA Y CONCEPTO VISUAL</span>
              <h3 style={{ fontSize: "1.5rem", margin: ".25rem 0 .55rem" }}>
                Cumbre — Mercado Electrónico de Café de Especialidad Colombiano
              </h3>
              <p className="meta" style={{ fontSize: ".96rem", lineHeight: 1.68 }}>
                El isotipo oficial de <strong>Cumbre</strong> representa las <strong>tres cordilleras andinas de Colombia</strong> —donde se cultivan nuestros cafés de especialidad entre los 1.500 y 2.200 metros sobre el nivel del mar— coronadas por un <strong>grano de café naciente</strong> como símbolo de frescura y comercio justo directo desde la finca.
              </p>
              <div className="slogan-quote">
                <strong>Eslogan oficial:</strong> «Los mejores tostadores de Colombia, del origen a tu taza.»
              </div>
            </div>
          </div>

          <div className="mv-grid" id="mision-vision">
            <article className="mv-card">
              <div className="mv-header">
                <span className="mv-number">01</span>
                <span className="brand-name">PROPÓSITO ACTUAL</span>
              </div>
              <h3>Misión</h3>
              <p>
                Democratizar el acceso al café de especialidad colombiano conectando de manera directa, justa y transparente a pequeños caficultores y tostadores artesanales verificados con consumidores de todo el país, mediante una plataforma digital convergente que garantiza tueste fresco, trazabilidad de origen y comercio electrónico seguro.
              </p>
            </article>

            <article className="mv-card">
              <div className="mv-header">
                <span className="mv-number">02</span>
                <span className="brand-name">PROYECCIÓN 2030</span>
              </div>
              <h3>Visión</h3>
              <p>
                Consolidarnos para el año 2030 como el marketplace líder de café de especialidad en Latinoamérica, reconocido por impulsar el desarrollo sostenible de más de 200 marcas tostadoras y familias caficultoras colombianas, transformando la cultura de consumo local hacia un café ético, trazable y de excelencia sensorial.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ───────── Centro de Atención al Cliente y Contacto (#contacto) ───────── */}
      <section className="section section-alt" id="contacto">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Servicio al Cliente y Ventas Corporativas</span>
              <h2>Canales de contacto y atención</h2>
              <p>
                ¿Necesitas asesoría sobre molienda, estado de tu pedido o vinculación de tu tostaduría? Contáctanos.
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <div className="panel">
              <h3>Directorio de atención Cumbre</h3>
              <p className="meta mt-1">
                Sede administrativa, laboratorio de control de calidad y canales digitales:
              </p>
              <ul className="contact-list">
                <li className="contact-item">
                  <div className="contact-icon" aria-hidden>📍</div>
                  <div>
                    <strong>Oficina central y laboratorio de catación</strong>
                    <span>Carrera 11 #82-71, Piso 4 — Zona T, Bogotá D.C., Colombia</span>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon" aria-hidden>✉️</div>
                  <div>
                    <strong>Correos electrónicos de soporte y alianzas</strong>
                    <span>hola@cumbrecafe.co · tostadores@cumbrecafe.co</span>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon" aria-hidden>📞</div>
                  <div>
                    <strong>PBX Bogotá y Línea WhatsApp</strong>
                    <span>+57 (601) 742 8910 · WhatsApp: +57 315 840 2219</span>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon" aria-hidden>🕒</div>
                  <div>
                    <strong>Horario de atención y despachos</strong>
                    <span>Lunes a viernes: 8:00 a. m. – 6:00 p. m. · Sábados: 9:00 a. m. – 2:00 p. m.</span>
                  </div>
                </li>
                <li className="contact-item">
                  <div className="contact-icon" aria-hidden>🌐</div>
                  <div>
                    <strong>Redes sociales oficiales</strong>
                    <span>Instagram, TikTok y X: @cumbrecafe.co</span>
                  </div>
                </li>
              </ul>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
