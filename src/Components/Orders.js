import React from "react";
import styles from "../styles/Orders.module.css";
import { useValue } from "../context";

function Orders() {
    const { onPurchase } = useValue();

    return (
        <div className={styles.mainContainer}>
            {
                onPurchase.length === 0 ? 
                <h1>Your Order List is empty.</h1>
                :
                <>
                <h1>Your Orders</h1>

            <div className={styles.orderConatainer}>
                {onPurchase.map((o, orderIndex) => (
                    
                    <React.Fragment key={orderIndex} >
                        <div className={styles.orderarea}>
                        <h2>Date - {o.date}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {o.order.map((items, itemIndex) => (
                                    <tr key={itemIndex}>
                                        <td>{items.items.title.length > 200 ? `${items.items.title.substring(0, 200)}...`:
                                        items.items.title
                                        }</td>
                                        <td>{Math.trunc(items.items.price) * 80 }</td>
                                        <td>{items.qty}</td>
                                        <td>{Math.trunc(items.items.price) * items.qty *80}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                       
                        </div>
                        <br/>
                        <br/>
                    </React.Fragment>
                    
                ))}
            </div>
            </>
            }
            
        </div>
    );
}

export default Orders;
