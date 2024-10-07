import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './topbarlinks.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const TopBarLinks: React.FC = () => {
    const { t } = useTranslation();
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
        switch(buttonName) {
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
                navigate('/products');
                break;
            default:
                break;
        }
    };

    return (
        <div className="top-bar-links">
            <div className="links-bar">
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Activities' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Activities')}
                >
                    {t('activities')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Itineraries' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Itineraries')}
                >
                    {t('itineraries')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Historical_Locations' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Historical_Locations')}
                >
                    {t('historical_locations')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Products' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Products')}
                >
                    {t('products')}
                </button>
            </div>
        </div>
    );
}

export default TopBarLinks;