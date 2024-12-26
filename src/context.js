import { createContext, useContext, useState, useEffect } from "react";
import {db} from "./firebaseinit";
import { doc, addDoc, Timestamp, updateDoc, collection, onSnapshot, deleteDoc, getDocs, getDoc} from "firebase/firestore"; 

// redux imports
import axios from "axios";
const {createSlice, createAsyncThunk} = require('@reduxjs/toolkit');


export const ItemContext = createContext();

export function useValue (){
    const value = useContext(ItemContext);
    return value;
};

function CustomItemContext({children}){
  
    const [logIn, setLogIn] = useState();
    const [itemsData, setItemsData] = useState([]);
    const [onCart, setOnCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [onPurchase, setOnPurchase] = useState([]);
    

    useEffect(()=> {
        const cartRef = collection(db, "cart");
        const orderRef = collection(db, "orders");

        async function logIn(){
          const docRef = doc(db, "logIn", "session");
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          console.log(docSnap.data())
          setLogIn(a.login)
          console.log(logIn)
          }
        logIn();
        

        const unsubscribe1 = onSnapshot(cartRef, snapShot => {
            const cart = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOnCart( cart );
            console.log(onCart)
           
        });
        const unsubscribe2 = onSnapshot(orderRef, snapShot => {
            const order = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOnPurchase( order );
            console.log(onPurchase)
        });
        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    },[]);

    async function login(value){
      const logInRef = doc(db, "logIn", "session");
      await updateDoc(logInRef, {
      login: value
    });}



    async function logInbtn(data) {
      const collectionRef = collection(db, "ids");
      try {
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          console.log(docData)
          console.log(data)
          if (data.email === docData.email && data.password === docData.password) {
            login(true)
            document.location.href = "http://localhost:3000/";
            // window.alert("Welcome to Buybusy!!")

          }else{
            console.log("invalid data")
            // window.alert("Invalid email or password!!")
          }
        });
      } catch (error) {
        console.error("Error getting documents: ", error);
      }

    }
    

    function logOut (){
      login(false)
      setLogIn(false);
      window.alert("You are Logged out!!")
    }

    async function signUp(data){
      const idRef = collection(db, "ids")
      if(data.pass1 === data.pass2){
        await addDoc(idRef, {
          email: data.email,
          password: data.pass1,
        });
        login(true)
            document.location.href = "http://localhost:3000/";
            window.alert("Signed up Successfully. Welcome to Buybusy!!")
      }else{
        console.log("pass1 and pass2 not matched!")
      }
        
    }

    // async function addToCart (item){

    //     const cartRef = collection(db, "cart")
    //     if(logIn){await addDoc(cartRef, {
    //         items: item,
    //         qty: 1,
    //         dateExample: Timestamp.fromDate(new Date()),
    //       });
    //       setCartTotal(cartTotal + item.price)
    //       window.alert("Item added to the Cart!!")
    //     }else{
    //       window.alert("Log in first!!")
    //       }

    // }

    async function addQty(item){

        const cartRef = doc(db, "cart", item.id);
        await updateDoc(cartRef, {
            qty: item.qty + 1
          });
        setCartTotal(cartTotal + item.price);
          
    }



    async function removeFromCart(item){

        await deleteDoc(doc(db, 'cart', item.id));;
        setCartTotal(cartTotal - (item.price * item.qty) );
        // window.alert("item removed from cart!!")

    }

    async function removeQty(item){

        if (item.qty > 1 ){
        const cartRef = doc(db, "cart", item.id);
        await updateDoc(cartRef, {
            qty: item.qty - 1
          });
          setCartTotal(cartTotal - item.price);
    
    }
        else{
            removeFromCart(item)
            
        }
    }

    async function addToOrder(order){
        const orderRef = collection(db, "orders");
        
        await addDoc(orderRef, {
            order: order,
            date: new Date().toISOString().slice(0, 10),
          });

        const collectionRef = collection(db, "cart");
          getDocs(collectionRef)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                removeFromCart(doc)
              });
              window.alert("Your item will be deliver soon!!")
            })
            .catch((error) => {
              console.error("Error getting documents: ", error);
            });
          
    }

    
    
    return(
        <ItemContext.Provider value={
            { logIn, logOut, signUp, logInbtn, itemsData, setItemsData, onCart, cartTotal, removeFromCart, addQty, removeQty, 
                onPurchase, addToOrder}
        }>
            {children}
        </ItemContext.Provider>
    )


}

export default CustomItemContext;
