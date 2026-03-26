import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from './../../components/context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const { url, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const razorpay_payment_id = searchParams.get('razorpay_payment_id');
  const razorpay_order_id = searchParams.get('razorpay_order_id');
  const razorpay_signature = searchParams.get('razorpay_signature');

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/payment/verify", {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      if (response.data.status === "success") {
        setCartItems && setCartItems([]);
        localStorage.removeItem('cart');
        navigate('/order-success');
      } else {
        navigate('/');
      }
    } catch (err) {
      navigate('/');
    }
  };

  useEffect(() => {
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      verifyPayment();
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
