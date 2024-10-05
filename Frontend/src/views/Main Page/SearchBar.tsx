import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './searchbar.css';
import CustomInput from './CustomInput';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDateChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
    };

    const handleAdultsChange = (increment: boolean) => {
        setAdults(prev => increment ? prev + 1 : Math.max(1, prev - 1));
    };

    const handleChildrenChange = (increment: boolean) => {
        setChildren(prev => increment ? prev + 1 : Math.max(0, prev - 1));
    };

    return (
        <Form className="search-wrapper">
            <Row className='border-2 rounded-2'>
            <Col className="search-container rounded-1">
                <InputGroup>
                    <InputGroup.Text id="basic-addon1"><FaSearch color='#aaa'/></InputGroup.Text>
                    <Form.Control
                    style={{border: 'none'}}
                    placeholder={t('where_are_you_going')}
                    aria-label={t('where_are_you_going')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-describedby="basic-addon1"
                    />
                </InputGroup>
            </Col>
            <Col className="date-container rounded-1">
                <DatePicker
                    selected={startDate || undefined}  
                    onChange={handleDateChange}
                    startDate={startDate || undefined}  
                    endDate={endDate || undefined} 
                    selectsRange
                    customInput={
                        <CustomInput
                            value={`${startDate ? startDate.toLocaleDateString() : ''} - ${endDate ? endDate.toLocaleDateString() : ''}`}
                            onClick={() => {}}
                        />
                    }
                    cursor="pointer"
                />
            </Col>
            <Col className="counter-container">
                <div className="counter">
                    <i className="fas fa-user"></i>
                    <span>{t('adults')}: {adults}</span>
                    <button className="counter-button" onClick={() => handleAdultsChange(true)}>
                        <i className="fas fa-chevron-up"></i>
                    </button>
                    <button className="counter-button" onClick={() => handleAdultsChange(false)}>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div className="counter">
                    <i className="fas fa-child"></i>
                    <span>{t('children')}: {children}</span>
                    <button className="counter-button" onClick={() => handleChildrenChange(true)}>
                        <i className="fas fa-chevron-up"></i>
                    </button>
                    <button className="counter-button" onClick={() => handleChildrenChange(false)}>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                </div>
            </Col>
            <div className='col col-auto search-container submit-btn'>
                <button type='submit' className="btn-custom">{t('search')}</button>
            </div>
            </Row>
        </Form>
    );
};

export default SearchBar;