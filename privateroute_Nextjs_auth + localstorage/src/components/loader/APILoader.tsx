import React from 'react'
import Loader, { Bars } from 'react-loader-spinner'
import './APILoader.css'

interface ApiLoader {
  isLoading: boolean
  height?: string | number
  width?: string | number
  color?: string
}

const APILoader: React.FC<ApiLoader> = ({ isLoading, height, width, color }) => {
  return (
    <div>
      {isLoading && (
        <div className='loading' style={{ textAlign: 'center' }}>
          <Bars
            height={height || 80}
            width={width || 80}
            color={color || '#15223F'}
            ariaLabel='bars-loading'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
        </div>
      )}
    </div>
  )
}

export default APILoader
