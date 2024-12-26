import React from "react";
import styles from "../styles/Items.module.css"
import { removeFromCartAsync, addQtyAsync, removeQtyAsync } from "../redux/reducers/itemSlice";
import { useDispatch } from "react-redux";

const Items = (props) =>{
    const dispatch = useDispatch();
    const itemx = props.item.items;

    const removeFromCart = (i)=>{
        dispatch(removeFromCartAsync(i))
    }

    

    return(
        <div className={styles.itemContainer}>
        <div className={styles.itemImg}>
            <img src={itemx.image} alt="itemImg"/>
        </div>
        <div className={styles.details}>
            <h3>{itemx.title}</h3>
        </div>
        <div style={styles.a}>
        <h3>price: &#8377; {Math.trunc(itemx.price)* 80 * props.item.qty}</h3>

        <img onClick={()=> dispatch(addQtyAsync(props.item))} src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"/> {props.qty} <img onClick={()=> dispatch(removeQtyAsync(props.item))} src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"/>
        </div>
            
        
        <button className={styles.addToCart} onClick={()=> removeFromCart(props.item)}>Remove from Cart</button>
        </div>
    )
}

export default Items;