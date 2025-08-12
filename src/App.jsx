import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login'
import Offers from './pages/Offers'
import Suppliers from './pages/Suppliers'
import SubSections from './pages/SubSections'

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
        <Route path='/suppliers' element={<Suppliers />} />
        

        <Route path='/not-found' element={<h1>Page Not Found</h1>} />
        <Route path='/error' element={<h1>Something went wrong</h1>} />
        <Route path='*' element={<h1>mwdwdjwedjwd</h1>} />
        <Route path='/subsections' element={<SubSections />} />
      </Routes>
    </div>
  )
}

export default App
