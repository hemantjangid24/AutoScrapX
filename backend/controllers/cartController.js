import userModel from './../models/userModel.js';

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        // Validate required fields
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: 'userId and itemId are required' });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};
        
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.log('AddToCart Error:', error);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
};

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        // Validate required fields
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: 'userId and itemId are required' });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            
            // Remove item completely if quantity becomes 0
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        console.log('RemoveFromCart Error:', error);
        res.status(500).json({ success: false, message: 'Error removing from cart' });
    }
};

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Validate required field
        if (!userId) {
            return res.status(400).json({ success: false, message: 'userId is required' });
        }

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log('GetCart Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart' });
    }
};

export { addToCart, removeFromCart, getCart };
