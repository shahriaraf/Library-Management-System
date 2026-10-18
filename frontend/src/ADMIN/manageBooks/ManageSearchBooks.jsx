import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { backend_server } from '../../main'

const ManageSearchBooks = ({
  setAllBooks,
  bookCategories,
  fetchData,
  setFilterActive,
  resetPagination,
}) => {
  const API_URL = `${backend_server}/api/v1/filter`

  const empty_field = {
    title: '',
    category: '',
    featured: '',
    available: '',
  }

  const [filterFields, setFilterFields] = useState(empty_field)

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (JSON.stringify(filterFields) === JSON.stringify(empty_field)) {
      setFilterActive(false)
      resetPagination()
      fetchData(1)
      return false
    }
    const { title, category, featured, available } = filterFields
    try {
      const response = await axios.get(API_URL, {
        params: {
          title,
          category,
          featured,
          available,
        },
      })

      setAllBooks(response.data.data)
      setFilterActive(true)
    } catch (error) {
      console.error('Error filtering books:', error)
      toast.error('Unable to search books. Please try again.')
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setFilterFields({ ...filterFields, [name]: value })
  }

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value
    setFilterFields({ ...filterFields, category: selectedCategory })
  }
  const handleFeaturedChange = (e) => {
    const selectedFeatured = e.target.value
    setFilterFields({ ...filterFields, featured: selectedFeatured })
  }
  const handleAvailableChange = (e) => {
    const selectedAvailable = e.target.value
    setFilterFields({ ...filterFields, available: selectedAvailable })
  }

  // TODO : Handle Clear Form Filter
  const handleClearFilters = () => {
    setFilterFields(empty_field)
    setFilterActive(false)
    resetPagination()
    fetchData(1)
  }

  return (
    <div className='container '>
      <div className='row'>
        <div className='col-md-10'>
          <form
            onSubmit={handleFormSubmit}
            className='form-inline d-flex justify-content-center'
          >
            {/* Search Filter */}
            <input
              type='text'
              className='form-control mx-1'
              autoComplete='off'
              placeholder='Search by title . . .'
              name='title'
              value={filterFields.title}
              onChange={handleOnChange}
            />

            {/* Category Filter */}
            <select
              id='categorySelect'
              className='form-control mx-1'
              value={filterFields.category}
              onChange={handleCategoryChange}
            >
              <option key='' value=''>
                Categories
              </option>
              {bookCategories.map((books_category) => {
                return (
                  <option key={books_category} value={books_category}>
                    {books_category}
                  </option>
                )
              })}
            </select>

            {/* Featured Filter */}
            <select
              id='featuredSelect'
              className='form-control mx-1'
              value={filterFields.featured}
              onChange={handleFeaturedChange}
            >
              <option key='' value=''>
                Featured
              </option>
              <option key='true' value='true'>
                Yes-Featured
              </option>
              <option key='false' value='false'>
                Not-Featured
              </option>
            </select>

            {/* Available Filter */}
            <select
              id='availableSelect'
              className='form-control mx-1'
              value={filterFields.available}
              onChange={handleAvailableChange}
            >
              <option key='' value=''>
                Available
              </option>
              <option key='true' value='true'>
                Yes-Available
              </option>
              <option key='false' value='false'>
                Not-Available
              </option>
            </select>

            <div
              className='col-xl-2 text-center d-flex '
              style={{ width: 'fit-content' }}
            >
              <button
                type='submit'
                className='btn btn-success mx-1 my-1'
              >
                Search
              </button>

              {/* Clear FORM Filter BTN */}
              <button
                type='button'
                className='btn btn-danger mx-1 my-1'
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default ManageSearchBooks
