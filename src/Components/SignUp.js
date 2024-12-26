import React from "react";
import styles from "../styles/LogIn.module.css";
import { useValue } from "../context";
import { Link } from "react-router-dom";
import {createUserThunk} from "../redux/reducers/authSlice"
import { useDispatch } from "react-redux";

function Orders() {
    // const { onPurchase, signUp } = useValue();
    const dispatch = useDispatch();
    const signUp = (data)=>{
        dispatch(createUserThunk(data))
    }

    return (
        <div className={styles.mainContainer}>
            <h1>Sign Up page</h1>
            <div className={styles.logInForm}>
                <input type="text" placeholder="Enter your Name" id="name" required/>
                <input type="email" placeholder="Enter your Email" id="email" required/>
                <input type="password" placeholder="Confirm your Password" id="password" required/>
                <button type="submit" onClick={()=>signUp({name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value})} >Sign up</button>
            </div>
            <Link to="/logIn">
            <p>Go to Log In page</p>
            </Link>
            
        </div>
    );
}

export default Orders;
