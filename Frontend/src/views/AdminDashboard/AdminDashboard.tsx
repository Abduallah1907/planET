import Icon from "../../assets/icon.png"; // Add this line to import the Icon
import { Container } from "react-bootstrap";
import UserCoverageChart from "./UserCoverageChart";
import TripDetailsTable from "./TripDetailsTable";
import StatisticsCards from "./StatisticsCards";
import SearchBar from "../../components/SearchBar/SearchBar";

const AdminDashboard = () => {
    return (
        <div>
            
            <Container className='text-center'>
                <h1 className='dash mt-3'>Dashboard</h1>
                <div>
                    <SearchBar/>
                </div>
                <div className="statistics-cards">
                    <StatisticsCards />
                </div>
                <div className="userCoverage">
                    <UserCoverageChart />
                </div>
                <div className="TripDetails"> 
                    <TripDetailsTable/>
                </div>

            </Container>
        </div>
    );
};
export default AdminDashboard;