import AmadeusService from "../../services/AmadeusService";
import { useAppContext } from "../../AppContext";
import FlightsSearchBar from "../../components/SearchBars/FlightsSearchBar";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FlightCard from "../../components/Cards/FlightCard";
import FilterBy from "../../components/FilterBy/FilterBy";
import { useAppDispatch } from "../../store/hooks";
import { selectFlightOffer, setFlightSearchQuery } from "../../store/flightSlice";
import PlaneSVG from "../../assets/PlaneNoBackground.svg";
import "./viewingPages.css";
import Destinations from "../Main Page/Destinations";

export default function FlightsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currency } = useAppContext();
    const [filtercomponent, setFilterComponents] = useState({
        Price: {
            type: "slider",
            min: 0,
            max: 0
        }
    });
    const [filter, setFilter] = useState({
        Price: `${filtercomponent.Price.min}-${filtercomponent.Price.max}`
    });
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [progress, setProgress] = useState(0);

    const planeRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleAnimationEnd = () => {
            if (planeRef.current) {
                planeRef.current.style.display = "none";
            }
        };
        
        if (planeRef.current) {
            planeRef.current.addEventListener("animationend", handleAnimationEnd);
        }

        return () => {
            if (planeRef.current) {
                planeRef.current.removeEventListener("animationend", handleAnimationEnd);
            }
        };
    }, []);

    const handleFilterChange = (filterData: { [key: string]: any }) => {
        setFilter({
            Price: filterData.price || `${filtercomponent.Price.min}-${filtercomponent.Price.max}`,
            ...filterData
        });
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
    
        if (loading && progress < 100 && progress >= 10) {
            interval = setInterval(() => {
                setProgress(prevProgress => {
                    if (prevProgress < 100) {
                        return prevProgress + 5;
                    } else {
                        clearInterval(interval!);
                        return prevProgress;
                    }
                });
            }, 1000);
        }
    
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [loading]);

    const handleSearchSubmit = async (data: any, searchQuery: any) => {
        setLoading(true); // Set loading to true
        setProgress(10); // Reset progress to 0
        try {
            data = { ...data, currencyCode: currency };
            const flightData = await AmadeusService.searchFlights(data);
            setProgress(40); // Initial progress as loading starts
            if (flightData.status === 500) {
                throw new Error("Internal Server Error");
            }
            if (flightData.data && Array.isArray(flightData.data)) { // Verify response is an array
                setFlights(flightData.data);
                dispatch(setFlightSearchQuery({ ...searchQuery, currencyCode: currency }));
                setProgress(60); // Initial progress as loading starts
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
            setProgress(90); // Initial progress as loading starts
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false
            setProgress(100); // Initial progress as loading starts
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
            <img src={PlaneSVG} alt="Plane" className="plane-svg" width={"50"} ref={planeRef} />
                <Container>
                    <FlightsSearchBar onSubmit={handleSearchSubmit} />
                </Container>
            </div>
            <Container fluid>
                <Row>
                    {/* Filter and sort section */}
                    <Col sm={12} md={3} lg={3} className="px-0">
                        {(flights.length > 0 && !loading) && (
                            <FilterBy filterOptions={filtercomponent} onFilterChange={handleFilterChange} />
                        )}
                    </Col>
                    {/* Flight results section */}
                    <Col sm={12} md={9} lg={8}>
                        {loading && (
                            <Row className="mt-3 m-1 d-flex justify-content-center">
                                <Col sm={12}>
                                    <ProgressBar variant="main" animated now={progress} />
                                </Col>
                            </Row>
                        )} {/* Render progress bar when loading */}
                        <Row className="m-1">
                            {filteredFlights.map((flightData: any, index: number) => (
                                <Col md={12} className="mt-2">
                                    <FlightCard key={index} flightData={flightData} bookButton={true} onClick={() => handleBookingClick(flightData)} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
                {!loading && progress < 100 && (
                <div className="mt-3">
                <Destinations />
                </div>
                )}
            </Container>
        </>
    )
}