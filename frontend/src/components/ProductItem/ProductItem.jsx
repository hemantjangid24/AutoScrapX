import React, { useContext } from "react";
import "./ProductItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({ id, name, price, description, image, productType }) => {
  const {
    cartItems = {},
    addToCart,
    removeFromCart,
    // url    // <-- Do NOT use this for images, use {image} directly for imported assets!
  } = useContext(StoreContext);

  const quantity = cartItems[id] ?? 0; // IDs from your product_list

  return (
    <div className="product-item">
      <div className="product-item-img-container">
        {/* Direct asset import usage */}
        <img className="product-item-image" src={image} alt={name} />

        {quantity > 0 ? (
          <div className="product-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt={`Remove one ${name}`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && removeFromCart(id)}
            />
            <p>{quantity}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt={`Add one ${name}`}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && addToCart(id)}
            />
          </div>
        ) : (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt={`Add ${name} to cart`}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && addToCart(id)}
          />
        )}
      </div>
      <div className="product-item-info">
        <div className="product-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating stars" />
        </div>
        <p className="product-item-type">Type: {productType}</p>
        <p className="product-item-desc">{description}</p>
        <p className="product-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default ProductItem;
