"use client";

import { useState } from "react";
import { formatCop, GRIND_LABEL, type ROAST_LEVEL } from "@/lib/format";
import { useCart } from "./cart/CartProvider";

type VariantData = {
  id: string;
  sku: string;
  weightGrams: number;
  grind: string;
  priceCop: number;
  stock: number;
  fresh: boolean;
  available: boolean;
};

type ProductBuyBoxProps = {
  productId: string;
  productSlug: string;
  productName: string;
  brandName: string;
  imageUrl: string;
  variants: VariantData[];
};

export default function ProductBuyBox({
  productSlug,
  productName,
  brandName,
  imageUrl,
  variants,
}: ProductBuyBoxProps) {
  const { add } = useCart();
  const availableVariants = variants.filter((v) => v.available);
  const [selectedId, setSelectedId] = useState<string>(
    availableVariants[0]?.id ?? variants[0]?.id ?? ""
  );
  const [selectedGrind, setSelectedGrind] = useState<string>("WHOLE_BEAN");
  const [qty, setQty] = useState(1);

  const selectedVariant = variants.find((v) => v.id === selectedId) ?? variants[0];

  if (!selectedVariant) {
    return <div className="text-bad">Variantes no disponibles temporalmente.</div>;
  }

  const handleAddToCart = () => {
    add(
      {
        variantId: selectedVariant.id,
        productSlug,
        productName,
        brandName,
        weightGrams: selectedVariant.weightGrams,
        grind: selectedGrind,
        priceCop: selectedVariant.priceCop,
        image: imageUrl,
      },
      qty
    );
  };

  return (
    <div className="buy-box" style={{ marginTop: "1.5rem" }}>
      <div style={{ marginBottom: "1.2rem" }}>
        <label className="meta" style={{ display: "block", marginBottom: ".5rem", fontWeight: 600 }}>
          Presentación:
        </label>
        <div className="variant-grid">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.available}
              className={`variant ${selectedId === v.id ? "active" : ""}`}
              onClick={() => setSelectedId(v.id)}
            >
              <strong>{v.weightGrams} g</strong>
              <span>{formatCop(v.priceCop)}</span>
              {!v.available && <small style={{ color: "var(--bad)", display: "block" }}>Agotado</small>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label className="meta" style={{ display: "block", marginBottom: ".5rem", fontWeight: 600 }}>
          Tipo de molienda:
        </label>
        <div className="chips">
          {Object.entries(GRIND_LABEL).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`chip ${selectedGrind === key ? "active" : ""}`}
              onClick={() => setSelectedGrind(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-foot" style={{ borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
        <div>
          <span className="meta" style={{ display: "block", fontSize: ".8rem" }}>
            Precio unitario
          </span>
          <strong className="price mono" style={{ fontSize: "1.8rem" }}>
            {formatCop(selectedVariant.priceCop * qty)}
          </strong>
        </div>

        <div className="buy-row">
          <div className="qty">
            <button
              type="button"
              aria-label="Disminuir cantidad"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              aria-label="Aumentar cantidad"
              onClick={() => setQty((q) => Math.min(selectedVariant.stock || 24, q + 1))}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            id="pdp-add-btn"
            disabled={!selectedVariant.available}
            onClick={handleAddToCart}
          >
            {selectedVariant.available ? "Añadir al carrito" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  );
}
