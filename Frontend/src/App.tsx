import React from "react";
import TopBar from "./components/TopBar";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfileForm from "./components/ProfileForm/ProfileForm";

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<TopBar />} />
        <Route path="/editprofile" Component={ProfileForm} />
      </Routes>
  );
};

export default App;
