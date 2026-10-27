import React, { useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

const BooksRequests = () => {
  const Pending_Book_API_Url = `${backend_server}/api/v1/requestBooks`

  const [pendingBooks, setPendingBooks] = useState([])

  // Stored selected IssueStatus from FORM
  const [selectedStatuses, setSelectedStatuses] = useState({})
  const [isAnyBooksPending, setIsAnyBooksPending] = useState(true)

  const fetchPendingBooks = async () => {
    try {
      const response = await axios.get(Pending_Book_API_Url)

      // console.log(response)

      const requests = response.data.data || []
      setPendingBooks(requests)
      setIsAnyBooksPending(requests.length > 0)
    } catch (error) {
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchPendingBooks()

    const refreshRequests = () => fetchPendingBooks()
    const refreshInterval = window.setInterval(refreshRequests, 15000)
    window.addEventListener('focus', refreshRequests)

    return () => {
      window.clearInterval(refreshInterval)
      window.removeEventListener('focus', refreshRequests)
    }
  }, [])

  // FORM
  const handleFormSubmit = (e) => {
    e.preventDefault()
  }

  const handleFormUpdate = async (transactionId, currentStatus) => {
    try {
      await axios.patch(Pending_Book_API_Url, {
        id: transactionId,
        issueStatus: selectedStatuses[transactionId] || currentStatus,
      })
      toast.success('Update Success')
      await fetchPendingBooks()
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleSelectChange = (transactionId, e) => {
    setSelectedStatuses((statuses) => ({
      ...statuses,
      [transactionId]: e.target.value,
    }))
  }

  return (
    <div className='container mt-2'>
      <h1 className='h1 text-center'>Books Request's</h1>
      {isAnyBooksPending ? (
        pendingBooks.length > 0 ? (
          <div className='row mt-3'>
            <table className='table table-hover'>
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Username</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Book</th>
                  <th scope='col'>Status</th>
                  <th scope='col'> Update</th>
                </tr>
              </thead>

              <tbody>
                {pendingBooks.map((book, index) => {
                  const { _id, userEmail, bookTitle, issueStatus, username } =
                    book

                  return (
                    <tr key={_id}>
                      <th scope='row'>{index + 1}</th>
                      <td>{username}</td>
                      <td>{userEmail}</td>
                      <td>{bookTitle}</td>
                      <td>{issueStatus}</td>

                      <td>
                        <form className='d-flex' onSubmit={handleFormSubmit}>
                          <select
                            className='form-control mx-1'
                            value={selectedStatuses[_id] || issueStatus.toUpperCase()}
                            onChange={(e) => handleSelectChange(_id, e)}
                          >
                            <option key='PENDING' value='PENDING'>
                              PENDING
                            </option>
                            <option key='READY' value='READY'>
                              READY to PICK
                            </option>
                            <option key='ACCEPTED' value='ACCEPTED'>
                              ACCEPTED
                            </option>
                            <option key='CANCELLED' value='CANCELLED'>
                              CANCELLED
                            </option>
                          </select>
                          <button
                            type='button'
                            className='btn btn-success mx-1'
                            onClick={() => handleFormUpdate(_id, issueStatus)}
                          >
                            Update
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading ...</p>
        )
      ) : (
        <p className='p text-center my-3'>0 Book Requests</p>
      )}
    </div>
  )
}

export default BooksRequests
