import React from "react";
import styles from "../styles/Items.module.css"
// import { useValue } from "../context";
import { addToCartAsync } from '../redux/reducers/itemSlice'
import { useDispatch } from "react-redux";

const Items = (props) =>{
    // const {addToCart} = useValue();
    // console.log(props.item.title.length)
    const dispatch = useDispatch()

    const addToCart = (item)=>{
        dispatch(addToCartAsync(item))
    }

    return(
        <div className={styles.itemContainer}>
        <div className={styles.itemImg}>
            <img src={props.item.image} alt="itemImg"/>
        </div>
        <div className={styles.details}>
            <h3>{props.item.title.length > 25 ? `${props.item.title.substring(0, 25)}...`: props.item.title}</h3>
            <h3>price: &#8377; {Math.trunc(props.item.price) *80 }</h3>
        </div>
        <button className={styles.addToCart} onClick={()=> addToCart(props.item)}>Add To Cart</button>
        </div>
    )
}

export default Items;