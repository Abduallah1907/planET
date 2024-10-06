import StatisticsCards from './StatisticsCards';
import CountryCampaignTable from './CountryCampaignTable';
import './TourGuidedashboard.css';
import { Container } from 'react-bootstrap';
import Icon from '../../assets/IconCircle.svg';

const TourGuideDashboard = () => {
    return (
        <div>
            
            <Container className='text-center'>
                <h1 className='dash mt-2'>Dashboard</h1>
                <div className="welcome-container mt-5">
                    <h2>Welcome to <span className="orange-text">PlanET</span></h2>
                    <img
                        src={Icon}
                        width={60}
                        height={60}
                        alt="Icon"
                        className="icon"
                        justify-content="right"
                    />

                </div>
                <div className="statistics-cards">
                    <StatisticsCards />
                </div>
                <div className="country-campaign-table">
                    <CountryCampaignTable />
                </div>
            </Container>
        </div>
    );
};

export default TourGuideDashboard;