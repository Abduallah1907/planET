import AmadeusService from "../../services/AmadeusService";
import { useAppContext } from "../../AppContext";
import { useEffect, useState } from "react";
import { Col, Container, Row, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FilterBy from "../../components/FilterBy/FilterBy";
import { useAppDispatch } from "../../store/hooks";
import HotelsSearchBar from "../../components/SearchBars/HotelsSearchBar";
import HotelCard from "../../components/Cards/HotelCard";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";

export default function HotelsPage() {
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

    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [progress, setProgress] = useState(0);

    const handleFilterChange = (filterData: { [key: string]: any }) => {
        setFilter({
            Price: filterData.price || `${filtercomponent.Price.min}-${filtercomponent.Price.max}`,
            ...filterData
        });
    };

    const handleSearchSubmit = async (data: any, searchQuery: any) => {
        setLoading(true); // Set loading to true
        setProgress(10); // Reset progress to 0
        try {
            data = { ...data, currencyCode: currency };
            const hotelData = await AmadeusService.searchHotels(data);
            setProgress(40); // Initial progress as loading starts
            if (hotelData.status === 500) {
                throw new Error("Internal Server Error");
            }
            if (hotelData.data && Array.isArray(hotelData.data)) { // Verify response is an array
                setHotels(hotelData.data);
                //dispatch(setFlightSearchQuery({ ...searchQuery, currencyCode: currency }));
                setProgress(60); // Initial progress as loading starts
            } else {
                setHotels([]);
            }
            setFilterComponents({
                Price: {
                    type: "slider",
                    min: Math.min(...hotelData.data.map((hotel: any) => hotel.offers[0].price.total)),
                    max: Math.max(...hotelData.data.map((hotel: any) => hotel.offers[0].price.total))
                }
            })
            setFilter({
                Price: `${Math.min(...hotelData.data.map((hotel: any) => hotel.offers[0].price.total))}-${Math.max(...hotelData.data.map((hotel: any) => hotel.offers[0].price.total))}`,
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
        const filterHotels = () => {
            const filtered = hotels.filter((hotel: any) => {
                if (filter.Price) {
                    const [min, max] = filter.Price.split("-").map(Number); // Parse min and max as numbers
                    if (hotel.offers[0].price.total < min || hotel.offers[0].price.total > max) {
                        return false;
                    }
                }
                return true;
            });
            setFilteredHotels(filtered);
        };
        filterHotels();
    }, [filter.Price, hotels]);

    const handleBookingClick = () => {
        showToastMessage("Hotel Booked Successfully", ToastTypes.SUCCESS);
    }

    return (
        <>
            <div className="bg-main p-4">
                <Container>
                    <HotelsSearchBar onSubmit={handleSearchSubmit} />
                </Container>
            </div>
            <Container fluid>
                <Row>
                    {/* Filter and sort section */}
                    <Col sm={12} md={12} lg={3} className="px-0">
                        {(hotels.length > 0 && !loading) && (
                            <FilterBy filterOptions={filtercomponent} onFilterChange={handleFilterChange} />
                        )}
                    </Col>
                    {/* Hotels results section */}
                    <Col sm={12} md={12} lg={8}>
                        {loading && (
                            <Row className="mt-3 m-1 d-flex justify-content-center">
                                <Col sm={12}>
                                    <ProgressBar variant="main" animated now={progress} />
                                </Col>
                            </Row>
                        )} {/* Render progress bar when loading */}
                        <Row className="m-1">
                            {filteredHotels.map((hotelData: any, index: number) => (
                                <Col md={12} className="mt-2">
                                    {/* <FlightCard key={index} flightData={flightData} bookButton={true} onClick={() => handleBookingClick(flightData)} /> */}
                                    <HotelCard key={index} hotelData={hotelData} onClick={handleBookingClick} bookButton={true} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}