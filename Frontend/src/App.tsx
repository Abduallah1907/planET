import React from "react";
import TopBar from "./components/TopBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import CustomFormGroup from "./components/FormGroup";
import { Placeholder } from "react-bootstrap";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/editprofile" Component={ProfileForm} />
      </Routes>
    </Router>
  );
};

export default App;
