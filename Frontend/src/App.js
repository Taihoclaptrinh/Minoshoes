import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import { productInputs, userInputs, orderInputs } from "./formSource";

// Admin Components
import AdminNavbar from './Components/AdminNavbar/AdminNavbar';
import AdminSidebar from './Components/AdminSidebar/AdminSidebar';
import AdminHome from './Pages/AdminHome';
import AdminUserList from './Pages/AdminUserList';
import AdminProductList from './Pages/AdminProductList';
import AdminOrderList from './Pages/AdminOrderList';
import AdminSingle from './Pages/AdminSingle';
import AdminNew from './Pages/AdminNew';

// Shop Components
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart';
import LoginLogup from './Pages/LoginLogup';
import Product from './Pages/Product';
import UserInfo from './Pages/UserInfoPage';

// Admin App Component
const AdminApp = () => (
  <div className="AdminApp">
    <AdminNavbar />
    <div className="layout">
      <AdminSidebar />
      <div className="mainContent">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="users" element={<AdminUserList />}>
            <Route path=":userId" element={<AdminSingle />} />
            <Route path="new" element={<AdminNew inputs={userInputs} title="Add New User" />} />
          </Route>
          <Route path="products" element={<AdminProductList />}>
            <Route path=":productId" element={<AdminSingle />} />
            <Route path="new" element={<AdminNew inputs={productInputs} title="Add New Product" />} />
          </Route>
          <Route path="orders" element={<AdminOrderList />}>
            <Route path=":orderId" element={<AdminSingle />} />
            <Route path="new" element={<AdminNew inputs={orderInputs} title="Add New Order" />} />
          </Route>
        </Routes>
      </div>
    </div>
  </div>
);

// Shop App Component
const ShopApp = () => (
    <div className="ShopApp">
      <Navbar /> {/* Navbar no longer needs countCart prop */}
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/men' element={<ShopCategory category="men" />} />
        <Route path='/women' element={<ShopCategory category="women" />} />
        <Route path='/brands' element={<ShopCategory category="brands" />} />
        <Route path='/new-arrivals' element={<ShopCategory category="new-arrivals" />} />
        <Route path='/sale' element={<ShopCategory category="sale" />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginLogup />} />
        <Route path='/product' element={<Product />} />
        <Route path='/userinfo' element={<UserInfo />} />
      </Routes>
    </div>
);

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<ShopApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
