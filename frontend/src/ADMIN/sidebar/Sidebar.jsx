import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiBookOpen, FiGrid, FiPlusSquare, FiInbox, FiUsers, FiBook, FiRotateCcw, FiLogOut, FiSend } from 'react-icons/fi'
import { sidebarData } from './sidebarData'
import './sidebar.css'

const sidebarIcons = [FiGrid, FiBookOpen, FiPlusSquare, FiInbox, FiUsers, FiBook, FiSend, FiRotateCcw, FiLogOut]

const Sidebar = () => {
  return (
    <aside className='admin-sidebar'>
      <p className='admin-sidebar-label'>MENU</p>
      <ul className='admin-sidebar-list'>
        {sidebarData.map((panelItem, index) => {
          const Icon = sidebarIcons[index]
          return (
            <li className='admin-sidebar-item' key={panelItem.id}>
              <NavLink
                to={panelItem.url}
                end={panelItem.url === '/admin'}
                className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
              >
                <Icon aria-hidden='true' />
                <span>{panelItem.title}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
      <div className='admin-sidebar-footer'>
        <span className='admin-sidebar-footer-icon'><FiBookOpen /></span>
        <div><strong>Library workspace</strong><small>Manage your collection</small></div>
      </div>
    </aside>
  )
}

export default Sidebar
