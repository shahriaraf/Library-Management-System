import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'

const ClientLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`

  const userLoginState = useLoginState()

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // reset OR set user login state to NULL
      userLoginState.logout()

      // Clear cookie using API
      await axios.post(logout_Api_url)

      navigate('/', { replace: true })
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <section className='profile-logout-confirmation'>
      <img className='img-fluid' src='/LogoutImage.jpg' alt='' />
      <span className='profile-eyebrow'>LEAVING THE LIBRARY</span>
      <h2>Ready to sign out?</h2>
      <p>Your reading activity will be here when you return.</p>
      <div className='profile-logout-actions'>
        <button className='btn btn-primary' onClick={handleLogout}>
          Sign out
        </button>
        <button className='btn btn-secondary' onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </section>
  )
}

export default ClientLogout
