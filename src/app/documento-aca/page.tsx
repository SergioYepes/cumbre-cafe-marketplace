"use client";

import { useState } from "react";
import { CumbreLogo } from "@/components/Icons";

export default function DocumentoAcaPage() {
  const [integrantes, setIntegrantes] = useState("Sergio Yepes");
  const [docente, setDocente] = useState("Docente de Informática y Convergencia");
  const [institucion, setInstitucion] = useState("Corporación Unificada Nacional de Educación Superior (CUN)");
  const [urlPublicada, setUrlPublicada] = useState("https://cumbre-cafe-marketplace.vercel.app");

  return (
    <main className="section-sm">
      <style>{`
        .aca-toolbar {
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius);
          padding: 1.4rem 1.6rem;
          margin-bottom: 2rem;
          display: grid;
          gap: 1rem;
        }
        .aca-sheet {
          background: #ffffff;
          color: #1c1613;
          border-radius: 16px;
          padding: clamp(2rem, 5vw, 3.8rem);
          max-width: 880px;
          margin-inline: auto;
          box-shadow: 0 24px 60px -20px rgba(0,0,0,0.7);
          font-family: "Inter", system-ui, sans-serif;
          line-height: 1.65;
        }
        .aca-sheet h1, .aca-sheet h2, .aca-sheet h3 {
          font-family: "Fraunces", Georgia, serif;
          color: #1a110b;
        }
        .aca-cover {
          text-align: center;
          padding-bottom: 2.2rem;
          margin-bottom: 2.2rem;
          border-bottom: 2px solid #e0a458;
        }
        .aca-badge {
          display: inline-block;
          background: #fdf5ea;
          color: #9b5222;
          border: 1px solid #e0a458;
          padding: .28rem .85rem;
          border-radius: 999px;
          font-size: .78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 1rem;
        }
        .aca-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: .8rem;
          text-align: left;
          background: #faf6f1;
          border: 1px solid #eadbc8;
          border-radius: 12px;
          padding: 1.1rem 1.3rem;
          margin-top: 1.5rem;
          font-size: .9rem;
        }
        .aca-meta-grid strong {
          display: block;
          font-size: .75rem;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #7d6552;
        }
        .aca-sec {
          margin-bottom: 1.9rem;
          page-break-inside: avoid;
        }
        .aca-sec h2 {
          font-size: 1.35rem;
          border-left: 4px solid #c76b3a;
          padding-left: .75rem;
          margin-bottom: .75rem;
        }
        .aca-sec p, .aca-sec li {
          color: #2f251f;
          font-size: .95rem;
        }
        .aca-sec ul {
          padding-left: 1.3rem;
          display: grid;
          gap: .4rem;
        }
        .aca-box {
          background: #faf6f1;
          border: 1px solid #eadbc8;
          border-radius: 12px;
          padding: 1.1rem 1.3rem;
        }
        .aca-table {
          width: 100%;
          border-collapse: collapse;
          font-size: .88rem;
          margin-top: .6rem;
        }
        .aca-table th, .aca-table td {
          border: 1px solid #e2d3c1;
          padding: .65rem .85rem;
          text-align: left;
          vertical-align: top;
        }
        .aca-table th {
          background: #f3e9dc;
          color: #3b2818;
          font-weight: 600;
        }
        @media print {
          body { background: #ffffff !important; color: #1c1613 !important; }
          .header, .footer, .aca-toolbar { display: none !important; }
          .aca-sheet {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="container">
        <div className="aca-toolbar">
          <div className="row-flex between">
            <div>
              <h2 style={{ fontSize: "1.35rem" }}>Generador de Documento Entregable ACA (PDF)</h2>
              <p className="meta">
                Personaliza tus datos abajo y haz clic en <strong>Guardar / Imprimir PDF</strong> para obtener el documento listo para entregar.
              </p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              🖨️ Guardar / Imprimir como PDF
            </button>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Integrante(s) del proyecto</label>
              <input
                className="input input-sm"
                value={integrantes}
                onChange={(e) => setIntegrantes(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Institución / Universidad</label>
              <input
                className="input input-sm"
                value={institucion}
                onChange={(e) => setInstitucion(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Docente / Asignatura</label>
              <input
                className="input input-sm"
                value={docente}
                onChange={(e) => setDocente(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Enlace de la página web publicada</label>
              <input
                className="input input-sm"
                value={urlPublicada}
                onChange={(e) => setUrlPublicada(e.target.value)}
              />
            </div>
          </div>
        </div>

        <article className="aca-sheet">
          <header className="aca-cover">
            <span className="aca-badge">Actividad de Construcción Aplicada (ACA) · Informática y Convergencia</span>
            <div style={{ display: "flex", justifyContent: "center", margin: ".8rem 0" }}>
              <CumbreLogo size={78} />
            </div>
            <h1 style={{ fontSize: "2.3rem", marginBottom: ".3rem" }}>Cumbre.</h1>
            <p style={{ fontSize: "1.1rem", color: "#9b5222", fontStyle: "italic", fontWeight: 600 }}>
              «Los mejores tostadores de Colombia, del origen a tu taza.»
            </p>
            <p style={{ fontSize: ".95rem", color: "#5a473a", marginTop: ".3rem" }}>
              Diseño y creación de una página web funcional de comercio electrónico e identidad digital
            </p>

            <div className="aca-meta-grid">
              <div>
                <strong>Nombre del proyecto</strong>
                <span>Cumbre — Marketplace de Café de Especialidad Colombiano</span>
              </div>
              <div>
                <strong>Integrantes</strong>
                <span>{integrantes}</span>
              </div>
              <div>
                <strong>Institución y Asignatura</strong>
                <span>{institucion} · {docente}</span>
              </div>
              <div>
                <strong>Enlace de acceso a la página</strong>
                <span style={{ color: "#9b5222", fontWeight: 600, wordBreak: "break-all" }}>{urlPublicada}</span>
              </div>
            </div>
          </header>

          <section className="aca-sec">
            <h2>1. Nombre del proyecto y Tema seleccionado</h2>
            <p>
              <strong>Nombre del proyecto o marca:</strong> Cumbre.<br />
              <strong>Temática seleccionada:</strong> Emprendimiento digital, Comercio Electrónico (Marketplace), Agroindustria Cafetera Colombiana y Cultura del Café de Especialidad.
            </p>
          </section>

          <section className="aca-sec">
            <h2>2. Descripción del proyecto</h2>
            <p>
              <strong>Cumbre</strong> es una plataforma web funcional de comercio electrónico (marketplace) e identidad digital diseñada para conectar directamente a pequeños caficultores y marcas tostadoras artesanales de Colombia (provenientes de orígenes como Huila, Nariño, Cauca, Quindío y Santander) con consumidores finales en todo el país.
            </p>
            <p style={{ marginTop: ".6rem" }}>
              El proyecto resuelve la intermediación excesiva en la cadena del café, permitiendo que el comprador conozca el origen exacto, la altura de cultivo, el proceso de beneficio (lavado, honey, natural o anaeróbico), las notas sensoriales y la fecha reciente de tueste de cada lote, integrando además planes de suscripción recurrente y un portal exclusivo para marcas aliadas.
            </p>
          </section>

          <section className="aca-sec">
            <h2>3. Identidad Visual: Logo propio y Eslogan</h2>
            <div className="aca-box" style={{ display: "flex", gap: "1.3rem", alignItems: "center" }}>
              <div style={{ flexShrink: 0 }}>
                <CumbreLogo size={72} />
              </div>
              <div>
                <p>
                  <strong>Logo propio:</strong> El isotipo vectorial original de <em>Cumbre</em> representa las tres cordilleras andinas de Colombia coronadas por un grano de café naciente a modo de sol cálido, utilizando una paleta cromática de tonos dorado miel (<code>#e0a458</code>), cobre tostado (<code>#c76b3a</code>) y fondo espresso profundo (<code>#120d0a</code>).
                </p>
                <p style={{ marginTop: ".45rem" }}>
                  <strong>Eslogan oficial:</strong> <em>«Los mejores tostadores de Colombia, del origen a tu taza.»</em>
                </p>
              </div>
            </div>
          </section>

          <section className="aca-sec">
            <h2>4. Misión y Visión</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="aca-box">
                <h3 style={{ fontSize: "1.1rem", marginBottom: ".4rem" }}>Misión</h3>
                <p>
                  Democratizar el acceso al café de especialidad colombiano conectando de manera directa, justa y transparente a pequeños caficultores y tostadores artesanales verificados con consumidores de todo el país, mediante una plataforma digital convergente que garantiza tueste fresco, trazabilidad de origen y comercio electrónico seguro.
                </p>
              </div>
              <div className="aca-box">
                <h3 style={{ fontSize: "1.1rem", marginBottom: ".4rem" }}>Visión</h3>
                <p>
                  Consolidarnos para el año 2030 como el marketplace líder de café de especialidad en Latinoamérica, reconocido por impulsar el desarrollo sostenible de más de 200 marcas tostadoras y familias caficultoras colombianas, transformando la cultura de consumo local hacia un café ético, trazable y de excelencia sensorial.
                </p>
              </div>
            </div>
          </section>

          <section className="aca-sec">
            <h2>5. Herramientas utilizadas</h2>
            <table className="aca-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Herramienta / Tecnología</th>
                  <th>Uso dentro del proyecto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Desarrollo Web y Framework</td>
                  <td>Next.js 16 (App Router), React 19 y TypeScript</td>
                  <td>Arquitectura de la página de inicio, catálogo interactivo, rutas dinámicas y formularios.</td>
                </tr>
                <tr>
                  <td>Diseño Visual y Estilos</td>
                  <td>CSS3 personalizado (Variables CSS, Grid, Flexbox) y Google Fonts (<em>Fraunces</em> e <em>Inter</em>)</td>
                  <td>Identidad visual cálida inspirada en el café tostado, diseño adaptable (responsive) a móviles y escritorio.</td>
                </tr>
                <tr>
                  <td>Gráficos Vectoriales e Imágenes</td>
                  <td>SVG nativo (Logo propio e iconografía), Unsplash y generación digital</td>
                  <td>Creación del logotipo original de Cumbre y curaduría de fotografías temáticas de café de especialidad.</td>
                </tr>
                <tr>
                  <td>Base de Datos y Persistencia</td>
                  <td>Prisma ORM + SQLite / Datos demostrativos</td>
                  <td>Modelado de productos, variantes de molienda, marcas tostadoras, pedidos y suscripciones.</td>
                </tr>
                <tr>
                  <td>Asistencia de IA y Contenidos</td>
                  <td>Gemini / Herramientas generativas de texto e imagen</td>
                  <td>Redacción y revisión ortográfica de textos corporativos (misión, visión, eslogan y fichas sensoriales).</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="aca-sec">
            <h2>6. Descripción de las principales funcionalidades</h2>
            <ul>
              <li>
                <strong>Página de inicio e Identidad Corporativa:</strong> Presenta la propuesta de valor de Cumbre, su logotipo vectorial, eslogan, estadísticas de impacto, misión, visión y galería fotográfica comentada.
              </li>
              <li>
                <strong>Catálogo interactivo con filtros en tiempo real:</strong> Permite explorar cafés de especialidad filtrando por nivel de tueste (Claro, Medio, Medio-oscuro) y búsqueda por notas sensoriales, origen o marca.
              </li>
              <li>
                <strong>Galería temática («Del origen y el tueste a tu taza»):</strong> Muestra 4 recursos gráficos dedicados a la extracción y los perfiles de tueste con sus respectivas fuentes y licencias.
              </li>
              <li>
                <strong>Carrito de compras lateral (Drawer) y Checkout:</strong> Permite agregar lotes de café, ajustar cantidades, calcular progreso de envío gratuito y simular el proceso de compra con métodos locales (Wompi, PSE, Nequi, Bre-B).
              </li>
              <li>
                <strong>Módulo de Suscripciones y Portal de Tostadores:</strong> Vistas especializadas para configurar entregas periódicas de café fresco y para que nuevas fincas o marcas registren sus lotes.
              </li>
              <li>
                <strong>Sección de Contacto interactiva:</strong> Incluye canales oficiales (dirección en Bogotá, correos, teléfono, WhatsApp, horarios y redes sociales) junto con un formulario funcional con confirmación instantánea.
              </li>
            </ul>
          </section>

          <section className="aca-sec" style={{ marginBottom: 0 }}>
            <h2>7. Fuentes consultadas y atribución de recursos</h2>
            <ul>
              <li>
                <strong>Federación Nacional de Cafeteros de Colombia (FNC):</strong> Información de referencia sobre regiones cafeteras de denominación de origen (Huila, Nariño, Cauca, Quindío y Santander) y perfiles de taza. <em>https://federaciondecafeteros.org/</em>
              </li>
              <li>
                <strong>Specialty Coffee Association (SCA):</strong> Estándares de puntuación en taza (80+ puntos) y clasificación de procesos de beneficio y tueste. <em>https://sca.coffee/</em>
              </li>
              <li>
                <strong>Banco de imágenes Unsplash:</strong> Fotografías de apoyo para perfiles de tueste claro, medio y oscuro bajo licencia gratuita Unsplash (uso comercial y académico permitido sin restricción). <em>https://unsplash.com/license</em>
              </li>
              <li>
                <strong>Documentación oficial de Next.js y React:</strong> Guías técnicas para la construcción de interfaces web modernas y accesibles. <em>https://nextjs.org/docs</em>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}

