import React from 'react'

const AuthImagePattern = ({title,subtitle}) => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center bg-base-200 p-12">
      <div className="max-w-md text-center mt-9">
        <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_,index)=>(
                <div key={index} className={`aspect-square bg-primary/10
                ${index%2==0?'animate-pulse':''}`}>

                </div>
            ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern
