import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from './../../components/context/StoreContext';

const RazorpayCheckout = ({ amount, cartItems, clearCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const { url } = useContext(StoreContext);

  const handlePayment = async () => {
    if (paymentMethod === 'COD') {
      try {
        const { data } = await axios.post(url + '/api/orders/create', {
          amount, cart: cartItems, payment: false, payment_id: null, paymentMethod: 'COD'
        });
        if (data.success) {
          clearCart();
          alert('Order placed with Cash On Delivery!');
          window.location.href = '/order-success';
        } else {
          alert('Order creation failed. Please try again.');
        }
      } catch (error) {
        alert('Order creation failed. Try again.');
        console.error('COD order error:', error);
      }
    } else {
      try {
        const { data } = await axios.post(url + '/api/payment/orders', { amount });
        if (!data.success) {
          alert('Order creation failed. Please try again.');
          return;
        }
        const { order, key_id } = data;
        const options = {
          key: key_id || process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'AutoScrapX',
          description: 'Order Payment',
          handler: async function (response) {
            try {
              const verify = await axios.post(url + "/api/payment/verify", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (verify.data.status === 'success') {
                const orderResp = await axios.post(url + '/api/orders/create', {
                  amount, cart: cartItems, payment: true, payment_id: response.razorpay_payment_id, paymentMethod: 'Online'
                });
                if (orderResp.data.success) {
                  clearCart();
                  alert('Payment successful! Order placed.');
                  window.location.href = '/order-success';
                } else {
                  alert('Payment successful but order creation failed.');
                }
              } else {
                alert('Payment verification failed. Please contact support.');
              }
            } catch (err) {
              alert('Payment verification failed. Please contact support.');
              console.error('Payment verification error:', err);
            }
          },
          prefill: { name: 'Customer', email: 'customer@example.com', contact: '9999999999' },
          theme: { color: '#3399cc' },
          modal: { ondismiss: function () { console.log('Payment modal closed by user'); } }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        alert('Payment failed. Please try again.');
        console.error('Razorpay payment error:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '20px' }}>
          <input
            type="radio"
            value="Online"
            checked={paymentMethod === 'Online'}
            onChange={() => setPaymentMethod('Online')}
          /> Online Payment (Razorpay)
        </label>
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === 'COD'}
            onChange={() => setPaymentMethod('COD')}
          /> Cash On Delivery (COD)
        </label>
      </div>
      <button onClick={handlePayment} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {paymentMethod === 'COD' ? `Place Order Rs. ${amount}` : `Pay Rs. ${amount}`}
      </button>
    </div>
  );
};

export default RazorpayCheckout;
