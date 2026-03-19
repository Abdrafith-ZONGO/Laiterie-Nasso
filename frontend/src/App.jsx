import { BrowserRouter, Routes, Route } from 'react-router-dom';   
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';         
import Produits from './pages/Produits';       
import Histoire from './pages/Histoire';       
import Contact from './pages/Contact';
import Compte from './pages/Compte';
import Panier from './pages/Panier';


function App() {
  return (
    <BrowserRouter>
      <div className="bg-fond-page min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/histoire" element={<Histoire />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/compte" element={<Compte />} />
          </Routes>
        </main>
          <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;