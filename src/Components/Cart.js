import React, {useEffect, useState} from "react";
import styles from "../styles/Home.module.css"
import { useValue } from '../context';
import CartItems from "./CartItems";
import { useDispatch, useSelector } from "react-redux";
import { addToOrderAsync, cartSelector, fetchCartData } from "../redux/reducers/itemSlice";
import { collection, onSnapshot} from "firebase/firestore";
import {db} from "../firebaseinit";
import {authSelector} from "../redux/reducers/authSlice";
// import {cartSelector} from "../redux/reducers/itemSlice"

// import Data from "../Data/data"

const Home = ()=>{
    // const { isLoggedIn} = useValue();
    const {isLoggedIn} = useSelector(authSelector);
    // const {cartItems} =useSelector(cartSelector)
    const dispatch = useDispatch()

    const [onCart, setOnCart] = useState([]);
    useEffect(()=>{
        const cartRef = collection(db, "cart");
        const unsubscribe1 = onSnapshot(cartRef, snapShot => {
            const cart = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOnCart( cart );
            console.log(onCart)
           
        });
        return () => {
            unsubscribe1();
        };
    }
    ,[])



    let t = 0
    
    const totalPrice = onCart
  ? onCart.reduce((acc, item) => acc + Math.trunc(item.items.price) * item.qty, 0)
  : 0;
    
    

    return(
        <>
        {
            isLoggedIn ? <div className={styles.container}>
            <div className={styles.sideContainer}>
                
                <div className={styles.filterContainer}>
                    <h3>Total Price</h3>
                    <h3>&#8377; {totalPrice * 80}</h3>
                    <button className={styles.purchase} onClick={()=> dispatch(addToOrderAsync(onCart))}>Purchase</button>
                </div>
            </div>
            <div className={styles.mainContainer}>
                {
                    onCart.length === 0 ? 
                <h1>Your cart is empty.</h1>
                :
                <div className={styles.itemsDiv}>
                {
                    onCart.map((item) => (
                        <CartItems item={item} qty={item.qty} key={item.id} />
                    ))
                }
                </div>
                

            }
            </div>
        </div> :
        document.location.href = "http://localhost:3000/"
        }
        
        </>
    )
}

export default Home;