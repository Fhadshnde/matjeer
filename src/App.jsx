import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Categories from './pages/Categories.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Login from './pages/Login.jsx'
import Offers from './pages/offers.jsx'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/suppliers' element={<Suppliers />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/offers' element={<Offers />} />
      </Routes>
    </div>
  )
}

export default App
