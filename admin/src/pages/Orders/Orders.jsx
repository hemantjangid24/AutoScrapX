import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'; // Correct relative path!

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data || []);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (err) {
      toast.error("Error fetching orders");
      console.error(err);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={order._id || index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-products">
                {Array.isArray(order.items) && order.items.map((item, idx) =>
                  idx === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address ? `${order.address.firstName || ''} ${order.address.lastName || ''}` : ''}
              </p>
              <div className="order-item-address">
                <p>{order.address?.state ? order.address.state + "," : ''}</p>
                <p>
                  {order.address ? [
                    order.address.city,
                    order.address.state,
                    order.address.country,
                    order.address.zipcode
                  ].filter(Boolean).join(' ,') : ''}
                </p>
              </div>
              <p className='order-item-phone'>{order.address?.phone || ''}</p>
            </div>
            <p>Items: {order.items ? order.items.length : 0}</p>
            <p>₹{order.amount ? order.amount.toLocaleString('en-IN') : 0}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Shipping Product">Shipping Product</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
