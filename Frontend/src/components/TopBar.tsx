import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import "./topbar.css";
import Logo from '../assets/LogoNoBackground.svg';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <Navbar className="top-bar" variant="dark">
            <Navbar.Brand href="#home" className="brand-container">
                <img
                    src={Logo}
                    width="150"
                    height="100"
                    className="align-top logo"
                    alt="Travel Agency logo"
                />
            </Navbar.Brand>
            <div className="button-container">
                <Button variant="" className='btn-flag'></Button>
                <Button variant="" className='btn-text'>EGP</Button>
                <Button variant="" className='btn-help btn-margin'></Button>
                <Button variant="" className='btn-text'>JOIN US</Button>
                <Button variant="" onClick={()=>navigate(`/Registeration`)} className="btn-main">Register</Button>
                <Button variant="" onClick={()=>navigate(`/Login`)} className="btn-main btn-margin">Sign In</Button>
            </div>
        </Navbar>
    );
};

export default TopBar;