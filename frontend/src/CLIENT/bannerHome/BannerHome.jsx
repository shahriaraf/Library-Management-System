import React from 'react'
import './banner.css'
import Carousel from 'react-bootstrap/Carousel'
import bannerData from './bannerdata'
import { Link } from 'react-router-dom'

const BannerHome = () => {
  return (
    <div className='custom-container'>
      <Carousel>
        {bannerData.map((items) => {
          const { id, image, heading, paragraph } = items
          return (
            <Carousel.Item key={id}>
              <img
                className='img-fluid d-block w-100'
                id='banner-image'
                src={image}
                alt=''
              />
              <Carousel.Caption className='reading-room-caption'>
                <span className='banner-kicker'>THE READING ROOM · DHAKA</span>
                <h1 className='text-outline-h'>{heading}</h1>
                <p className='text-outline-p'>{paragraph}</p>
                <Link className='banner-link' to='/books'>
                  Browse the shelves <span aria-hidden='true'>→</span>
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          )
        })}
      </Carousel>
    </div>
  )
}

export default BannerHome
