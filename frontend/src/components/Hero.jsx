import React from 'react'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
          <div className='text-[#414141]'>
              <div className='flex items-center gap-2'>
                  <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                  <p className='font-medium text-sm md:text-base uppercase tracking-widest'>Our Bestsellers</p>
              </div>
              <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
              <div className='flex items-center gap-2'>
                  <p className='font-semibold text-sm md:text-base uppercase cursor-pointer hover:text-black transition-all'>Shop Now</p>
                  <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
              </div>
          </div>
      </div>
      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2 overflow-hidden'>
        <img 
            className='w-full h-full object-cover hover:scale-105 transition-all duration-700' 
            src="https://images.unsplash.com/photo-1441984908747-d4121882c9b1?q=80&w=2070&auto=format&fit=crop" 
            alt="Fashion Hero" 
        />
      </div>
    </div>
  )
}

export default Hero