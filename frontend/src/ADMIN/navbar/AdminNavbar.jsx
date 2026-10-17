import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiCommand } from 'react-icons/fi'
import './navbar.css'

// Importing all Navbar data's i.e. title,logo,links,etc
import navbarData from './adminnavbardata'

const AdminNavbar = () => {
  const { navbarTitle, navbarImage } = navbarData
  const location = useLocation()
  const pageName = location.pathname.split('/').filter(Boolean).pop()
  const pageTitles = {
    admin: 'Overview',
    managebooks: 'Manage books',
    addnewbook: 'Add new book',
    booksrequests: 'Book requests',
    viewusers: 'View users',
    issuedbooks: 'Issued books',
    issuebooktouser: 'Issue a book',
    returnedbooks: 'Return due books',
    logout: 'Sign out',
    otp: 'Email verification',
    adminsignup: 'Create admin account',
  }
  const routePage = location.pathname.startsWith('/admin/managebooks/')
    ? 'Book details'
    : location.pathname.startsWith('/admin/viewusers/')
      ? 'Reader profile'
      : pageTitles[pageName]
  const currentPage = routePage || (pageName || 'Overview').replace(/[-_]/g, ' ')

  return (
    <header className='admin-navbar'>
      <div className='admin-brand'>
        <Link to='/admin' className='admin-brand-link'>
          <span className='admin-brand-mark'>
            <img src={navbarImage} alt='' />
          </span>
          <span className='admin-brand-copy'>
            <strong>{navbarTitle}</strong>
            <small>LIBRARY ADMINISTRATION</small>
          </span>
        </Link>
      </div>
      <div className='admin-topbar'>
        <div className='admin-page-context'>
          <span className='admin-context-icon'><FiCommand /></span>
          <div>
            <small>WORKSPACE / {currentPage.toUpperCase()}</small>
            <strong>{currentPage.replace(/([a-z])([A-Z])/g, '$1 $2')}</strong>
          </div>
        </div>
        <div className='admin-topbar-actions'>
          <span className='admin-avatar' aria-label='Administrator'>A</span>
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar
