import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { BsBook, BsClockHistory } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : '—'

const ClientDashboard = ({ userBookData }) => {
  const DELETE_BOOK_API = `${backend_server}/api/v1/requestBooks`

  const handleRemoveBook = async (transactionId, issueStatus) => {
    try {
      await axios.patch(DELETE_BOOK_API, {
        id: transactionId,
        issueStatus,
      })

      if (issueStatus === 'DELETE') {
        toast.success('Cancel Success')
      } else {
        toast.success('Removed Successfully')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Unable to update this request')
    }
  }

  return (
    <section className='profile-activity'>
      <header className='profile-panel-heading'>
        <div>
          <span className='profile-eyebrow'>YOUR LIBRARY</span>
          <h2>Reading activity</h2>
          <p>Requests, loans and returns, all in one place.</p>
        </div>
        <span className='profile-panel-mark'><BsBook aria-hidden='true' /></span>
      </header>

      {userBookData.length > 0 ? (
        <div className='profile-activity-table-wrap'>
          <table className='table table-hover profile-activity-table'>
            <thead>
              <tr>
                <th scope='col'>Book</th>
                <th scope='col'>Status</th>
                <th scope='col'>Requested</th>
                <th scope='col'>Due date</th>
                <th scope='col'>Return</th>
                <th scope='col'>Fine</th>
                <th scope='col'><span className='visually-hidden'>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {userBookData.map((book) => {
                const {
                  bookTitle,
                  _id,
                  issueStatus,
                  isReturned,
                  extraCharge,
                  issueDate,
                  returnDate,
                } = book
                const statusClass = String(issueStatus || 'unknown').toLowerCase()
                let action = null

                if (issueStatus === 'PENDING' || issueStatus === 'READY') {
                  action = {
                    label: 'Cancel',
                    status: 'DELETE',
                    className: 'profile-row-action is-cancel',
                  }
                } else if (issueStatus === 'RETURNED') {
                  action = {
                    label: 'Remove',
                    status: 'ALREADYRETURNED',
                    className: 'profile-row-action',
                  }
                } else if (issueStatus === 'CANCELLED') {
                  action = {
                    label: 'Remove',
                    status: 'ADMINCANCELLED',
                    className: 'profile-row-action',
                  }
                }

                return (
                  <tr key={_id}>
                    <td className='profile-book-title'>{bookTitle}</td>
                    <td><span className={`profile-status is-${statusClass}`}>{issueStatus}</span></td>
                    <td>{formatDate(issueDate)}</td>
                    <td>{formatDate(returnDate)}</td>
                    <td><span className={`profile-return-state${isReturned ? ' is-returned' : ''}`}>{isReturned ? 'Returned' : 'On loan'}</span></td>
                    <td className='profile-fine'>Nrs. {extraCharge || 0}</td>
                    <td className='profile-action-cell'>
                      {action && (
                        <button
                          type='button'
                          className={action.className}
                          onClick={() => handleRemoveBook(_id, action.status)}
                        >
                          {action.label}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='profile-empty-state'>
          <span className='profile-empty-icon'><BsClockHistory aria-hidden='true' /></span>
          <h3>Your reading list starts here</h3>
          <p>When you request a book, its pickup and return details will appear here.</p>
          <Link className='profile-browse-link' to='/books'>Browse the collection <span aria-hidden='true'>→</span></Link>
        </div>
      )}
    </section>
  )
}

export default ClientDashboard
