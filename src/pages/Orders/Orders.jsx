import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ShoppingBag, Calendar, CheckCircle, Package, Truck, Compass, Check } from "lucide-react";
import orderService from "../../services/orderService";
import { Spinner } from "../../components/Loading/Loading";
import EmptyState from "../../components/EmptyState/EmptyState";

export const Orders = () => {
  const location = useLocation();
  const placedOrderId = location.state?.placedOrderId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await orderService.getOrders();
        setOrders(list);
        
        // Auto track if an order was just placed
        if (placedOrderId) {
          const placed = list.find(o => o.id === placedOrderId);
          if (placed) setTrackingOrder(placed);
        } else if (list.length > 0) {
          setTrackingOrder(list[0]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [placedOrderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon="Package"
          title="No Orders Found"
          description="You haven't placed any orders yet. Once you buy products, they will appear here."
          actionText="Shop Now"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Success alert if checkout complete */}
      {placedOrderId && (
        <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-950/40 text-left flex items-start space-x-4">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl flex-shrink-0 shadow-md">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-sans">Thank you for your order!</h3>
            <p className="text-sm mt-1 leading-relaxed opacity-90">
              Your order <strong className="font-bold underline">{placedOrderId}</strong> has been successfully placed. We've sent a verification email and will notify you when it ships.
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="text-left border-b border-slate-200/50 dark:border-slate-850 pb-6">
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Track delivery status and view order details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        {/* Left: Orders List (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {orders.map((order) => {
            const isTracking = trackingOrder?.id === order.id;
            const itemsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

            return (
              <div
                key={order.id}
                onClick={() => setTrackingOrder(order)}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-350 ${
                  isTracking
                    ? "border-primary ring-2 ring-primary/10"
                    : "border-slate-200/50 dark:border-slate-800/50"
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Reference</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white font-sans">{order.id}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date Placed</p>
                    <p className="text-sm font-bold text-slate-850 dark:text-white flex items-center font-sans">
                      <Calendar className="w-4 h-4 text-slate-405 mr-1.5" />
                      {order.date}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivery Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary animate-pulse"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-white dark:border-slate-900 shadow-sm"
                      />
                    ))}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{itemsCount} {itemsCount === 1 ? "Item" : "Items"}</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">${order.summary.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Tracking details */}
        <div>
          {trackingOrder ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white">
                  Order Tracking
                </h3>
                <p className="text-xs text-slate-400 mt-1">Reference: {trackingOrder.id}</p>
              </div>

              {/* Status Timeline */}
              <div className="relative pl-6 space-y-8 py-2 font-sans">
                {/* Connector line */}
                <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-100 dark:bg-slate-800" />
                
                {trackingOrder.timeline.map((step, idx) => {
                  const isCompleted = step.completed;
                  // Map icons dynamically
                  const stepIcons = {
                    "order placed": Package,
                    "processing": Compass,
                    "shipped": Truck,
                    "delivered": CheckCircle
                  };
                  const StepIcon = stepIcons[step.status.toLowerCase()] || Check;

                  return (
                    <div key={idx} className="relative flex items-start space-x-4">
                      {/* Node circle */}
                      <div className={`absolute -left-6.5 p-1 rounded-full border-2 transition-all ${
                        isCompleted
                          ? "bg-primary border-primary text-white"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300"
                      }`}>
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>
                      
                      <div className="text-left">
                        <p className={`text-sm font-bold ${isCompleted ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                          {step.status}
                        </p>
                        {isCompleted && step.date && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(step.date).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping address details */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-3 font-sans text-sm">
                <h4 className="font-bold text-slate-850 dark:text-slate-250">Delivery Address</h4>
                <div className="text-slate-550 dark:text-slate-400 space-y-0.5 leading-relaxed text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300">{trackingOrder.shippingAddress.name}</p>
                  <p>{trackingOrder.shippingAddress.street}</p>
                  <p>{trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} {trackingOrder.shippingAddress.zip}</p>
                  <p>{trackingOrder.shippingAddress.country}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-3xl text-center text-slate-400 font-semibold border">
              Select an order to view tracking info
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Orders;
