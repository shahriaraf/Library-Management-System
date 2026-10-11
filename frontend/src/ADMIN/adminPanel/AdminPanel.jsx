import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import './adminpanel.css'
import axios from 'axios'

import { GiBookshelf } from 'react-icons/gi'
import { FaUserFriends } from 'react-icons/fa'
import { GiBookPile } from 'react-icons/gi'
import { FiArrowUpRight, FiGitPullRequest } from 'react-icons/fi'
import { BiCategoryAlt } from 'react-icons/bi'
import { BsFillJournalBookmarkFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const AdminPanel = () => {
  const FetchInfo_API = `${backend_server}/api/v1/adminHomePageInfo`

  const [homepageData, setHomepageData] = useState({})

  const fetchData = async () => {
    try {
      const response = await axios.get(FetchInfo_API)
      setHomepageData(response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const stats = [
    { label: 'Total books', value: homepageData.totalBooks, icon: GiBookshelf, tone: 'violet', detail: 'In your collection' },
    { label: 'Issued books', value: homepageData.totalIssuedBooks, icon: GiBookPile, tone: 'blue', detail: 'Currently on loan' },
    { label: 'Book requests', value: homepageData.totalBookRequests, icon: FiGitPullRequest, tone: 'amber', detail: 'Awaiting attention' },
    { label: 'Registered users', value: homepageData.totalRegisteredUsers, icon: FaUserFriends, tone: 'green', detail: 'Reader accounts' },
    { label: 'Authors listed', value: homepageData.totalAuthors, icon: BsFillJournalBookmarkFill, tone: 'pink', detail: 'Across all books' },
    { label: 'Categories', value: homepageData.totalCategories, icon: BiCategoryAlt, tone: 'cyan', detail: 'Collection topics' },
  ]
  const actions = [
    { title: 'Manage collection', detail: 'Browse, filter and update books', url: '/admin/managebooks', icon: GiBookshelf },
    { title: 'Review requests', detail: 'Handle reader book requests', url: '/admin/booksrequests', icon: FiGitPullRequest },
    { title: 'Issue a book', detail: 'Assign a title to a reader', url: '/admin/issuebooktouser', icon: GiBookPile },
  ]

  return (
    <div className='admin-dashboard'>
      <section className='admin-welcome'>
        <div className='admin-welcome-copy'>
          <span className='admin-eyebrow'>YOUR LIBRARY AT A GLANCE</span>
          <h1>Good to see you, <span>Admin.</span></h1>
          <p>Here’s what’s happening across your library today.</p>
        </div>
        <div className='admin-welcome-art' aria-hidden='true'>
          <div className='admin-art-orbit admin-art-orbit-one' />
          <div className='admin-art-orbit admin-art-orbit-two' />
          <div className='admin-art-glow'><GiBookshelf /></div>
          <span className='admin-art-spark admin-art-spark-one'>✦</span>
          <span className='admin-art-spark admin-art-spark-two'>✧</span>
        </div>
      </section>

      <section className='admin-section'>
        <div className='admin-section-heading'>
          <div><span className='admin-eyebrow'>LIBRARY OVERVIEW</span><h2>Key metrics</h2></div>
          <span className='admin-live-tag'><i /> Live data</span>
        </div>
        <div className='admin-stats-grid'>
          {stats.map(({ label, value, icon: Icon, tone, detail }) => (
            <article className={`admin-stat-card tone-${tone}`} key={label}>
              <div className='admin-stat-top'>
                <span className='admin-stat-icon'><Icon /></span>
                <span className='admin-stat-dots' aria-hidden='true'>•••</span>
              </div>
              <strong className='admin-stat-value'>{value ?? <span className='admin-stat-loading'>—</span>}</strong>
              <span className='admin-stat-label'>{label}</span>
              <span className='admin-stat-detail'>{detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className='admin-section admin-quick-section'>
        <div className='admin-section-heading'>
          <div><span className='admin-eyebrow'>GET THINGS DONE</span><h2>Quick actions</h2></div>
        </div>
        <div className='admin-action-grid'>
          {actions.map(({ title, detail, url, icon: Icon }) => (
            <Link className='admin-action-card' to={url} key={url}>
              <span className='admin-action-icon'><Icon /></span>
              <span className='admin-action-copy'><strong>{title}</strong><small>{detail}</small></span>
              <FiArrowUpRight className='admin-action-arrow' />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminPanel
