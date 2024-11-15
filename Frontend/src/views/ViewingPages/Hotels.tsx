import AmadeusService from "../../services/AmadeusService";
import { useAppContext } from "../../AppContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row, ProgressBar, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FilterBy from "../../components/FilterBy/FilterBy";
import { useAppDispatch } from "../../store/hooks";
import HotelsSearchBar from "../../components/SearchBars/HotelsSearchBar";
import HotelCard from "../../components/Cards/HotelCard";
import showToastMessage from "../../utils/showToastMessage";
import { ToastTypes } from "../../utils/toastTypes";
import { AdvancedMarker, AdvancedMarkerAnchorPoint, Map, Marker } from "@vis.gl/react-google-maps";

export default function HotelsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currency, baseCurrency, getConvertedCurrencyWithSymbol } = useAppContext();
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
    const [center, setCenter] = useState({ lat: 0, lng: 0 });

    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [progress, setProgress] = useState(0);
    const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 992);
    const hotelRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            if (hotelData.status === 500) {
                throw new Error("Internal Server Error");
            }
            if (hotelData.data && Array.isArray(hotelData.data)) { // Verify response is an array
                setHotels(hotelData.data);
                //dispatch(setFlightSearchQuery({ ...searchQuery, currencyCode: currency }));
                // Calculate the center of all hotel points
                const latitudes = hotelData.data.map((hotel: any) => hotel.hotel.latitude);
                const longitudes = hotelData.data.map((hotel: any) => hotel.hotel.longitude);
                const avgLatitude = latitudes.reduce((sum: number, lat: number) => sum + lat, 0) / latitudes.length;
                const avgLongitude = longitudes.reduce((sum: number, lng: number) => sum + lng, 0) / longitudes.length;
                setCenter({ lat: avgLatitude, lng: avgLongitude });
                console.log(center);
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

    const hotelPrices = useMemo(() => {
        return hotels.length > 0 ? hotels.map((hotel: any) => {
            return getConvertedCurrencyWithSymbol(hotel.offers[0].price.total, baseCurrency, currency);
        }) : [];
    }, [hotels, currency, baseCurrency, getConvertedCurrencyWithSymbol]);

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
    }, [filter, hotels]);

    useEffect(() => {
        const handleResize = () => {
            setIsMediumScreen(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBookingClick = () => {
        showToastMessage("Hotel Booked Successfully", ToastTypes.SUCCESS);
    }

    const handleMarkerClick = (index: number) => {
        setSelectedHotel(index);
        hotelRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
                    {/* <Col sm={12} md={12} lg={2} className="px-0">
                        {(hotels.length > 0 && !loading) && (
                            <FilterBy filterOptions={filtercomponent} onFilterChange={handleFilterChange} />
                        )}
                    </Col> */}
                    {isMediumScreen && (
                        <Col sm={12} md={12} lg={4} className="px-4">
                            {(hotels.length > 0 && !loading) && (
                                <Card className="mt-3 p-1">
                                    <Map
                                        style={{ height: "400px" }}
                                        defaultCenter={center}
                                        defaultZoom={12}
                                        mapId={"HotelMap"}
                                    >
                                        {hotels.map((hotel: any, index) => (
                                            <AdvancedMarker
                                                position={{ lat: hotel.hotel.latitude, lng: hotel.hotel.longitude }}
                                                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                                                className={`map-price-pin`}
                                                clickable={true}
                                                onClick={() => handleMarkerClick(index)}
                                            >
                                                <button className={`map-price-button ${selectedHotel === index ? 'active' : ''}`}>
                                                    <span className="p-1 map-price-marker">
                                                        <span>{hotelPrices[index]}</span>
                                                    </span>
                                                    <div className="map-marker-arrow"></div>
                                                </button>
                                            </AdvancedMarker>
                                        ))}
                                    </Map>
                                </Card>
                            )}
                        </Col>
                    )}
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
                                <Col md={12} className="mt-2" ref={(el: HTMLDivElement | null) => hotelRefs.current[index] = el}>
                                    {/* <FlightCard key={index} flightData={flightData} bookButton={true} onClick={() => handleBookingClick(flightData)} /> */}
                                    <HotelCard key={index} hotelData={hotelData} onClick={handleBookingClick} bookButton={true} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    {!isMediumScreen && (
                        <Col lg={4} className="p-0">
                            {(hotels.length > 0 && !loading) && (
                                <div className="sticky-top mt-3">
                                    <Map
                                        style={{ height: "600px" }}
                                        defaultCenter={center}
                                        defaultZoom={12}
                                        mapId={"HotelMap"}
                                    >
                                        {hotels.map((hotel: any, index) => (
                                            <AdvancedMarker
                                                position={{ lat: hotel.hotel.latitude, lng: hotel.hotel.longitude }}
                                                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                                                className={`map-price-pin`}
                                                clickable={true}
                                                onClick={() => handleMarkerClick(index)}
                                            >
                                                <button className={`map-price-button ${selectedHotel === index ? 'active' : ''}`}>
                                                    <span className="p-1 map-price-marker">
                                                        <span>{hotelPrices[index]}</span>
                                                    </span>
                                                    <div className="map-marker-arrow"></div>
                                                </button>
                                            </AdvancedMarker>
                                        ))}
                                    </Map>
                                </div>
                            )}
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    )
}