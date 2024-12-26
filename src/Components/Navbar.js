import React, { useState } from "react";
import styles from "../styles/NavBar.module.css";
import { Outlet, Link } from "react-router-dom";
import { useValue } from "../context";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeSessionThunk } from "../redux/reducers/authSlice";

const NavBar = ()=>{
    // const {logIn, showCart, logOut} = useValue();
    const {isLoggedIn} = useSelector(authSelector)
    const dispatch = useDispatch();


    return(
        <>
        <div className={styles.navContainer}>
            <div className={styles.logo}><Link to="/"><h3>BuyBusy</h3></Link></div>
            <div className={styles.linkArea}>
                <Link to="/">
                <div className={styles.home}> 
                    <img src="https://cdn-icons-png.flaticon.com/128/8411/8411430.png" alt="home"/>Home 
                </div>
                </Link>
                    <Link to="/orders">
                        {isLoggedIn? <div className={styles.orders}>
                        <img src="https://cdn-icons-png.flaticon.com/128/5530/5530389.png"/>My Orders</div>: null }
                    </Link>
                    <Link to="/cart">
                    {isLoggedIn? <div className={styles.cart}>
                    <img src="https://cdn-icons-png.flaticon.com/128/2331/2331970.png"/>My Cart</div> : null }
                    </Link>

                <div className={styles.logInout}>{isLoggedIn? <p onClick={()=>{dispatch(removeSessionThunk())}}>Log out</p>: <Link to="/login">Log in</Link>}</div>
            </div>

        </div>
        <Outlet/>
        </>
    )
}

export default NavBar;