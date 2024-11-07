import AmadeusService from "../../services/AmadeusService";
import { useAppContext } from "../../AppContext";
import FlightsSearchBar from "../../components/FlightsSearchBar";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FlightCard from "../../components/Cards/FlightCard";
import FilterBy from "../../components/FilterBy/FilterBy";
import { useAppDispatch } from "../../store/hooks";
import { selectFlightOffer } from "../../store/flightSlice";

export default function FlightsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currency } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [filtercomponent, setFilterComponents] = useState({
        Price: {
            type: "slider",
            min: 0,
            max: 0
        }
    });
    const [sortBy, setSortBy] = useState("topPicks"); // State for sort by selection
    const [filter, setFilter] = useState({
        Price: `${filtercomponent.Price.min}-${filtercomponent.Price.max}`
    });
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState<any[]>([]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
    };

    const handleFilterChange = (filterData: { [key: string]: any }) => {
        setFilter({
            Price: filterData.price || `${filtercomponent.Price.min}-${filtercomponent.Price.max}`,
            ...filterData
        });
    };

    const handleFilterSubmit = () => {
        setFilter(filter);
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
            setFilterComponents({
                Price: {
                    type: "slider",
                    min: Math.min(...flightData.data.map((flight: any) => flight.price.total)),
                    max: Math.max(...flightData.data.map((flight: any) => flight.price.total))
                }
            })
            setFilter({
                Price: `${Math.min(...flightData.data.map((flight: any) => flight.price.total))}-${Math.max(...flightData.data.map((flight: any) => flight.price.total))}`,
            });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const filterFlights = () => {
            const filtered = flights.filter((flight: any) => {
                if (filter.Price) {
                    const [min, max] = filter.Price.split("-").map(Number); // Parse min and max as numbers
                    if (flight.price.total < min || flight.price.total > max) {
                        return false;
                    }
                }
                return true;
            });
            setFilteredFlights(filtered);
        };
        filterFlights();
    }, [filter.Price, flights]);

    const handleBookingClick = (flightData: any) => {
        dispatch(selectFlightOffer(flightData));
        navigate("/flights/booking");
    }

    return (
        <>
            <div className="bg-main p-4">
                <Container>
                    <FlightsSearchBar onSubmit={handleSearchSubmit} />
                </Container>
            </div>
            <Container fluid>
                <Row>
                    {/* Filter and sort section */}
                    {flights.length > 0 && (
                        <Col sm={12} md={3} lg={3} className="px-0">
                            <FilterBy filterOptions={filtercomponent} onFilterChange={handleFilterChange} />
                        </Col>
                    )}
                    {/* Flight results section */}
                    <Col sm={12} md={9} lg={8}>
                        <Row className="m-1">
                            {filteredFlights.map((flightData: any, index: number) => (
                                <Col md={12} className="mt-2">
                                    <FlightCard key={index} flightData={flightData} bookButton={true} onClick={()=>handleBookingClick(flightData)} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}