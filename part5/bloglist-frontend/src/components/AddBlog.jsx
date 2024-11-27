import { useState } from 'react'

const AddBlog = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog( {
      title: newTitle,
      author: newAuthor,
      url: newAuthor
    })
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                  title: <input value={newTitle} onChange={handleTitleChange} required/>
        </div>
        <div>
                  author: <input value={newAuthor} onChange={handleAuthorChange} required/>
        </div>
        <div>
                  url: <input value={newUrl} onChange={handleUrlChange} required/>
        </div>
        <div>
          <button type="submit" >create</button>
        </div>
      </form>
    </div>
  )
}

export default AddBlog