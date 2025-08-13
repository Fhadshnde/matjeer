import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardStats from './pages/DashboardStats'
import ProductsManagement from './pages/ProductsManagement'
import CategoriesManagement from './pages/CategoriesManagement'
import Navbar from './components/Navbar/Navbar'
import Login from './pages/Login'
import OffersManagement from './pages/OffersManagement'
import Suppliers from './pages/SubSections'
import SuppliersManagement from './pages/SuppliersManagement'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<DashboardStats />} />
        <Route path='/products' element={<ProductsManagement />} />
        <Route path='/Categories' element={<CategoriesManagement />} />
        <Route path='/login' element={<Login />} />
        <Route path='/offers' element={<OffersManagement />} />
        <Route path='/suppliers' element={<Suppliers />} />
        

        <Route path='/not-found' element={<h1>Page Not Found</h1>} />
        <Route path='/error' element={<h1>Something went wrong</h1>} />
        <Route path='*' element={<h1>mwdwdjwedjwd</h1>} />
        <Route path='/subsections' element={<SuppliersManagement />} />
      </Routes>
    </div>
  )
}

export default App
