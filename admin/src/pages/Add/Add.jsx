import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ url }) => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Wheels and Body Parts',
        productType: 'Used Parts',
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('category', data.category)
        formData.append('productType', data.productType)
        formData.append('image', image)
        const response = await axios.post(`${url}/api/item/add`, formData);

        if (response.data.success) {
            setData({
                name: '',
                description: '',
                price: '',
                category: 'Wheels and Body Parts',
                productType: 'Used Parts',
            })
            setImage(false);
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write content here' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            <option value="Wheels and Body Parts">Wheels and Body Parts</option>
                            <option value="Engine and Internal Parts">Engine and Internal Parts</option>
                            <option value="Body Parts and Exterior">Body Parts and Exterior</option>
                            <option value="Electrical and Lighting">Electrical and Lighting</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Brakes and Suspension">Brakes and Suspension</option>
                            <option value="Exhaust and Emissions">Exhaust and Emissions</option>
                            <option value="Heating and Cooling">Heating and Cooling</option>
                        </select>
                    </div>

                    <div className="add-category flex-col">
                        <p>Product type</p>
                        <select onChange={onChangeHandler} name="productType" value={data.productType}>
                            <option value="Used Parts">Used Parts</option>
                            <option value="New Parts">New Parts</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹20' />
                    </div>
                </div>
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>

    )
}

export default Add