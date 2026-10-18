import React from 'react'
import { Link } from 'react-router-dom'
import './footer.css'

const Footer = () => {
  return (
    <footer className='footer' style={{ marginTop: 'auto' }}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'>
            <h5 className='h5 mt-3'>Info</h5>
            <ul className='list-unstyled'>
              <li>
                Email: <a href='mailto:info@library.com'>info@library.com</a>
              </li>
              <li>
                Address:{' '}
                <a
                  href='https://maps.google.com/?q=Dhaka%2C%20Bangladesh'
                  target='_blank'
                  rel='noreferrer'
                >
                  Dhaka, Bangladesh
                </a>
              </li>
            </ul>
          </div>
          <div className='col-md-4'>
            <h5 className='h5 mt-3'>Links</h5>
            <ul className='list-unstyled'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/books'>Books</Link>
              </li>
              <li>
                <Link to='/about'>About Us</Link>
              </li>
            </ul>
          </div>
          <div className='col-md-4'>
            <h5 className='h5 mt-3'>Legal</h5>
            <ul className='list-unstyled'>
              <li>
                <a href='mailto:info@library.com?subject=Privacy%20policy%20request'>
                  Ask about our privacy policy
                </a>
              </li>
              <li>
                <a href='mailto:info@library.com?subject=Terms%20of%20service%20request'>
                  Ask about our terms of service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
