import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './topbarlinks.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const TopBarLinks: React.FC = () => {
    const { t } = useTranslation();
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <div className="top-bar-links">
            <div className="links-bar">
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Destinations' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Destinations')}
                >
                    {t('destinations')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Hotels' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Hotels')}
                >
                    {t('hotels')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Flights' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Flights')}
                >
                    {t('flights')}
                </button>
                <button
                    className={`btn-custom-primary btn-rounded mx-2 ${activeButton === 'Bookings' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('Bookings')}
                >
                    {t('bookings')}
                </button>
            </div>
        </div>
    );
}

export default TopBarLinks;