import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import SubSections from './pages/SubSections.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Categories from './pages/Categories.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Login from './pages/Login'
import Offers from './pages/offers.jsx'
const App = () => {
  return (
    <div>
      {/* Navbar خارج Routes */}
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/subSections' element={<SubSections />} />
        <Route path='/suppliers' element={<Suppliers />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
