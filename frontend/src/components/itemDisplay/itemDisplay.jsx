import React, { useEffect, useState } from 'react';
import './itemDisplay.css';
import ProductItem from '../ProductItem/ProductItem';
import axios from 'axios';
import { product_list } from '../../assets/assets';

const ItemDisplay = ({ category }) => {
  const [dbItems, setDbItems] = useState([]);

  useEffect(() => {
    axios.get('https://autoscrapx-backend.onrender.com/api/item/list')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setDbItems(res.data.data);
        }
      })
      .catch(err => {
        console.log('Failed to fetch items', err);
      });
  }, []);
// console.log('Fetched DB Items:', dbItems);
  // COMBINE BOTH ARRAYS
  // For dbItems, we need to construct image URL for images
  const dbItemsWithImages = dbItems.map(item => ({
    ...item,
    image: `https://autoscrapx-backend.onrender.com/uploads/${item.image}`
  }));
  
  const allItems = [...product_list, ...dbItemsWithImages];

  // Filter by category if needed
  const displayItems =
    category === 'All'
      ? allItems
      : allItems.filter(item => item.category === category);

  return (
    <div className="item-display" id="item-display">
      <h2>Top Products near you</h2>
      <div className="item-display-list">
        {displayItems.map(item => (
          <ProductItem
            key={item._id || item.id}
            id={item._id || item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            productType={item.productType}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemDisplay;
