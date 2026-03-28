import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';

 import Footer from './components/Footer';


import './index.css';
import AppRouter from './components/AppRoutes';
import Navbar from './components/Navbar';

function App() {
    return (
     
            <Router>
              <Navbar />
                <main>
                    <AppRouter />
                </main>
                <Footer />
            </Router>
        
    );
}

export default App;
