import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Truck, ChevronRight, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import orderService from "../../services/orderService";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export const Checkout = () => {
  const { cartItems, summary, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/products");
    }
  }, [cartItems, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "United States",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State / Province is required";
    if (!formData.zip.trim()) errors.zip = "Zip / Postal code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Assemble order payload
      const orderPayload = {
        items: cartItems,
        summary: {
          subtotal: summary.subtotal,
          tax: summary.tax,
          shipping: summary.shipping,
          discount: summary.discount,
          total: summary.total
        },
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        paymentMethod
      };

      const completedOrder = await orderService.placeOrder(orderPayload);
      clearCart();
      navigate("/orders", { state: { placedOrderId: completedOrder.id } });
    } catch (err) {
      console.error("Error submitting order:", err);
      alert(err.message || "Order placement failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    { id: "credit-card", name: "Credit Card", desc: "Pay with Visa, Mastercard, or AMEX" },
    { id: "upi", name: "UPI Payment", desc: "Pay instantly via PhonePe, GPay, or Paytm" },
    { id: "net-banking", name: "Net Banking", desc: "Secure transfer via major banks" },
    { id: "cod", name: "Cash on Delivery", desc: "Pay on arrival of your package" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-450 dark:text-slate-500 mb-8 uppercase tracking-wider text-left">
        <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 dark:text-slate-350">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
        {/* Left: Input fields for address (Col span 2) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
              <Truck className="w-5 h-5 mr-2 text-primary" />
              Shipping Address
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={formErrors.phone}
                required
              />
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              error={formErrors.street}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={formErrors.city}
                required
              />
              <Input
                label="State / Province"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                error={formErrors.state}
                required
              />
              <Input
                label="Zip / Postal Code"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                error={formErrors.zip}
                required
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-secondary" />
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.name)}
                  className={`p-5 rounded-2xl border cursor-pointer flex items-start space-x-3.5 transition-all duration-350 ${
                    paymentMethod === opt.name
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50"
                  }`}
                >
                  <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center mt-0.5 ${
                    paymentMethod === opt.name
                      ? "border-primary text-primary"
                      : "border-slate-350 dark:border-slate-700"
                  }`}>
                    {paymentMethod === opt.name && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{opt.name}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-normal">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="px-8 w-full sm:w-auto"
            >
              Place Order (${summary.total.toFixed(2)})
            </Button>
          </div>
        </form>

        {/* Right: Summary panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-4">
              Order Summary
            </h3>

            {/* List products mini */}
            <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-50 border"
                    />
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">${(item.finalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotals info */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{summary.shipping === 0 ? "FREE" : `$${summary.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>${summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
