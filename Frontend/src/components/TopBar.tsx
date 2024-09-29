import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import "./topbar.css";
import Logo from '../assets/LogoNoBackground.svg';


const TopBar: React.FC = () => {
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
                <Button variant="" className="btn-main">Register</Button>
                <Button variant="" className="btn-main btn-margin">Sign In</Button>
            </div>
        </Navbar>
    );
};

export default TopBar;