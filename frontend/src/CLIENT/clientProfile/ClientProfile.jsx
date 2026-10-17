import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'
import ClientDashboard from './ClientDashboard'
import ClientDetails from './ClientDetails'
import ClientLogout from '../clientLogout/ClientLogout'
import { BsBook, BsBoxArrowRight, BsGrid, BsPerson } from 'react-icons/bs'
import './clientprofile.css'

const ClientProfile = () => {
  const getSingleUser_API_URL = `${backend_server}/api/v1/users/`

  const [userBookData, setUserBookData] = useState([])
  const [userData, setUserData] = useState()
  const [activeSection, setActiveSection] = useState('dashboard')

  const fetchData = async () => {
    try {
      const response = await axios.post(getSingleUser_API_URL, {})
      setUserBookData(response.data.bookDataAll || [])
      setUserData(response.data.userData)
    } catch (error) {
      console.log(error.response)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeLoans = userBookData.filter(
    (book) => book.issueStatus === 'ISSUED'
  ).length
  const pendingRequests = userBookData.filter(
    (book) => book.issueStatus === 'PENDING' || book.issueStatus === 'READY'
  ).length

  const sections = [
    { id: 'dashboard', label: 'Reading activity', Icon: BsGrid },
    { id: 'details', label: 'Personal details', Icon: BsPerson },
    { id: 'logout', label: 'Sign out', Icon: BsBoxArrowRight },
  ]

  return (
    <div className='client-profile-page'>
      <header className='profile-page-heading'>
        <div>
          <span className='profile-eyebrow'>MEMBER ACCOUNT</span>
          <h1>Your reading room</h1>
          <p>A quiet place to keep your library life in order.</p>
        </div>
        <div className='profile-member-note'>
          <span className='profile-member-mark' aria-hidden='true'>R</span>
          <div>
            <span className='profile-member-label'>SIGNED IN AS</span>
            <strong>{userData?.username || 'Reader'}</strong>
          </div>
        </div>
      </header>

      <section className='profile-stat-strip' aria-label='Library activity summary'>
        <div className='profile-stat'>
          <span className='profile-stat-icon'><BsBook aria-hidden='true' /></span>
          <div><strong>{userBookData.length}</strong><span>All requests</span></div>
        </div>
        <div className='profile-stat'>
          <span className='profile-stat-icon'><BsBook aria-hidden='true' /></span>
          <div><strong>{activeLoans}</strong><span>Currently borrowed</span></div>
        </div>
        <div className='profile-stat'>
          <span className='profile-stat-icon'><BsGrid aria-hidden='true' /></span>
          <div><strong>{pendingRequests}</strong><span>Awaiting collection</span></div>
        </div>
      </section>

      <div className='profile-workspace'>
        <aside className='profile-rail'>
          <section className='profile-member-card'>
            <img src='/clientprofile.png' alt='' />
            <span className='profile-member-label'>YOUR ACCOUNT</span>
            <h2>{userData?.username || 'Welcome, reader'}</h2>
            <p>{userData?.email || 'Your library account'}</p>
            <span className='profile-member-status'><i /> Active member</span>
          </section>

          <nav className='profile-navigation' aria-label='Account sections'>
            <span className='profile-nav-label'>YOUR SPACE</span>
            {sections.map(({ id, label, Icon }) => (
              <button
                key={id}
                type='button'
                className={`profile-nav-button${activeSection === id ? ' is-active' : ''}`}
                aria-pressed={activeSection === id}
                onClick={() => setActiveSection(id)}
              >
                <Icon aria-hidden='true' />
                <span>{label}</span>
                {id === 'dashboard' && <span className='profile-nav-count'>{userBookData.length}</span>}
              </button>
            ))}
          </nav>

          <p className='profile-rail-footnote'>A book is a good place to begin again.</p>
        </aside>

        <div className='profile-main-panel'>
          {activeSection === 'dashboard' && (
            <ClientDashboard userBookData={userBookData} />
          )}
          {activeSection === 'details' && (
            <ClientDetails userData={userData} />
          )}
          {activeSection === 'logout' && <ClientLogout />}
        </div>
      </div>
    </div>
  )
}

export default ClientProfile
