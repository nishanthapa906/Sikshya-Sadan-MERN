import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';

import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <AppRouter />
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
