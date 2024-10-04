import React from 'react';
import TopBar from './components/TopBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TopBarLinks from './views/Main Page/TopBarLinks';
import SearchBar from './views/Main Page/SearchBar';
import HeroSection from './views/Main Page/Hero'
import Services from './views/Main Page/Services'
import Destinations from './views/Main Page/Destinations'

const Home: React.FC = () => {
  return (
    <>
      <div>
        <TopBar />
        <TopBarLinks />
      </div>
      <div className="search-bar">
        <SearchBar />
      </div>
      <div>
        <HeroSection />
      </div>
      <div>
        <Services />
      </div>
      <div>
        <Destinations />
      </div>

    </>
  );
}

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;
