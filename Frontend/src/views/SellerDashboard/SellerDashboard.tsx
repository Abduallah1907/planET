import TopBar from "../../components/TopBar/TopBar";
import Icon from "../../assets/icon.png"; // Add this line to import the Icon
import { Container } from "react-bootstrap";
import SearchBar from "../../components/SearchBar/SearchBar";
import StatisticsCardss from "./StatisticsCardss";
import UserCoverageChartt from "./UserCoverageChartt";
import OrdersTable from "./OrdersTable";
import Icon1 from '../../assets/IconCircle.svg';

const SellerDashboard = () => {
    return (
        <div>
            <TopBar />
            <Container className='text-center'>
            <div className="welcome-container mt-5">
                    <h2>Welcome to <span className="orange-text">PlanET</span></h2>
                    <img
                        src={Icon1}
                        width={60}
                        height={60}
                        alt="Icon"
                        className="icon"
                        justify-content="right"
                    />

                </div> 
                <h1 className='dash mt-3'>Dashboard</h1>
                <div>
                    <SearchBar/>
                </div>
                <div className="statistics-cards">
                    <StatisticsCardss />
                </div>
                <div className="userCoverage">
                    <UserCoverageChartt />
                </div>
                <div className="TripDetails"> 
                    <OrdersTable/>
                </div>

            </Container>
        </div>
    );
};
export default SellerDashboard;