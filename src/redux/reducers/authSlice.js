import { createContext, useContext, useState, useEffect } from "react";
import {db} from "../../firebaseinit";
import { doc, addDoc, Timestamp, updateDoc, collection, onSnapshot, deleteDoc, getDocs, getDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Link } from "react-router-dom";


const initialState={ userList: [], isLoggedIn: false, userLoggedIn: null };


// Async thunk for getting list of all the users within the firebase database
export const getInitialUserList = createAsyncThunk(
    "auth/userList",
    (state,{dispatch}) => {
        
        // getting data from firebase
        const unsub = onSnapshot(collection(db, "users"),(snapShot) => {
            const users = snapShot.docs.map((doc) => {
                return {
                    id:doc.id,
                    ...doc.data()
                }
            });
            // storing the userlist inside initialState variable
            dispatch(setUserList(users));
        });

    }
    
);



// AsyncThunk for creating new user in database
export const createUserThunk = createAsyncThunk(
    "auth/createUser",
    async (data,thunkAPI) => {

        // getting userList from initialState
        const {authReducer} = thunkAPI.getState();
        const {userList} = authReducer;
        console.log(data)

        // checking whether user's email already exist or not
        const index =userList.findIndex((user) => user.email === data.email);
        
        // if email address already exits inside database
        if(index !== -1){
            toast.error('Email address already in use !!');
            return;
        }else{

        // if email not found create new user 
        const docRef =await addDoc(collection(db, "users"), {
            name:data.name,
            email:data.email,
            password:data.password,
            cart:[],
            orders:[]
        });
        // notification 
        toast.success("New user Created, Please LogIn to Continue !!");
        }


    }
)


// AsyncThunk for signIn user
export const createSessionThunk = createAsyncThunk(
    "auth/createSession",
    async (data,{getState,dispatch}) => {

        // getting userList from initialState
        const {authReducer} = getState();
        const {userList} = authReducer;
        console.log(userList)

        // finding user inside the userList
        const index = userList.findIndex((user) => user.email === data.email);

        // if user not found show notification
        if(index === -1){
            toast.error("Email does not exist!!!");
            return false;
        }
        
        // if email found in database then match password
        if(userList[index].password === data.password){

            toast.success("Sign In Successfully!!!");
            
            // logging in user and storing its data in local variable
            dispatch(setLoggedIn(true));
            dispatch(setUserLoggedIn(userList[index]));
            
            // generating user's login token and store user's data 
            window.sessionStorage.setItem("token",true);
            window.sessionStorage.setItem("index",JSON.stringify(userList[index].id));
            

            
            return true;
        }
        else{
            // if password doesn't match in database
            toast.error("Wrong UserName/Password, Try Again");
            return false;
        }
    }
);


// AsyncThunk for SignOut
export const removeSessionThunk = createAsyncThunk(
    "auth/removeSession",
    () => {

        // removing user' data and token from local storage
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("index");
    }
)



const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers:{
        // to set userList 
        setUserList: (state,action) => {
            console.log(action.payload)
            state.userList=action.payload;
        },
        // whether user isLoggedIn or not
        setLoggedIn: (state,action) => {
            state.isLoggedIn = action.payload;
        },
        // data of loggedIn user
        setUserLoggedIn: (state,action) => {
            console.log(action.payload)
            state.userLoggedIn = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(removeSessionThunk.fulfilled, (state,action) => {
            // removing user's token and data from initialState
            state.isLoggedIn=false;
            state.userLoggedIn=null;
            toast.success("Sign Out successfully!!!!");
        })
        .addCase(getInitialUserList.fulfilled, (state, action)=>{
            // toast.success("users List updated!!")
    })
}});


// exporting the reducer 
export const authReducer=authSlice.reducer;
// exporting the reducer actions
export const {setLoggedIn,setUserLoggedIn,setUserList} = authSlice.actions;

// exporting the user's state to get data
export const authSelector = (state) => state.authReducer;


















// Async thunk for login
// export const loginAsync = createAsyncThunk('auth/login', async (value) => {
//   const logInRef = doc(db, "logIn", "session");
//   await updateDoc(logInRef, {
//     login: value,
//   });
//   console.log(value)
//   return value;
// });

// // Async thunk for logInbtn
// export const logInbtnAsync = createAsyncThunk('auth/logInbtn', async (data) => {
//   const collectionRef = collection(db, 'ids');
//   try {
//     const querySnapshot = await getDocs(collectionRef);
//     const match = querySnapshot.docs.some((doc) => {
//       const docData = doc.data();
//       return data.email === docData.email && data.password === docData.password;
//     });

//     if (match) {
//       await loginAsync(true);
//       document.location.href = 'http://localhost:3000/';
//       // window.alert("Welcome to Buybusy!!")
//     } else {
//       console.log('Invalid data');
//       // window.alert("Invalid email or password!!")
//     }
//   } catch (error) {
//     console.error('Error getting documents: ', error);
//   }
// });

// // Async thunk for logOut
// export const logOutAsync = createAsyncThunk('auth/logOut', async () => {
//   await loginAsync(false);
//   return null;
// });

// // Example reducer using createSlice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     loggedIn: false,
//     status: 'idle',
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(loginAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loggedIn = action.payload;
//       })
//       .addCase(logInbtnAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(logInbtnAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.loggedIn = action.payload;
//       })
//       .addCase(logOutAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(logOutAsync.fulfilled, (state) => {
//         state.status = 'succeeded';
//         state.loggedIn = false;
//       });
//   },
// });

// export const authReducer =  authSlice.reducer;

// You can use the thunks in your component or other parts of the application
// dispatch(logInbtnAsync(data));
// dispatch(logOutAsync());
