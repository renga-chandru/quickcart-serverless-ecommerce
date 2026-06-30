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
    country: user?.address?.country || "India",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment State
  const [paymentData, setPaymentData] = useState({
    upiId: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    bank: "",
    bankAccountName: ""
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
    if (paymentErrors[name]) {
      setPaymentErrors((prev) => ({ ...prev, [name]: "" }));
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

  const validatePayment = () => {
    const errors = {};
    if (paymentMethod === "UPI Payment") {
      if (!paymentData.upiId.trim()) {
        errors.upiId = "UPI ID is required";
      } else if (!/^[\w.-]+@[\w.-]+$/.test(paymentData.upiId.trim())) {
        errors.upiId = "Invalid UPI ID format (e.g. username@bank)";
      }
    } else if (paymentMethod === "Credit Card") {
      if (!paymentData.cardName.trim()) {
        errors.cardName = "Cardholder Name is required";
      }
      if (!paymentData.cardNumber.trim()) {
        errors.cardNumber = "Card Number is required";
      } else if (!/^\d{13,19}$/.test(paymentData.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Card Number must be numeric and between 13 and 19 digits";
      }
      if (!paymentData.cardExpiry.trim()) {
        errors.cardExpiry = "Expiry Date is required";
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentData.cardExpiry.trim())) {
        errors.cardExpiry = "Expiry Date must be in MM/YY format";
      }
      if (!paymentData.cardCvv.trim()) {
        errors.cardCvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(paymentData.cardCvv.trim())) {
        errors.cardCvv = "CVV must be 3 or 4 digits";
      }
    } else if (paymentMethod === "Net Banking") {
      if (!paymentData.bank) {
        errors.bank = "Please select a bank";
      }
      if (!paymentData.bankAccountName.trim()) {
        errors.bankAccountName = "Account Holder Name is required";
      }
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const isAddressValid = validateForm();
    const isPaymentValid = validatePayment();
    if (!isAddressValid || !isPaymentValid) return;

    setIsSubmitting(true);

    // Simulate payment processing (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
    { id: "credit-card", name: "Credit Card", desc: "Pay with Credit or Debit Cards (Visa, Mastercard, RuPay, Maestro)" },
    { id: "upi", name: "UPI Payment", desc: "Pay instantly via UPI (PhonePe, Google Pay, Paytm)" },
    { id: "net-banking", name: "Net Banking", desc: "Secure transfer via major Indian banks (SBI, HDFC, ICICI)" },
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
                  onClick={() => { setPaymentMethod(opt.name); setPaymentErrors({}); }}
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

            {/* Payment Details Form */}
            {paymentMethod !== "Cash on Delivery" && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-850 space-y-4">
                <h3 className="text-md font-bold text-slate-800 dark:text-white mb-2">
                  Enter {paymentMethod} Details
                </h3>
                
                {paymentMethod === "UPI Payment" && (
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    <Input
                      label="UPI ID"
                      name="upiId"
                      value={paymentData.upiId}
                      onChange={handlePaymentInputChange}
                      placeholder="username@okaxis"
                      error={paymentErrors.upiId}
                      required
                    />
                  </div>
                )}

                {paymentMethod === "Credit Card" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Cardholder Name"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentInputChange}
                        error={paymentErrors.cardName}
                        required
                      />
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentInputChange}
                        placeholder="1111 2222 3333 4444"
                        error={paymentErrors.cardNumber}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        name="cardExpiry"
                        value={paymentData.cardExpiry}
                        onChange={handlePaymentInputChange}
                        placeholder="MM/YY"
                        error={paymentErrors.cardExpiry}
                        required
                      />
                      <Input
                        label="CVV"
                        name="cardCvv"
                        type="password"
                        maxLength={4}
                        value={paymentData.cardCvv}
                        onChange={handlePaymentInputChange}
                        placeholder="123"
                        error={paymentErrors.cardCvv}
                        required
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "Net Banking" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5 w-full text-left">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans flex items-center">
                        Select Bank
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="bank"
                        value={paymentData.bank}
                        onChange={handlePaymentInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans ${
                          paymentErrors.bank ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""
                        }`}
                      >
                        <option value="">-- Choose a Bank --</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                      {paymentErrors.bank && (
                        <span className="text-xs font-medium text-red-500 font-sans">
                          {paymentErrors.bank}
                        </span>
                      )}
                    </div>
                    <Input
                      label="Account Holder Name"
                      name="bankAccountName"
                      value={paymentData.bankAccountName}
                      onChange={handlePaymentInputChange}
                      error={paymentErrors.bankAccountName}
                      required
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="px-8 w-full sm:w-auto"
            >
              Place Order (₹{summary.total.toFixed(2)})
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
                  <span className="font-bold text-slate-800 dark:text-white">₹{(item.finalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotals info */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{summary.subtotal.toFixed(2)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount</span>
                  <span>-₹{summary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>₹{summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{summary.shipping === 0 ? "FREE" : `₹${summary.shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
