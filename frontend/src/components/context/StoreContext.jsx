import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { product_list } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");

  // ADD this line: for demo/testing, use hardcoded userId
  const [userId, setUserId] = useState("demo-user-123");

  const [item_list, setitemList] = useState([]);

  // Cart management
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const currentCount = prev?.[itemId] ?? 0;
      return { ...prev, [itemId]: currentCount + 1 };
    });
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const currentCount = prev?.[itemId] ?? 0;
      if (currentCount <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      } else {
        return { ...prev, [itemId]: currentCount - 1 };
      }
    });
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    return product_list.reduce((sum, product) => {
      const quantity = cartItems[product._id] || 0;
      return sum + (quantity * product.price);
    }, 0);
  };

  const fetchitemList = async () => {
    try {
      const response = await axios.get(url + "/api/item/list");
      setitemList(response.data.data);
    } catch (error) {
      console.error("Failed to fetch item list:", error);
    }
  };

  const loadCartData = async (tok) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: tok } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchitemList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
      // Set demo userId for all frontend calls!
      setUserId("demo-user-123");
    }
    loadData();
  }, []);

  const contextValue = {
    item_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userId,      // <-- EXPORT userId in context!
    setUserId,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
