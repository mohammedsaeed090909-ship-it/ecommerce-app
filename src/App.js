import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/Navbar';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Home from './pages/Home';
import ProductDetails from './pages/productDetails';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <AppNavbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/products/:id" element={<ProductDetails/>} />
      </Routes>      
      <Footer/>
    </div>
  );
}

export default App;