import React from "react";
import TopBar from "./components/TopBar";
import CreateAdmin from "./views/CreateAdmin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CreateGoverner from "./views/CreateGoverner";
import BookingLayout from "./views/CreateActivities";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/admin" element={<CreateAdmin />} />
        <Route path="/governer" element={<CreateGoverner />} />
        <Route path="/test" element={<BookingLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
