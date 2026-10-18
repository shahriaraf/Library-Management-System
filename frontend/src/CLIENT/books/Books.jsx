import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../pagination/CustomPagination'
import SmallBanner from '../bannerHome/SmallBanner'
import PopularBooks from './PopularBooks'
import { backend_server } from '../../main'
import BrowseCollectionBooks from './BrowseCollectionBooks'
import toast from 'react-hot-toast'
import FilterBooksForm from './FilterBooksForm'

const Books = () => {
  const API_URL = `${backend_server}/api/v1/book`

  const [bookData, setBookData] = useState([])
  const [loading, setLoading] = useState(true)

  // if filterForm is active , disbale pagination else allow paginations
  const [filterActive, setFilterActive] = useState(false)
  const [paginationResetKey, setPaginationResetKey] = useState(0)

  const fetchData = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const resp = await axios.get(`${API_URL}?page=${pageNumber}`)
      const data = resp.data.data
      setBookData(data)
    } catch (error) {
      console.error('Error fetching books collections:', error)
      setBookData([])
      toast.error('Unable to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container'>
      {/* Popular Books Heading */}
      <div className='row'>
        <h1 className='h1 mt-3' style={{ textAlign: 'center' }}>
          Most borrowed
        </h1>

        {/* Popular Books */}
        <PopularBooks></PopularBooks>
      </div>

      {/* Into the Wild Banner */}
      <SmallBanner></SmallBanner>

      <div className='col mt-5 '>
        {/* Browse Collections HEADING */}
        <h1 className='h1' style={{ textAlign: 'center' }}>
          Browse the shelves
        </h1>

        <div className='mt-1'>
          {/* FILTER BOOKS SECTION */}
          <FilterBooksForm
            setBookData={setBookData}
            setFilterActive={setFilterActive}
            fetchData={fetchData}
            resetPagination={() => setPaginationResetKey((key) => key + 1)}
            setLoading={setLoading}
          ></FilterBooksForm>
        </div>

        {/* BROWSE COLLECTIONS BOOKS */}
        <BrowseCollectionBooks
          bookData={bookData}
          loading={loading}
        ></BrowseCollectionBooks>

        {/* Pagination */}
        <div className='my-3 d-flex justify-content-center'>
          <CustomPagination
            fetchData={fetchData}
            filterActive={filterActive}
            resetKey={paginationResetKey}
          ></CustomPagination>
        </div>
      </div>
    </div>
  )
}

export default Books
