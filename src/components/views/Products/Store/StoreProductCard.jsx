import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

function StoreProductCard({prod}) {
  const [quantity, setQuantity] = useState("1");
  const { addProductToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [popToast, setPopToast] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);

  const handleAddToCart = async (id) => {
    try {
      setLoading(true);
      if((quantity) < 1 ) setQuantity(1);
      const res = await addProductToCart(id, quantity);
      const addedProduct = res.data;
      setPopToast(addedProduct);
      setLoading(false);
      setTimeout(() => {
        setPopToast(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`store-p-card ${loading ? "loading" : ""}`}>
      {loading && (
        <div className="store-p-card-spinner-overlay">
          <div className="store-p-card-spinner"></div>
        </div>
      )}
      <div className="store-p-card-img-container">
        <Link
          href={`/products/${prod.productId}`}
          className="store-p-card-img-link"
        >
          <Image
            className="store-p-card-img"
            src={prod.images[0]}
            alt="Logo-Product"
            width={485}
            height={485}
            priority
          />
        </Link>
      </div>
      <div className="store-p-card-info">
        <Link
          href={`/products/${prod.productId}`}
          className="store-p-card-info-link"
        >
          <p>{prod.name}</p>
          <p className="store-p-card-info-unit">Cantidad x {prod.unit}</p>
        </Link>
      </div>
      <div className="store-p-card-add">
        <input
          className="store-p-card-add-input"
          name="baiml-product-quantity-input"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button
          className="store-p-card-add-button"
          onClick={() => handleAddToCart(prod.productId)}
        >
          Añadir al carrito
        </button>
      </div>
      {popToast && (
        <div
          className={`store-p-card-toast ${
            isScrolled ? "store-p-card-toast-scrolled" : ""
          }`}
        >
          <p>
            {`${popToast.name} x${popToast.quantity} `}
            <span className="store-p-card-toast-span">
              se agrego al carrito.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default StoreProductCard