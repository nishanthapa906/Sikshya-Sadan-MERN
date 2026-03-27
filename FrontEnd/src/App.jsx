import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';


import './index.css';

function App() {
    return (
     
            <Router>
              
                <main>
                    <AppRouter />
                </main>
                <Footer />
            </Router>
        
    );
}

export default App;
