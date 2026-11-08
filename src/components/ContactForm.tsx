"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Consulta sobre cafés y pedidos");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="panel" style={{ display: "grid", gap: "1rem", alignContent: "center", minHeight: 340, textAlign: "center" }}>
        <div style={{ fontSize: "2.6rem" }}>☕</div>
        <h3>¡Mensaje recibido, {name}!</h3>
        <p className="meta" style={{ maxWidth: 380, marginInline: "auto" }}>
          Hemos registrado tu solicitud sobre <strong>{topic.toLowerCase()}</strong>. Nuestro equipo de baristas y soporte te responderá a <strong>{email}</strong> en menos de 24 horas hábiles.
        </p>
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSent(false);
              setMessage("");
            }}
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="panel form" onSubmit={handleSubmit} id="contact-form">
      <h3>Escríbenos directamente</h3>
      <p className="meta" style={{ marginTop: "-.4rem", marginBottom: ".4rem" }}>
        ¿Tienes dudas sobre un origen, molienda, suscripción o alianza como tostador? Cuéntanos.
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">Nombre completo</label>
          <input
            id="contact-name"
            className="input"
            type="text"
            placeholder="Ej. Valentina Gómez"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Correo electrónico</label>
          <input
            id="contact-email"
            className="input"
            type="email"
            placeholder="valentina@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-topic">Motivo de contacto</label>
        <select
          id="contact-topic"
          className="select"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="Consulta sobre cafés y pedidos">Consulta sobre cafés y pedidos</option>
          <option value="Suscripciones personalizadas">Suscripciones personalizadas</option>
          <option value="Vincular mi marca o finca tostadora">Vincular mi marca o finca tostadora</option>
          <option value="Soporte y garantías de frescura">Soporte y garantías de frescura</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          className="textarea"
          placeholder="Cuéntanos qué perfil de taza buscas o cómo podemos ayudarte..."
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Enviar mensaje a Cumbre →
      </button>
    </form>
  );
}

