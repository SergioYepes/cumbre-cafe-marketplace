import Link from "next/link";
import Catalog from "@/components/Catalog";
import ContactForm from "@/components/ContactForm";
import { CumbreLogo } from "@/components/Icons";
import { type ProductItem } from "@/components/ProductCard";
import { listBrands, listProducts } from "@/server/services/catalog";
import { demoBrands } from "@/lib/demo-data";

const GALLERY_ITEMS = [
  {
    src: "/images/hero.png",
    alt: "Taza de café de especialidad colombiano rodeada de granos recién tostados",
    tag: "Experiencia en taza",
    title: "Extracción y aroma de origen",
    description:
      "Cada lote conserva los aceites esenciales y notas florales, frutales o achocolatadas propias de las cordilleras colombianas.",
    source: "Ilustración digital propia para Cumbre (2026) — Libre de derechos.",
  },
  {
    src: "/images/products/light.jpg",
    alt: "Café de tueste claro para métodos de filtrado como V60 y Chemex",
    tag: "Tueste Claro · Filtrados",
    title: "Perfiles brillantes y florales",
    description:
      "Ideal para V60, Chemex y Aeropress. Resalta la acidez cítrica y las notas de jazmín, bergamota y frutas tropicales de microlotes del Huila y Quindío.",
    source: "Fotografía: Unsplash (Licencia libre Unsplash).",
  },
  {
    src: "/images/products/medium.jpg",
    alt: "Granos de café de tueste medio con balance entre dulzura y cuerpo",
    tag: "Tueste Medio · Balanceado",
    title: "Dulzura de panela y cacao",
    description:
      "Equilibrio entre acidez, dulzor residual y cuerpo sedoso. Destaca notas de caramelo, mandarina y miel características de Nariño y Santander.",
    source: "Fotografía: Unsplash (Licencia libre Unsplash).",
  },
  {
    src: "/images/products/dark.jpg",
    alt: "Café de tueste medio-oscuro ideal para máquina de espresso y moka",
    tag: "Tueste Medio-Oscuro · Espresso",
    title: "Cuerpo intenso y crema persistente",
    description:
      "Desarrollado para espresso, prensa francesa y moka italiana. Ofrece notas profundas de chocolate amargo, nuez tostada y especias dulces del Cauca.",
    source: "Fotografía: Unsplash (Licencia libre Unsplash).",
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

  const brandColors = ["#e0a458", "#c76b3a", "#d9c3a0", "#8fbf8a", "#8fb3d9"];

  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="eyebrow">Cumbre · Café de especialidad colombiano</span>
            <h1>
              Los mejores tostadores, <em>un solo lugar.</em>
            </h1>
            <blockquote className="slogan-quote">
              «Los mejores tostadores de Colombia, del origen a tu taza.»
            </blockquote>
            <p style={{ marginTop: ".6rem" }}>
              Descubre cafés de origen de marcas colombianas verificadas, tostados hace días y
              enviados directamente a tu puerta con trazabilidad total.
            </p>
            <div className="hero-cta">
              <a href="#catalogo" id="cta-shop" className="btn btn-primary">
                Explorar café →
              </a>
              <a href="#identidad" className="btn btn-ghost">
                Conocer nuestra identidad
              </a>
              <Link href="/suscripcion" id="cta-sub" className="btn btn-soft">
                Suscribirme
              </Link>
            </div>
            <div className="stats">
              <div>
                <strong>+40</strong>
                <span>Orígenes</span>
              </div>
              <div>
                <strong>48 h</strong>
                <span>Despacho máx.</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Tostado fresco</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="identidad">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Identidad Corporativa</span>
              <h2>Quiénes somos en Cumbre</h2>
              <p>
                Conectamos directamente a los caficultores y maestros tostadores de Colombia con los amantes del buen café.
              </p>
            </div>
          </div>

          <div className="identity-banner">
            <div className="identity-logo-showcase">
              <CumbreLogo size={92} />
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem" }}>
                Cumbre<span className="text-accent">.</span>
              </strong>
              <span className="tag tag-good">pasión por el café</span>
            </div>
            <div>
              <span className="brand-name">Nombre del proyecto y símbolo visual</span>
              <h3 style={{ fontSize: "1.65rem", margin: ".3rem 0 .6rem" }}>
                Cumbre — Marketplace de Café de Especialidad Colombiano
              </h3>
              <p className="meta" style={{ fontSize: ".98rem", lineHeight: 1.7 }}>
                Nuestro isotipo integra las <strong>tres cordilleras andinas de Colombia</strong> —donde nacen los mejores cafés de altura entre los 1.500 y 2.200 m s. n. m.— junto con un <strong>grano de café naciente</strong> como sol cálido en tonos dorado y cobre tostado. Representa el comercio justo, la frescura del tueste artesanal y la cumbre de calidad sensorial.
              </p>
              <div className="slogan-quote" style={{ marginBottom: 0 }}>
                Eslogan: «Los mejores tostadores de Colombia, del origen a tu taza.»
              </div>
            </div>
          </div>

          <div className="mv-grid" id="mision-vision">
            <article className="mv-card">
              <div>
                <span className="tag tag-info">Nuestra Misión</span>
              </div>
              <h3>Misión</h3>
              <p>
                Democratizar el acceso al café de especialidad colombiano conectando de manera directa, justa y transparente a pequeños caficultores y tostadores artesanales verificados con consumidores de todo el país, mediante una plataforma digital convergente que garantiza tueste fresco, trazabilidad de origen y comercio electrónico seguro.
              </p>
            </article>

            <article className="mv-card">
              <div>
                <span className="tag tag-warn">Nuestra Visión</span>
              </div>
              <h3>Visión</h3>
              <p>
                Consolidarnos para el año 2030 como el marketplace líder de café de especialidad en Latinoamérica, reconocido por impulsar el desarrollo sostenible de más de 200 marcas tostadoras y familias caficultoras colombianas, transformando la cultura de consumo local hacia un café ético, trazable y de excelencia sensorial.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="catalogo">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Catálogo en línea</span>
              <h2>Cafés destacados</h2>
              <p>Filtra por perfil de tueste, notas sensoriales y encuentra tu próximo favorito.</p>
            </div>
            <Link href="/cafes" className="btn btn-ghost btn-sm">
              Ver catálogo completo →
            </Link>
          </div>
          <Catalog initialProducts={products} />
        </div>
      </section>

      <section className="section" id="galeria">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Recursos visuales · Cultura cafetera</span>
              <h2>Galería: Del origen y el tueste a tu taza</h2>
              <p>
                Conoce los perfiles de tueste y procesos que hacen único al café de especialidad colombiano.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {GALLERY_ITEMS.map((item) => (
              <article className="gallery-card" key={item.src}>
                <div className="gallery-media">
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

      <section className="section" id="marcas">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Nuestras marcas</h2>
              <p>Productores y tostadores verificados, cada uno con su historia y perfiles únicos.</p>
            </div>
            <Link href="/marcas" className="btn btn-ghost btn-sm">
              Explorar marcas →
            </Link>
          </div>
          <div className="brands">
            {brands.length > 0
              ? brands.map((b, i) => (
                <article className="brand-card" key={b.id || b.slug}>
                  <div
                    className="mark"
                    style={{ background: brandColors[i % brandColors.length] }}
                  >
                    {b.name[0]}
                  </div>
                  <h3>
                    <Link href={`/marcas/${b.slug}`}>{b.name}</Link>
                  </h3>
                  <span className="meta">{b.city}</span>
                  <p>{b.story || "Lotes seleccionados de café de especialidad colombiano."}</p>
                  {b._count?.products !== undefined && (
                    <span className="meta faint" style={{ marginTop: "auto", fontSize: "0.8rem" }}>
                      {b._count.products} {b._count.products === 1 ? "café disponible" : "cafés disponibles"}
                    </span>
                  )}
                </article>
              ))
              : demoBrands.map((b) => (
                <article className="brand-card" key={b.name}>
                  <div className="mark" style={{ background: b.color }}>
                    {b.name[0]}
                  </div>
                  <h3>{b.name}</h3>
                  <span className="meta">{b.city}</span>
                  <p>{b.blurb}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      <section className="section" id="suscripcion">
        <div className="container">
          <div className="sub">
            <div>
              <h2>Tu café, siempre fresco</h2>
              <p className="meta" style={{ margin: ".8rem 0 1.5rem" }}>
                Elige tus perfiles favoritos y la frecuencia. Recibe lotes recién tostados con envío
                prioritario. Pausa o cancela cuando quieras.
              </p>
              <Link href="/suscripcion" id="cta-subscribe" className="btn btn-primary">
                Configurar mi suscripción
              </Link>
            </div>
            <ul>
              <li>Frecuencia semanal, quincenal o mensual</li>
              <li>Rotación de orígenes y microlotes exclusivos</li>
              <li>Pago seguro con Wompi, PSE, tarjeta, Nequi y Bre-B</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="vende">
        <div className="container">
          <div className="sub">
            <div>
              <h2>¿Eres tostador o productor?</h2>
              <p className="meta" style={{ margin: ".8rem 0 1.5rem" }}>
                Vende en Cumbre: tú despachas café fresco, nosotros gestionamos la pasarela de pagos,
                la visibilidad de tu marca y te liquidamos periódicamente.
              </p>
              <Link href="/vender" id="cta-sell" className="btn btn-ghost">
                Registrar mi marca
              </Link>
            </div>
            <ul>
              <li>Portal dedicado para tus productos, inventario y despachos</li>
              <li>Herramientas de publicidad para destacar tus cafés</li>
              <li>Liquidaciones transparentes directas a tu cuenta</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="contacto">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Atención y Soporte</span>
              <h2>Información de contacto</h2>
              <p>
                Estamos disponibles para asesorarte en tu compra, suscripción o registro como marca tostadora aliada.
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <div>
              <div className="panel">
                <h3>Canales oficiales de Cumbre</h3>
                <p className="meta mt-1">
                  Comunícate con nuestra sede principal en Bogotá o escríbenos por nuestros canales digitales:
                </p>
                <ul className="contact-list">
                  <li className="contact-item">
                    <div className="contact-icon" aria-hidden>📍</div>
                    <div>
                      <strong>Dirección principal y laboratorio de catación</strong>
                      <span>Carrera 11 #82-71, Piso 4 — Zona T, Bogotá D.C., Colombia</span>
                    </div>
                  </li>
                  <li className="contact-item">
                    <div className="contact-icon" aria-hidden>✉️</div>
                    <div>
                      <strong>Correos electrónicos</strong>
                      <span>hola@cumbrecafe.co · tostadores@cumbrecafe.co</span>
                    </div>
                  </li>
                  <li className="contact-item">
                    <div className="contact-icon" aria-hidden>📞</div>
                    <div>
                      <strong>Teléfono fijo y línea WhatsApp</strong>
                      <span>+57 (601) 742 8910 · WhatsApp: +57 315 840 2219</span>
                    </div>
                  </li>
                  <li className="contact-item">
                    <div className="contact-icon" aria-hidden>🕒</div>
                    <div>
                      <strong>Horario de atención</strong>
                      <span>Lunes a viernes: 8:00 a. m. – 6:00 p. m. · Sábados: 9:00 a. m. – 2:00 p. m.</span>
                    </div>
                  </li>
                  <li className="contact-item">
                    <div className="contact-icon" aria-hidden>🌐</div>
                    <div>
                      <strong>Redes sociales y comunidad</strong>
                      <span>Instagram, TikTok y X: @cumbrecafe.co</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
