import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/ProductsManagement.jsx'
import Categories from './pages/CategoriesManagement.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import Login from './pages/Login.jsx'
import Offers from './pages/OffersManagement.jsx'
import SubSections from './pages/SubSections.jsx'
import Discounts from './pages/Discounts.jsx'

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/subSections' element={<SubSections />} />
        <Route path='/discounts' element={<Discounts />} />
        <Route path='*' element={<h1>mwdwdjwedjwd</h1>} />

      </Routes>
    </div>
  )
}

export default App