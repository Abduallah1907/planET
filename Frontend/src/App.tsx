import React from 'react';
import TopBar from './components/TopBar';
import { BrowserRouter as Router ,Route , Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} />
      </Routes>
    </Router>

  );
}

export default App;
