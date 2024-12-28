import { createContext, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext()

const ShopContextProvider = (props) =>{

     const currency = '$';
     const delivery_fee = 10;
     const [search,setSearch] = useState('')
     const [showSearch,setShowSearch] = useState(false)
     const [cartItem,setCartItem] = useState({})

     const addToCart = async (itemId,size) => {

        if (!size) {
            toast.error('Select Product Size'); // Use toast.error for error messages
            return;
        }

        let cartData = structuredClone(cartItem);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);
     }

     const getCartCount = () => {
        let totalCount = 0;
    
        for (const itemId in cartItem) { // Corrected the outer loop variable
            for (const size in cartItem[itemId]) { // Corrected the inner loop variable
                try {
                    if (cartItem[itemId][size] > 0) {
                        totalCount += cartItem[itemId][size]; // Accumulate the count
                    }
                } catch (error) {
                    console.error("Error counting cart items:", error);
                }
            }
        }
    
        return totalCount;
    };
    
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItem); // Corrected cartItems to cartItem
        if (quantity === 0) {
            delete cartData[itemId][size]; // Deletes the size if quantity is 0
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]; // Deletes the item if no sizes remain
            }
        } else {
            cartData[itemId][size] = quantity;
        }
        setCartItem(cartData);
    };

    const getCartAmount =() => {
        let totalAmount = 0;
        for(const items in cartItem){  // cartItem, not cartItems
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItem[items]){  // Use cartItem here too
                try{
                    if(cartItem[items][item] > 0){
                        totalAmount += itemInfo.price * cartItem[items][item];
                    }
                }catch(error){
                    console.error("Error calculating cart amount:", error);
                }
            }
        }
        return totalAmount;
    };
    
    


    const value = {
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,cartItem,addToCart,getCartCount,updateQuantity,getCartAmount
    }
    return(
        <ShopContext.Provider value = {value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;