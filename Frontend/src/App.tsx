import React from "react";
import TopBar from "./components/TopBar/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import TouristReg from "./views/auth/TouristReg/TouristReg";

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/editprofile" element={<ProfileForm />} />
        <Route path="/tourist" element={<TouristReg />} />
      </Routes>
  );
};

export default App;
