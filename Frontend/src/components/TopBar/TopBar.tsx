import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import "./topbar.css";
import Logo from '../../assets/LogoNoBackground.svg';
import { useNavigate } from 'react-router-dom';
import EgyptFlag from '../../assets/Egypt.webp';
import FranceFlag from '../../assets/FRANCE.webp';
import UKFlag from '../../assets/UK.webp';
import DeutschFlag from '../../assets/Deutsch.webp';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../AppContext';


const TopBar: React.FC = () => {
    const navigate = useNavigate();
    const { currentFlag, setCurrentFlag, currency, setCurrency } = useAppContext();
    const {i18n,t} = useTranslation();

    const handleFlagChange = (flag: string, language:string) => {
        setCurrentFlag(flag);
        setCurrentFlag(language);
        i18n.changeLanguage(language);  
    };
    const handleCurrencyChange = (currency: string) => {
        setCurrency(currency);
        
    };
    const getFlagImage = (flag: string) => {
        switch (flag) {
            case 'ar': return EgyptFlag;
            case 'fr': return FranceFlag;
            case 'en': return UKFlag;
            case 'de': return DeutschFlag;
            default: return UKFlag;
        }
    };

    const handleHelp = () => {
        navigate('/Help');
    };
    const handleRegister = () => {
        navigate('/Registeration');
    };
    const handleLogin = () => {
        navigate('/Login');
    };
    const handleJoinUs = () => {
        navigate('/JoinUs');
    };

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
                {/* Language Dropdown */}
                <Dropdown>
                    <Dropdown.Toggle className='btn-flag dropdown-toggle'>
                        <img src={getFlagImage(currentFlag)} alt="Current Flag" width="30" height="30" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#" onClick={() => handleFlagChange(EgyptFlag,'ar')}>
                            <img src={EgyptFlag} alt="Egypt Flag" width="30" height="30" /> Arabic
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => handleFlagChange(FranceFlag, 'fr')}>
                            <img src={FranceFlag} alt="France Flag" width="30" height="30" /> Français
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => handleFlagChange(UKFlag, 'en')}>
                            <img src={UKFlag} alt="UK Flag" width="30" height="30" /> English
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={() => handleFlagChange(DeutschFlag, 'de')}>
                            <img src={DeutschFlag} alt="Deutsch Flag" width="30" height="30" /> Deutsch
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Currency Dropdown */}
                <Dropdown className="currency-dropdown">
                    <Dropdown.Toggle className='btn-text btn-main dropdown-toggle'>{t(currency.toLowerCase())}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1" onClick={() => handleCurrencyChange('USD')}>{t('usd')}</Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={() => handleCurrencyChange('EUR')}>{t('eur')}</Dropdown.Item>
                        <Dropdown.Item href="#/action-3" onClick={() => handleCurrencyChange('EGP')}>{t('egp')}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Button variant="" onClick={handleHelp} className="btn-help btn-margin"></Button>
                <Button variant="" className="btn-text" onClick={handleJoinUs}>{t('join_us')}</Button>
                <Button variant="" onClick={handleRegister} className="btn-main">{t('register')}</Button>
                <Button variant="" onClick={handleLogin} className="btn-main btn-margin">{t('sign_in')}</Button>
            </div>
        </Navbar>
    );
};

export default TopBar;