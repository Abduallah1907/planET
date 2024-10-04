import React from "react";
import TopBar from "./components/TopBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import CustomFormGroup from "./components/FormGroup";
import { Placeholder } from "react-bootstrap";
import TourGuideDashboard from "./views/TourGuideDashboard/TourGuidedashboard";
import AdminDashboard from "./views/AdminDashboard/AdminDashboard";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/editprofile" Component={ProfileForm} />
        <Route path='/TourGuidedashboard' element={<TourGuideDashboard />} />
        <Route path='/AdminDashboard' element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

