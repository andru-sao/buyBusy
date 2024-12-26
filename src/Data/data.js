import { useState } from "react";


 const Data = () =>{
    const [itemsData, setItemsData] = useState([])
    
    fetch('https://fakestoreapi.com/products')
        .then(res=>res.json())
        .then(json=> setItemsData(json))
        console.log(itemsData)

        return (
            itemsData
        )
}

export default Data