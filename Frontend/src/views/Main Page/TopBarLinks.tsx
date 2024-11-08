import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './topbarlinks.css';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import UserRoles from '../../types/userRoles';

const TopBarLinks: React.FC = () => {
    const { t } = useTranslation();
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const userRole = useAppSelector(state => state.user.role);
    const navigate = useNavigate();

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
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
                {(userRole === UserRoles.Admin || userRole === UserRoles.Seller || userRole === UserRoles.Tourist) && (
                    <button
                        className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Products' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('Products')}
                    >
                        {t('products')}
                    </button>
                )}
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Flights' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Flights')}
                >
                    {t('flights')}
                </button>
            </div>
        </div>
    );
}

export default TopBarLinks;