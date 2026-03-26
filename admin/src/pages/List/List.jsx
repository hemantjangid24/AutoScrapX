import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify';

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () =>{
    const response = await axios.get(`${url}/api/item/list`)
   
    if(response.data.success){
      setList(response.data.data)
    }
    else{
      toast.error("Error")
    }
  }

  const removeitem = async (itemId) =>{

    try {
      const response = await axios.post(`${url}/api/item/remove`, { id: itemId });
      await fetchList();
      
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || 'Error occurred while removing item.');
      }
    } catch (error) {
      console.log(error);
      
      // Check if the error has a message and display it in the toast.
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
    
  }

  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className='list add flex-col'>
      <p>All Product List</p>
      <div className="list-table">
        <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Product Type</b>
            <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p>{item.productType}</p>
              <p onClick={()=> removeitem(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List