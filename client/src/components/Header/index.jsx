import React from 'react'
import { Link } from 'react-router'
import './style.css'
function index() {
  return (
     <header>
        <nav>
          <Link to='/albums'>All Albums</Link>
          <Link to='/'>home</Link>
        </nav>
      </header>
  )
}

export default index