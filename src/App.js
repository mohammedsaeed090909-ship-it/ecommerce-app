import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/Navbar';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Home from './pages/Home';
import ProductDetails from './pages/productDetails';
import Footer from './components/Footer';
import Login from './pages/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart/>} />
        <Route element={<ProtectedRoute/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>      
      <Footer/>
    </div>
  );
}

export default App;