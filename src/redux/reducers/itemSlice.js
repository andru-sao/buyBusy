
import {db} from "../../firebaseinit";
import { toast } from 'react-toastify';
import { doc, addDoc, Timestamp, updateDoc, collection,  deleteDoc, getDocs} from "firebase/firestore"; 
import { useSelector } from "react-redux";
import { authSelector } from "./authSlice";

// redux imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';




const initialState = {
    cartItems:[

    ]
};


export const fetchCartData = createAsyncThunk('cart/fetchData', async(arg,{dispatch}) => {
    try {
      const cartRef = collection(db, "cart");
      const snapShot = await cartRef.get();
      const cart = snapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // console.log(cart)
      // return  cart;
      dispatch(cartReducer.setCartItems(cart))
      
    } catch (error) {
      throw error;
    }
  });



// Async thunk for addToCart
export const addToCartAsync = createAsyncThunk('cart/addToCart', async (item, thunkAPI) => {
  
  console.log(item);
  const cartRef = collection(db, 'cart');
    await addDoc(cartRef, {
      items: item,
      qty: 1,
      dateExample: Timestamp.fromDate(new Date()),
    });

});

// Async thunk for addQty
export const addQtyAsync = createAsyncThunk('cart/addQty', async (item ) => {
  const cartRef = doc(db, 'cart', item.id);
  await updateDoc(cartRef, {
    qty: item.qty + 1,
  });
  // setCartTotal(cartTotal + item.price);
  return null;
});

// Async thunk for removeFromCart
export const removeFromCartAsync = createAsyncThunk('cart/removeFromCart', async (item) => {
  await deleteDoc(doc(db, 'cart', item.id));
  // setCartTotal(cartTotal - item.price * item.qty);
  return null;
});
 
// Async thunk for removeQty
export const removeQtyAsync = createAsyncThunk('cart/removeQty', async (item ) => {
  if (item.qty > 1) {
    const cartRef = doc(db, 'cart', item.id);
    await updateDoc(cartRef, {
      qty: item.qty - 1,
    });
    // setCartTotal(cartTotal - item.price);

  } else {
    removeFromCartAsync(item);
  }
  return null;
});

// Async thunk for addToOrder
export const addToOrderAsync = createAsyncThunk('cart/addToOrder', async (order, { dispatch }) => {
  const orderRef = collection(db, 'orders');

  await addDoc(orderRef, {
    order: order,
    date: new Date().toISOString().slice(0, 10),
  });

  const collectionRef = collection(db, 'cart');
  const querySnapshot = await getDocs(collectionRef);

  const removeFromCartPromises = querySnapshot.docs.map(async (doc) => {
    try {
      console.log('Removing item from cart:', doc.id);
      await dispatch(removeFromCartAsync(doc)); // Dispatch the async thunk
      console.log('Item removed successfully:', doc.id);
    } catch (error) {
      console.error('Error removing item from cart:', doc.id, error);
    }
  });

  await Promise.all(removeFromCartPromises);

  return null;
});


// Example reducer using createSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Other synchronous actions can be defined here if needed
    setCartItems:(state, action)=>{
      console.log(action.payload)
      state.cartItems = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCartData.fulfilled, (state, {payload})=>{
      console.log(payload)
      if (payload) {
        state.cartItems = payload;
      }
    })
      .addCase(addToCartAsync.pending, (state) => {
        // Handle loading state if needed
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        // Handle success state if needed
        toast.success("Item added to cart!!")
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        // Handle error state if needed
        window.alert('Error adding item to the Cart');
      })
      .addCase(addQtyAsync.fulfilled, (state) => {
        // Handle success state if needed
      })
      .addCase(removeFromCartAsync.fulfilled, (state) => {
        toast.success("Item removed from cart!!")
      })
      .addCase(removeQtyAsync.fulfilled, (state) => {
        // Handle success state if needed
      })
      .addCase(addToOrderAsync.fulfilled, (state) => {
        // Handle success state if needed
        toast.success('Your item will be delivered soon!!');
      })
      
  },
});

export const cartReducer = cartSlice.reducer;
export const cartSelector = (state)=>state.cartReducer.cartItems;



