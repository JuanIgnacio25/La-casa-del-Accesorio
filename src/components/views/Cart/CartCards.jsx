"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CartCard from "@/components/views/Cart/CartCard";
import CartCloseOrder from "@/components/views/Cart/CartCloseOrder";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import FallbackSpinner from "@/components/common/FallbackSpinner/FallbackSpinner";

import validateQuantity from "@/utils/validate/validateQuantity";

import { MdError } from "react-icons/md";

function CartCards() {
  const router = useRouter();

  const { cart, loading, clearTheCart } = useCart();
  const [isClearTheCartModalOpen, setIsClearTheCartModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const openClearTheCartModal = () => setIsClearTheCartModalOpen(true);
  const closeClearTheCartModal = () => setIsClearTheCartModalOpen(false);

  const handleCloseOrder = () => {
    const validateProductsQuantity = cart.products.every((prod) =>
      validateQuantity(prod.quantity)
    );
    if (!validateProductsQuantity) {
      setError("La cantidad de los productos debe ser mayor a 0");
      window.scrollTo({top: 0, behavior: "smooth"});
      return;
    }
    setError(null);
    router.push("/cart/confirmOrder");
  };

  if (loading) {
    return (
      <div className="cart-main">
        <div className="cart-main-title">
          <h1>Detalles del Pedido</h1>
        </div>
        <div className="cart-cards-container">
          <table className="cart-cards">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>
                  <button className="card-cards-clean-cart-button">
                    Vaciar carrito
                  </button>
                </th>
              </tr>
            </thead>
          </table>
          <div className="cart-cards-fallback">
            <FallbackSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="cart-empty-container">
        <p className="cart-empty-title">El carrito está vacío</p>
        <Link href={"/products/baiml"} className="cart-empty-button-container">
          <button className="cart-empty-button">Volver a la Tienda</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-main">
      <div className="cart-main-title">
        <h1>Detalles del Pedido</h1>
        {error && (
          <div className="flex flex-row items-center gap-1 text-xs md:text-sm lg:text-base text-red-500">
            <MdError /> <p>{error}</p>
          </div>
        )}
      </div>
      <div className="cart-cards-container">
        <table className="cart-cards">
          <thead>
            <tr>
              <th></th>
              <th>Producto</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>
                <button
                  className="card-cards-clean-cart-button"
                  onClick={openClearTheCartModal}
                >
                  Vaciar carrito
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.products.map((prod) => (
              <CartCard key={prod.productId} product={prod} />
            ))}
          </tbody>
        </table>
      </div>
      <CartCloseOrder handleCloseOrder={handleCloseOrder} />

      <ConfirmModal
        isOpen={isClearTheCartModalOpen}
        onClose={closeClearTheCartModal}
        onConfirm={clearTheCart}
      >
        ¿Esta seguro que desea eliminar todos los productos del carrito?
      </ConfirmModal>
    </div>
  );
}

export default CartCards;
