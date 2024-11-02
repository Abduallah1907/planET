import AmadeusService from "../../services/AmadeusService";
import { useAppContext } from "../../AppContext";
import FlightsSearchBar from "../../components/FlightsSearchBar";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FlightCard from "../../components/Cards/FlightCard";

export default function FlightsPage() {
    const navigate = useNavigate();
    const { currency } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filtercomponent, setfilterComponents] = useState({});
    const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
    const [filter, setFilter] = useState({});
    const [flights, setFlights] = useState([]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleFilterSubmit = () => {
        setfilterComponents(filter);
    };

    const handleSearchSubmit = async (data: object) => {
        try {
            data = { ...data, currencyCode: currency };
            const flightData = await AmadeusService.searchFlights(data);
            if (flightData.status == 500) {
                throw new Error("Internal Server Error");
            }
            if (flightData.data && Array.isArray(flightData.data)) { // Verify response is an array
                setFlights(flightData.data);
            } else {
                setFlights([]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="bg-main p-4">
                <Container>
                    <FlightsSearchBar onSubmit={handleSearchSubmit} />
                </Container>
            </div>
            <Container>
                {flights.map((flightData: any, index: number) => (
                    <FlightCard key={index} flightData={flightData} />
                ))}
            </Container>
        </>
    )
}