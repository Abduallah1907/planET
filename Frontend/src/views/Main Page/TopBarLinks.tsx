import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './topbarlinks.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import UserRoles from '../../types/userRoles';
import { Col, Row } from 'react-bootstrap';

const TopBarLinks: React.FC = () => {
    const { t } = useTranslation();
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const userRole = useAppSelector(state => state.user.role);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route

    useEffect(() => {
        setActiveBasedOnCurrentRoute();
    }, [location]);

    const setActiveBasedOnCurrentRoute = () => {
        switch (location.pathname.toLowerCase()) {
            case '/activity':
                setActiveButton('Activities');
                break;
            case '/itinerary':
                setActiveButton('Itineraries');
                break;
            case '/historical':
                setActiveButton('Historical_Locations');
                break;
            case '/products':
                setActiveButton('Products');
                break;
            case '/flights':
                setActiveButton('Flights');
                break;
            case '/hotels':
                setActiveButton('Hotels');
                break;
            default:
                setActiveButton(null);
                break;
        }
    }

    const handleButtonClick = (buttonName: string) => {
        setActiveBasedOnCurrentRoute();
        switch (buttonName) {
            case 'Activities':
                navigate('/Activity');
                break;
            case 'Itineraries':
                navigate('/Itinerary');
                break;
            case 'Historical_Locations':
                navigate('/Historical');
                break;
            case 'Products':
                navigate('/Products');
                break;
            case 'Flights':
                navigate('/Flights');
                break;
            case 'Hotels':
                navigate('/Hotels');
                break;
            default:
                break;
        }
    };

    return (
        <div className="top-bar-links">
            <Row className="links-bar">
                <Col className="d-flex justify-content-center">
                    <button
                        className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Activities' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Activities')}
                    >
                        {t('activities')}
                    </button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <button
                        className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Itineraries' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Itineraries')}
                    >
                        {t('itineraries')}
                    </button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <button
                        className={`btn-custom-primary btn-rounded text-nowrap mx-2 ${activeButton === 'Historical_Locations' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Historical_Locations')}
                    >
                        {t('historical_locations')}
                    </button>
                </Col>

                {(userRole === UserRoles.Admin || userRole === UserRoles.Seller || userRole === UserRoles.Tourist) && (
                    <Col className="d-flex justify-content-center">
                        <button
                            className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Products' ? 'active' : ''}`}
                            onClick={() => handleButtonClick('Products')}
                        >
                            {t('products')}
                        </button>
                    </Col>
                )}
                <Col className="d-flex justify-content-center">
                    <button
                        className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Flights' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Flights')}
                    >
                        {t('flights')}
                    </button>
                </Col>
                <Col className="d-flex justify-content-center">
                    <button
                        className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Hotels' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Hotels')}
                    >
                        {t('hotels')}
                    </button>
                </Col>
            </Row>
        </div>
    );
}

export default TopBarLinks;