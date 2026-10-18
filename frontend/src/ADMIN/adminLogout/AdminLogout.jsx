import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`

  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.removeItem('userLogState')
    localStorage.removeItem('userType')

    try {
      await axios.post(logout_Api_url)
    } catch (error) {
      console.error('Unable to clear the admin session on the server:', error)
      toast.error('Signed out locally, but the server session could not be cleared.')
    } finally {
      window.location.replace('/')
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col text-center'>
          <img
            className='img-fluid'
            src='/LogoutImage.jpg'
            alt=''
            style={{ width: '350px' }}
          />

          <h3 className='h3'>are you sure, you want to Logout ? </h3>

          <button className='btn btn-success mx-5 my-3' onClick={handleLogout}>
            Yes
          </button>

          <button className='btn btn-secondary' onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogout
