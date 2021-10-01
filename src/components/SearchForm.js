import React from 'react'
const SearchForm = (props) => {
  //const { query, setQuery, error } = useGlobalContext()
  return (
    <form className='search-form' onSubmit={(e) => e.preventDefault()}>
      <h2>search movies</h2>
      <input
        type='text '
        className='form-input'
        value={props.query}
        onChange={(e) => props.setQuery(e.target.value)}
      />
      
    </form>
  )
}

export default SearchForm

//{error.show && <div className='error'>{error.msg}</div>}