import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { product_list } from '../../assets/assets';
import axios from 'axios';

// Helper functions for validation
function isOnlyDigits(value) {
  return /^\d+$/.test(value);
}
function isOnlyChars(value) {
  return /^[A-Za-z ]+$/.test(value);
}

const Cart = () => {
  const { cartItems = {}, setCartItems, removeFromCart, userId } = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discountActive, setDiscountActive] = useState(false);
  const [adminItems, setAdminItems] = useState([]);
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('ONLINE');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://autoscrapx-backend.onrender.com/api/item/list').then(res => {
      if (res.data.success && Array.isArray(res.data.data)) {
        setAdminItems(res.data.data);
      }
    });
  }, []);

  const getFullCartItems = () => {
    const itemsArr = [];
    for (let asset of product_list) {
      if (cartItems[asset.id] > 0) {
        itemsArr.push({
          ...asset,
          quantity: cartItems[asset.id],
          image: asset.image,
          source: 'asset'
        });
      }
    }
    for (let admin of adminItems) {
      if (cartItems[admin._id] > 0) {
        itemsArr.push({
          ...admin,
          quantity: cartItems[admin._id],
          image: `https://autoscrapx-backend.onrender.com/uploads/${admin.image}`,
          source: 'admin'
        });
      }
    }
    return itemsArr;
  };

  const cartProducts = getFullCartItems();
  const cartIsEmpty = cartProducts.length === 0;

  const formatPrice = amount =>
    typeof amount === 'number'
      ? amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })
      : '₹0.00';

  const handlePromoSubmit = () => {
    if (promoCode === 'AUTOSCRAPX10') {
      setPromoMessage('Promo applied successfully! 10% discount is shown below.');
      setDiscountActive(true);
    } else {
      setPromoMessage('Invalid promo code. Please try again.');
      setDiscountActive(false);
    }
  };

  const handleRemove = itemId => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(itemId);
    }
  };

  // ------ CORRECT PRICE CALCULATION ---------
  const subtotal = cartProducts.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const discountedSubtotal = discountActive ? subtotal * 0.9 : subtotal;
  const deliveryFee = subtotal === 0 ? 0 : 20;
  const grandTotal = Math.round(discountedSubtotal + deliveryFee);

  // ---- Razorpay Online Payment ----
  const handleCheckout = async () => {
    try {
      const { data } = await axios.post('https://autoscrapx-backend.onrender.com/api/payment/orders', {
        amount: grandTotal
      });
      const { order } = data;

      const options = {
        key: "rzp_test_RHxl53MlYLoaFZ",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "AutoScrapX",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('https://autoscrapx-backend.onrender.com/api/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.data.status === "success") {
              const orderRes = await axios.post('https://autoscrapx-backend.onrender.com/api/orders/create', {
                userId: userId || "demo-user-123",
                items: cartProducts.map(item => ({
                  id: item._id || item.id,
                  name: item.name,
                  price: Number(item.price),
                  quantity: Number(item.quantity),
                  source: item.source
                })),
                amount: grandTotal,
                address: personalDetails,
                payment_id: response.razorpay_payment_id,
                promoApplied: discountActive ? promoCode : null,
                payment: true,
                paymentMethod: 'Online'
              });
              if (orderRes.data.success) {
                setCartItems({});
                localStorage.removeItem('cart');
                navigate('/myorders');
              } else {
                alert(orderRes.data.message || "Items couldn’t be saved");
                navigate('/');
              }
            } else {
              alert("Payment verification failed.");
              navigate('/');
            }
          } catch (err) {
            alert("Items couldn’t be saved");
            navigate('/');
          }
        },
        prefill: {
          name: personalDetails.name,
          email: "customer@email.com"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Failed to initiate payment");
      console.error(error);
    }
  };

  // ---- COD Payment ----
  const handleCOD = async () => {
    try {
      const orderRes = await axios.post('https://autoscrapx-backend.onrender.com/api/orders/create', {
        userId: userId || "demo-user-123",
        items: cartProducts.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          source: item.source
        })),
        amount: grandTotal,
        address: personalDetails,
        promoApplied: discountActive ? promoCode : null,
        payment: false,
        payment_id: null,
        paymentMethod: 'COD'
      });
      if (orderRes.data.success) {
        setCartItems({});
        localStorage.removeItem('cart');
        navigate('/myorders');
      } else {
        alert(orderRes.data.message || "Order couldn’t be placed");
        navigate('/');
      }
    } catch (err) {
      alert("Order couldn’t be placed");
      navigate('/');
    }
  };

  // PERSONAL DETAILS VALIDATION
  const validatePersonalDetails = () => {
    if (
      !isOnlyChars(personalDetails.name) ||
      !isOnlyDigits(personalDetails.phone) || personalDetails.phone.length !== 10 ||
      !personalDetails.address ||
      !isOnlyChars(personalDetails.city) ||
      !isOnlyDigits(personalDetails.zip) || personalDetails.zip.length !== 6
    ) {
      alert("Please fill all required fields correctly.\nName/City: letters only\nPhone: 10 digits\nZIP: 6 digits");
      return false;
    }
    return true;
  };

  return (
    <main className="cart" aria-label="Shopping Cart">
      <section className="cart-items">
        <header className="cart-items-title">
          <span>Item</span>
          <span>Title</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span>Remove</span>
        </header>
        <hr />
        {cartIsEmpty ? (
          <section className="cart-empty-alert">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2762/2762885.png"
              alt="Empty Cart"
              className="cart-empty-img"
            />
            <h3>Your cart is empty!</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
          </section>
        ) : (
          cartProducts.map(item => (
            <div key={item._id || item.id}>
              <div className="cart-items-title cart-items-item">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
                <span>{formatPrice(Number(item.price))}</span>
                <span>{item.quantity}</span>
                <span>{formatPrice(Number(item.price) * Number(item.quantity))}</span>
                <button onClick={() => handleRemove(item._id || item.id)} className="cross">
                  x
                </button>
              </div>
              <hr />
            </div>
          ))
        )}
      </section>
      {!cartIsEmpty && (
        <section className="cart-bottom">
          {!showPayment && (
            <section className="personal-details-section">
              <h2>Personal Details</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (validatePersonalDetails()) {
                    setShowPayment(true);
                  }
                }}
                className="personal-details-form"
              >
                <input
                  type="text"
                  placeholder="Full Name (letters only)"
                  value={personalDetails.name}
                  onChange={e => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                  required
                  pattern="[A-Za-z ]+"
                  title="Name: letters only"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={personalDetails.phone}
                  onChange={e => setPersonalDetails({ ...personalDetails, phone: e.target.value.replace(/\D/g, '') })}
                  required
                  pattern="\d{10}"
                  maxLength={10}
                  title="Phone: digits only"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={personalDetails.address}
                  onChange={e => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="City (letters only)"
                  value={personalDetails.city}
                  onChange={e => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                  required
                  pattern="[A-Za-z ]+"
                  title="City: letters only"
                />
                <input
                  type="text"
                  placeholder="ZIP Code (6 digits)"
                  value={personalDetails.zip}
                  onChange={e => setPersonalDetails({ ...personalDetails, zip: e.target.value.replace(/\D/g, '') })}
                  required
                  pattern="\d{6}"
                  maxLength={6}
                  title="ZIP: 6 digits only"
                />
                <button type="submit">Continue to Payment</button>
              </form>
            </section>
          )}
          {showPayment && (
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-detail">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountActive && (
                  <div className="cart-total-detail">
                    <span>Discount (10%)</span>
                    <span>-{formatPrice(subtotal * 0.1)}</span>
                  </div>
                )}
                <hr />
                <div className="cart-total-detail">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <hr />
                <div className="cart-total-detail">
                  <strong>Total</strong>
                  <strong>{formatPrice(grandTotal)}</strong>
                </div>
              </div>
              <div style={{ marginTop: 24 }}>
                <label>
                  <input type="radio" value="ONLINE"
                    checked={selectedPayment === 'ONLINE'}
                    onChange={() => setSelectedPayment('ONLINE')}
                  /> Online Payment (Razorpay)
                </label>
                <label style={{ marginLeft: 24 }}>
                  <input type="radio" value="COD"
                    checked={selectedPayment === 'COD'}
                    onChange={() => setSelectedPayment('COD')}
                  /> Cash On Delivery (COD)
                </label>
              </div>
              <div style={{ marginTop: 24 }}>
                {selectedPayment === 'ONLINE' ? (
                  <button onClick={handleCheckout} style={{ marginRight: 12 }}>Pay Online</button>
                ) : (
                  <button onClick={handleCOD}>Place COD Order</button>
                )}
              </div>
            </div>
          )}
          {!showPayment && (
            <aside className="cart-promocode">
              <p>If you have a promo code, enter it here</p>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="Promo Code"
                />
                <button onClick={handlePromoSubmit}>Submit</button>
              </div>
              {promoMessage && (
                <p className={`cart-promocode-message ${promoMessage.includes('Invalid') ? 'error' : 'success'}`}>
                  {promoMessage}
                </p>
              )}
            </aside>
          )}
        </section>
      )}
    </main>
  );
};

export default Cart;
