import React, { useEffect } from "react";
import styles from "../styles/LogIn.module.css";
import { useValue } from "../context";
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {authSelector, createSessionThunk, getInitialUserList} from "../redux/reducers/authSlice"

function Login() {
    // const { logInbtn} = useValue();
    const dispatch = useDispatch();
    const {isLoggedIn} = useSelector(authSelector)

    useEffect(
        ()=>{
            dispatch(getInitialUserList());
        }
    ,[])

    const logInbtn= (data)=>{
        dispatch(createSessionThunk(data))
    }

    return (
        
    <div className={styles.mainContainer}>
            <h1>Log In</h1>
            <div className={styles.logInForm}>
                <input type="email" placeholder="Enter your Email" id="email" required/>
                <input type="password" placeholder="Enter your Password" id="password" required/>
                <button type="submit" onClick={()=>logInbtn({email: document.getElementById("email").value,
                 password: document.getElementById("password").value})}>Log In</button>
            </div>
            <Link to="/signUp">
            <p>Go to Sign up page</p>
            </Link>
        </div>
    
    );
}

export default Login;
