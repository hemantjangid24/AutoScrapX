import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore More Category</h1>
        <p className='explore-menu=text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, exercitationem excepturi temporibus obcaecati voluptas vitae?</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=> prev === item.category_name ? 'All' : item.category_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.category_name?'active':''} src={item.category_image} alt="" />
                        <p>{item.category_name}</p>
                    </div>
                )
            })}
        </div>
        <hr/>
    </div>
  )
}

export default ExploreMenu