import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { backend_server } from '../../main'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'

const ClientDetails = ({ userData }) => {
  const UpdateUser_API_URL = `${backend_server}/api/v1/users`
  const [showEditModal, setShowEditModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State variable to track password visibility
  const navigate = useNavigate()

  const handleEditModalClose = () => {
    setShowEditModal(false)
  }

  const handleEditModalShow = () => {
    setShowEditModal(true)
  }

  const handlePasswordModalClose = () => {
    setShowChangePasswordModal(false)
  }

  const handlePasswordModalShow = () => {
    setShowChangePasswordModal(true)
  }

  const [inputFieldPassword, setInputFieldPassword] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [inputFieldNormal, setInputFieldNormal] = useState({
    username: '',
    email: '',
    phone: '',
  })

  const handleOnChangeNormal = (e) => {
    setInputFieldNormal({
      ...inputFieldNormal,
      [e.target.name]: e.target.value,
    })
  }

  const handleOnChangePassword = (e) => {
    setInputFieldPassword({
      ...inputFieldPassword,
      [e.target.name]: e.target.value,
    })
  }

  // Updates user Details
  const showLoadingToast = () => {
    return toast.loading('Loading...', {
      position: 'top-center',
      duration: Infinity, // The toast will not automatically close
    })
  }

  const userLoginState = useLoginState()

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const { username, email, phone } = inputFieldNormal

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    const isValid = emailRegex.test(email)
    // console.log(isValid)
    if (!isValid) {
      toast.error('Invalid Email Format')
    }
    const loadingToastId = showLoadingToast()
    try {
      const response = await axios.patch(UpdateUser_API_URL, {
        username,
        email,
        phone,
      })

      toast.dismiss(loadingToastId)
      if (response.data.ENTER_OTP == true) {
        toast.success(response.data.message)

        // reset OR set user login state to NULL
        userLoginState.logout()

        navigate('/otp', { replace: true })
      } else {
        toast.success('Update Success')
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.log(error.response)
    }
  }

  // Updates password
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    const { confirm_password, new_password, old_password } = inputFieldPassword

    if (new_password === confirm_password) {
      // Validate alphanumeric password with a must Special character
      const alphanumericRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

      const isPasswordValid = alphanumericRegex.test(new_password)
      if (!isPasswordValid) {
        return toast.error(
          'Password must be alphanumeric and contain at least one special character'
        )
      }

      try {
        const response = await axios.patch(UpdateUser_API_URL, {
          old_password,
          new_password,
        })

        toast.success('Password Changed Successfully')
      } catch (error) {
        console.log(error)
        console.log(error.response)
        toast.error(error.response.data.message)
      }
    } else {
      toast.error('Password Doesnt Match')
    }
  }

  useEffect(() => {
    if (userData) {
      setInputFieldNormal({ ...userData })
    }
  }, [userData])

  if (!userData) {
    return (
      <div className='container my-3'>
        <div className='profile-details-card p-4'>
          <p className='mb-0'>Profile information is unavailable. Please refresh and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <section className='profile-details-layout'>
      <header className='profile-panel-heading'>
        <div>
          <span className='profile-eyebrow'>MEMBER DETAILS</span>
          <h2>Personal details</h2>
          <p>Your contact information and account security.</p>
        </div>
      </header>

      <div className='profile-details-grid'>
        <section className='profile-details-card profile-identity-card'>
          <img className='profile-detail-avatar' src='/clientprofile.png' alt='' />
          <span className='profile-member-label'>LIBRARY MEMBER</span>
          <h3>{userData.username || 'Reader'}</h3>
          <p>Account details are only visible to you.</p>
          <div className='profile-member-status'><i /> Active member</div>
        </section>

        <section className='profile-details-card profile-contact-card'>
          <span className='profile-nav-label'>CONTACT INFORMATION</span>
          <dl>
            <div>
              <dt>Email address</dt>
              <dd>{userData.email}</dd>
            </div>
            <div>
              <dt>Phone number</dt>
              <dd>{userData.phone || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Books accepted</dt>
              <dd>{userData.totalAcceptedBooks ?? 0}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className='profile-security-card'>
        <div>
          <span className='profile-security-kicker'>ACCOUNT SECURITY</span>
          <h3>Keep your details up to date</h3>
          <p>Update your contact information or choose a new password.</p>
        </div>
        <div className='profile-buttons'>
          <Button
            variant='primary'
            onClick={handleEditModalShow}
            className='profile-edit-button'
          >
            Edit personal details
          </Button>

          <Button
            variant='secondary'
            onClick={handlePasswordModalShow}
          >
            Change Password
          </Button>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={(e) => handleUpdateProfile(e)}>
            <Form.Group controlId='username'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                minLength={5}
                placeholder='Enter username'
                name='username'
                onChange={handleOnChangeNormal}
                value={inputFieldNormal.username}
                required
                autoComplete='off'
              />
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                autoComplete='off'
                placeholder='Enter email'
                name='email'
                value={inputFieldNormal.email}
                onChange={handleOnChangeNormal}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId='phone'>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type='tel'
                required
                placeholder='e.g. 01712345678'
                name='phone'
                value={inputFieldNormal.phone}
                onChange={handleOnChangeNormal}
                pattern='01[3-9]\d{8}'
                title='Enter an 11-digit Bangladesh mobile number starting with 013-019.'
                minLength='11'
                maxLength='11'
                autoComplete='tel'
                inputMode='numeric'
              />
            </Form.Group>

            <Form.Group className='text-center my-2'>
              <button type='submit' className='btn btn-success'>
                Update
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleEditModalClose}>
            Go Back
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showChangePasswordModal}
        onHide={handlePasswordModalClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={(e) => handleUpdatePassword(e)}>
            <Form.Group controlId='old password'>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type='password'
                minLength={5}
                required
                placeholder='Enter old password'
                name='old_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.old_password}
              />
            </Form.Group>

            <Form.Group controlId='new password'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                required
                minLength={5}
                type='password'
                placeholder='Enter new password'
                name='new_password'
                onChange={handleOnChangePassword}
                value={inputFieldPassword.new_password}
              />
            </Form.Group>

            <Form.Group controlId='confirm password'>
              <Form.Label>Confirm new Password</Form.Label>
              <div className='password-field'>
                <Form.Control
                  type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                  required
                  minLength={5}
                  placeholder='Re-enter new Password'
                  name='confirm_password'
                  onChange={handleOnChangePassword}
                  value={inputFieldPassword.confirm_password}
                />
                <span
                  onClick={() =>
                    setShowPassword((prevShowPassword) => !prevShowPassword)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </span>
              </div>
            </Form.Group>

            <Form.Group className='text-center my-2'>
              <button type='submit' className='btn btn-success'>
                Update
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handlePasswordModalClose}>
            Go Back
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}

export default ClientDetails
