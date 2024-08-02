import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Cart from './Pages/Cart.jsx';
import LoginLogup from './Pages/LoginLogup';
import Product from './Pages/Product';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
