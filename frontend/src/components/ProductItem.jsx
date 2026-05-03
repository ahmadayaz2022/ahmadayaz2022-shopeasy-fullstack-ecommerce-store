import React from 'react'

const ProductItem = ({ id, image, name, price }) => {
  return (
    <div className='text-gray-700 cursor-pointer group'>
      <div className='overflow-hidden rounded-lg bg-gray-100'>
        <img 
            className='hover:scale-110 transition-all duration-500 ease-in-out w-full aspect-[3/4] object-cover' 
            src={image[0] || "https://via.placeholder.com/300x400"} 
            alt={name} 
        />
      </div>
      <p className='pt-3 pb-1 text-sm font-medium group-hover:underline'>{name}</p>
      <p className='text-sm font-bold text-black'>${price}</p>
    </div>
  )
}

export default ProductItem