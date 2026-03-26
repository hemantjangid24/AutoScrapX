import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';
import jsPDF from "jspdf";
import logo2 from './../../assets/logo2.png';
import QRCode from 'qrcode';

const MyOrders = () => {
  const { url, token, userId } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        url + '/api/orders/user',
        { userId: userId || "demo-user-123" },
        { headers: { token } }
      );
      setOrders(response.data?.data || []);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = amount =>
    typeof amount === 'number'
      ? amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })
      : '₹0.00';

  const formatOrderDate = date =>
    date ? new Date(date).toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) : '';

  function downloadInvoice(order) {
  const doc = new jsPDF();

  // Company branding bar
  doc.setFillColor(253, 81, 26);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AutoScrapX', 20, 18);

  // Business info line
  doc.setFontSize(10);
  doc.text('Address: 123 Business St, Delhi - 10001', 120, 11);
  doc.text('Phone: +91-9876543210 Email: info@autoscrapx.com', 120, 19);

  // Invoice Header
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(22);
  doc.text('INVOICE', 105, 34, { align: 'center' });

  doc.setDrawColor(180, 180, 180);
  doc.line(20, 38, 190, 38);

  // Customer & Order Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order._id}`, 20, 48);
  doc.text(`Customer: ${order.address.name}`, 20, 56);
  doc.text(`Address: ${order.address.address}, ${order.address.city}, ${order.address.zip}`, 20, 64);
  doc.text(`Phone: ${order.address.phone}`, 20, 72);
  doc.text(`Order Date: ${formatOrderDate(order.date)}`, 20, 80);

  // Payment details
  const paymentType = order.payment_id ? "Online Payment" : "Cash On Delivery";
  const paymentStatus = order.payment ? "PAID" : "UNPAID";
  doc.setFontSize(11);
  doc.text(`Payment Method: ${paymentType}`, 120, 56);
  doc.text(`Payment Status: ${paymentStatus}`, 120, 64);

  // Section line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 88, 190, 88);

  // Items Table
  let y = 98;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text("Item", 22, y);
  doc.text("Qty", 130, y);
  doc.text("Amount", 165, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  y += 8;

  order.items.forEach((item, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, y - 6, 170, 8, 'F');
    }
    doc.text(item.name, 22, y);
    doc.text(item.quantity.toString(), 132, y, { align: 'center' });
    doc.text(`Rs. ${item.price * item.quantity}`, 185, y, { align: 'right' });
    y += 8;
  });

  // GST and Discount
  const gstRate = 18;
  const gstValue = Math.round(order.amount * gstRate / 100);
  const discountValue = order.promoApplied ? Math.round((order.amount * 0.10)) : 0;

  // Subtotal
  y += 8;
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text("Subtotal:", 140, y, { align: 'right' });
  doc.text(`Rs. ${order.amount}`, 185, y, { align: 'right' });

  // GST
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`GST (${gstRate}%):`, 140, y, { align: 'right' });
  doc.text(`Rs. ${gstValue}`, 185, y, { align: 'right' });

  // Discount
  if (discountValue > 0 && order.promoApplied) {
    y += 8;
    doc.setTextColor(40, 130, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(`Discount (${order.promoApplied}):`, 140, y, { align: 'right' });
    doc.text(`- Rs. ${discountValue}`, 185, y, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  }

  // Grand Total
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(253, 81, 26);
  const finalTotal = order.amount + gstValue - discountValue;
  doc.text("Grand Total:", 130, y, { align: 'right' });
  doc.text(`Rs. ${finalTotal}`, 185, y, { align: 'right' });

  // QR Code and authorized signature
  let qrY = y + 18;
  let qrText = order.payment_id ? `Order:${order._id} Payment:${order.payment_id}` : `Order:${order._id}`;
  QRCode.toDataURL(qrText, { width: 70 }, function (err, url) {
    if (!err) {
      doc.addImage(url, 'PNG', 20, qrY, 28, 28);
    }

    // Signature space with company name
    doc.setLineWidth(0.3);
    doc.setDrawColor(80, 80, 80);
    doc.rect(120, qrY + 10, 60, 18);
    doc.setFontSize(10);
    doc.text("Authorized Signature", 125, qrY + 24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 82, 160);  
    doc.text("AutoScrapX  ", 155, qrY + 19);

    // Logo centered at bottom
    if (logo2) doc.addImage(logo2, 'PNG', 85, 260, 40, 18); // Adjust y=260 for bottom

    // Thank you
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(253, 81, 26);
    doc.text("Thank you for shopping with AutoScrapX!", 105, 285, { align: "center" });

    doc.save(`Invoice_Order_${order._id}.pdf`);
  });
}


  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className='container'>
        {loading && <p>Loading orders...</p>}
        {error && <p className="my-orders-error">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <div className="no-orders">
            <p>No orders found.</p>
            <button onClick={() => window.location.href = '/'}>Start Shopping</button>
          </div>
        )}
        {!loading && !error &&
          orders.map((order, index) => (
            <div key={order._id || index} className="my-orders-order">
              <div className="my-orders-header">
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <span className="my-orders-id">Order #{order._id?.slice(-8)}</span>
                  <span className="my-orders-date">{formatOrderDate(order.date)}</span>
                </div>
              </div>
              <div className="my-orders-items">
                {(Array.isArray(order.items) ? order.items : []).map((item, idx, arr) => (
                  <span key={idx} className="my-orders-item">
                    {item.name} x {item.quantity}{idx < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
              <div className="my-orders-footer">
                <span className="my-orders-amount">{formatPrice(order.amount)}</span>
                <span>Items: {Array.isArray(order.items) ? order.items.length : 0}</span>
                <span className={`my-orders-status ${order.status?.toLowerCase().replace(" ", "-")}`}>
                  <b>{order.status}</b>
                </span>
              </div>
              <div className="my-orders-buttons">
                <button onClick={fetchOrders}>Refresh</button>
                <button onClick={() => downloadInvoice(order)}>
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyOrders;
