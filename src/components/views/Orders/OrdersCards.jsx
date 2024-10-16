"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaBagShopping } from "react-icons/fa6";

import OrderCard from "@/components/views/Orders/OrderCard";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";

function OrdersCards() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState(null);
  const [orderId, setOrderId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openModal = (id) => {
    setIsModalOpen(true);
    setOrderId(id);
  };
  const closeModal = () => setIsModalOpen(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        console.error("Formato de respuesta no válido", res.data);
        setError("Formato de respuesta no válido");
      }
    } catch (error) {
      console.error("Error al obtener las ordenes", error);
      setError("Error al obtener las ordenes");
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatOrder = async () => {
    try {
      await axios.post(`/api/orders/repeat-order/${orderId}`);
      router.refresh();
      router.push("/cart");
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const viewDetail = (id) => {
    router.push(`/orderHistory/${id}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-main">
        <div className="orders-main-title-container">
          <div className="orders-main-title">
            <FaBagShopping className="orders-main-title-icon" /> Pedidos
          </div>
        </div>
        <div className="orders-spinner-container">
          <div className="orders-spinner"></div>
        </div>
      </div>
    );
  }

  if (orders.length == 0) {
    return (
      <div className="orders-empty-orders">
        <div className="orders-empty-orders-title">
          <p>No tienes pedidos aun</p>
        </div>
        <Link href={"/products/baiml"} className="orders-empty-button-container">
          <button className="orders-empty-button">
            Volver a la Tienda
          </button>
        </Link>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="orders-main">
      <div className="orders-main-title-container">
        <div className="orders-main-title">
          <FaBagShopping className="orders-main-title-icon" /> Pedidos
        </div>
      </div>
      <div className="orders-cards-container">
        {orders.map((ord) => {
          return (
            <OrderCard
              key={ord.orderId}
              order={ord}
              handleRepeat={openModal}
              viewDetail={viewDetail}
            />
          );
        })}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleRepeatOrder}
      >
        El carrito se llenará con el pedido que seleccionó y se borrará el resto
        de los items que tiene ahora. ¿Desea continuar?
      </ConfirmModal>
    </div>
  );
}

export default OrdersCards;