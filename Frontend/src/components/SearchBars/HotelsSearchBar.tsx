import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
    Button,
    ButtonGroup,
    Col,
    Dropdown,
    DropdownButton,
    Form,
    FormGroup,
    Row,
} from "react-bootstrap";
import './flightsSearchBar.css';
import { BiChevronDown } from "react-icons/bi";
import { Utils } from "../../utils/utils";
import { FaExchangeAlt, FaMapPin } from "react-icons/fa";
import { IoMdAirplane, IoMdClose } from "react-icons/io";
import { IoFlag } from "react-icons/io5";
import SkyscannerService from "../../services/SkyscannerService";
import { Calendar, DateRange, Range } from "react-date-range";
import { format } from "date-fns";

interface Location {
    Type: string
    PlaceId: string;
    PlaceName: string;
    LocalizedPlaceName: string;
    IataCode: string;
    CountryId: string;
    CityId: string;
    CountryName: string;
    PlaceNameEn: string;
    RegionId: string;
    CityName: string;
    CityNameEn: string;
    GeoId: string;
    GeoContainerID: string;
    AirportInformation?: Location;
    Distance?: {
        Value: number;
        UnitCode: string;
    }
    Location: string;
    ResultingPhrase: string;
    UntransliteratedResultingPhrase: string;
    Highlighting: number[][];
}

interface HotelSearchBarProps {
    onSubmit?: (data: object, searchQuery: object) => void;
}

const HotelsSearchBar: React.FC<HotelSearchBarProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([
        null,
        null,
    ]);
    const [toDestination, settoDestination] = useState<string>("");
    const [toDestinationDisplayed, settoDestinationDisplayed] = useState<string>("");
    const [toDestinations, settoDestinations] = useState<Location[]>([]);
    const [toSelectedOption, settoSelectedOption] = useState<string>("");
    const [destinationDropdownOpen, setdestinationDropdownOpen] = useState<boolean>(false);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 992);
    const [checkInDate, checkOutDate] = dateRange;
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [rooms, setRooms] = useState<number>(1);

    const destinationDropdownRef = useRef<HTMLDivElement>(null);

    const toDestinationRef = useRef<HTMLInputElement>(null);
    const checkInDateRef = useRef<HTMLInputElement>(null);
    const checkOutDateRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            setIsMediumScreen(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDateChange = (update: [string | null, string | null]) => {
        setDateRange(update);
    };

    const handleDropdownInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const { name, value } = e.target as HTMLButtonElement;
        const valueInt = parseInt(value);
        if (isNaN(valueInt)) return;
        if ((name === "adults" || name === "rooms") && valueInt < 1) return;
        if (valueInt < 0 && name !== "adults") return;
        if (valueInt >= 9) return;
        switch (name) {
            case "adults":
                setAdults(valueInt);
                break;
            case "children":
                setChildren(valueInt);
                break;
            case "rooms":
                setRooms(valueInt);
                break;
            default:
                break;
        }
    }

    const getCities = async (keyword: string) => {
        try {
            const response = await SkyscannerService.searchLocations(keyword);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const debounce = (func: (...args: any[]) => void, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Debounce function
    const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
        const debouncedCallback = useCallback(debounce(callback, delay), [callback, delay]);
        return debouncedCallback;
    };

    const handleDestinationChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, setDestinations: React.Dispatch<React.SetStateAction<Location[]>>) => {
        e.stopPropagation();
        const { value } = e.target;
        if (setDestinations === settoDestinations) {
            settoDestinationDisplayed(value);
        }
        debouncedGetAirports(value, setDestinations);
    };

    const debouncedGetAirports = useDebounce(async (value, setDestinations) => {
        if (value === "") {
            if (setDestinations === settoDestinations) {
                settoDestination("");
                settoDestinations([]);
                setdestinationDropdownOpen(false);
            }
            return;
        }
        let locations = await getCities(value);
        if (setDestinations === settoDestinations) {
            settoDestinations(locations);
            if (locations.length > 0)
                setdestinationDropdownOpen(true)
            else
                setdestinationDropdownOpen(false);
        }
    }, 500);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                destinationDropdownRef.current &&
                !destinationDropdownRef.current.contains(event.target as Node)
            ) {
                setdestinationDropdownOpen(false);
            }
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)

            ) {
                setDatePickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const increment = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (value < 9) {
            setter(value + 1);
        }
    };

    const handleOptionSelect = (option: Location, setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (setDropdownVisible === setdestinationDropdownOpen) {
            settoDestinationDisplayed(Utils.capitalizeFirstLetter(option.PlaceName) + " (" + option.IataCode + ")");
            settoDestination(option.CityId.substring(0,3));
            settoSelectedOption(option.CityName ? `${Utils.capitalizeFirstLetter(option.CityName)}, ${Utils.capitalizeFirstLetter(option.CountryName)}` : `${Utils.capitalizeFirstLetter(option.CountryName)}`);
            setdestinationDropdownOpen(false);
        }
    };

    const decrement = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if ((setter === setAdults || setter === setRooms) && value === 1) return;
        if (value > 0) {
            setter(value - 1);
        }

    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>, field: string) => {
        switch (field) {
            case "from":
                settoDestination("");
                settoDestinationDisplayed("");
                settoDestinations([]);
                settoSelectedOption("");
                setdestinationDropdownOpen(false);
                break;
            case "checkIn":
                setDateRange([null, checkOutDate]);
                break;
            case "checkOut":
                setDateRange([checkInDate, null]);
                break;
        }
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Inside your component's render method
    const todayDate = getTodayDate();

    const handleDone = (e: any) => {
        e.preventDefault();
        if (!toDestination) {
            toDestinationRef.current?.focus();
            if (toDestinations.length > 0) {
                setdestinationDropdownOpen(true);
            }
            return;
        }
        if (!checkInDate) {
            checkInDateRef.current?.focus();
            return;
        }
        if (!checkOutDate) {
            checkOutDateRef.current?.focus();
            return;
        }

        const formData = {
            cityCode: toDestination,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adults: adults,
            //children: children,
            rooms: rooms,
        }
        if (onSubmit) {
            onSubmit(formData, formData);
        }
    };

    // date state
    const [range, setRange] = useState<Range[]>([
        {
            startDate: checkInDate ? new Date(checkInDate) : new Date(),
            endDate: checkOutDate ? new Date(checkOutDate) : new Date(),
            key: 'selection',
            color: "#d76f30"
        }
    ])

    return (
        <Form className="flights-search-container" onSubmit={handleDone}>
            <Row className="form-controls-row">
                <Col lg={3} md={4} sm={12} xs={12} className="col d-flex">
                    <Form.Group ref={destinationDropdownRef} className="w-100">
                        <Form.Label>Destination</Form.Label>
                        <Form.Control
                            ref={toDestinationRef}
                            type="text"
                            style={{ border: 'none' }}
                            placeholder={t('country_city_airport')}
                            aria-label={t('country_city_airport')}
                            value={toDestinationDisplayed}
                            onClick={() => { toDestinations.length > 0 && setdestinationDropdownOpen(true) }}
                            onChange={(e) => handleDestinationChange(e, settoDestinations)}
                            className="destination-input"
                            required
                        />
                        {destinationDropdownOpen && (
                            <Dropdown.Menu show={destinationDropdownOpen} className="w-auto p-0 airports-dropdown">
                                {toDestinations.map((option, index) => (
                                    <Dropdown.Item key={index} onClick={() => handleOptionSelect(option.AirportInformation ? option.AirportInformation : option, setdestinationDropdownOpen)}>
                                        <Row className="align-items-center">
                                            <Col xs={1} md={1} className="d-flex justify-content-center align-items-center p-0">
                                                {option.Type === 'CITY' ? <FaMapPin /> : (option.Type === 'COUNTRY' ? <IoFlag /> : <IoMdAirplane style={{ transform: "rotate(45deg)" }} />)}
                                            </Col>
                                            <Col xs={10} md={10} className="my-0 px-0">
                                                <Row>
                                                    <span className="ms-2 location-name">
                                                        {option.AirportInformation ? option.AirportInformation.PlaceName : option.PlaceName} ({option.AirportInformation ? option.AirportInformation.IataCode : option.IataCode})
                                                    </span>
                                                </Row>
                                                <Row>
                                                    <span className="ms-2 location-address">
                                                        {option.AirportInformation ? option.AirportInformation.Distance?.Value.toFixed(0) + " km from " : ""}
                                                        {option.Type === 'COUNTRY' ? option.CountryName : (option.CityName ? `${Utils.capitalizeFirstLetter(option.CityName)}, ${Utils.capitalizeFirstLetter(option.CountryName)}` : `${Utils.capitalizeFirstLetter(option.CountryName)}`)}
                                                    </span>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        )}
                    </Form.Group>
                    <div className={`w-auto d-flex align-items-center me-3 ${isSmallScreen && 'mb-2'}`}>
                        <Button variant="clear" onClick={(e) => handleClear(e, "from")}>
                            <IoMdClose strokeWidth={30} />
                        </Button>
                    </div>
                </Col>
                {isMediumScreen ? (
                    <Col xs={6} sm={6} md={4} className="col">
                        <FormGroup>
                            <Form.Label>{"Dates"}</Form.Label>
                            <Form.Control
                                ref={checkInDateRef}
                                type="text"
                                min={todayDate}
                                value={
                                    `${checkInDate ? format(new Date(checkInDate), 'dd MMM') : ''} - ${checkOutDate ? format(new Date(checkOutDate), 'dd MMM') : ''}`
                                }
                                placeholder={"Add date"}
                                onClick={() => setDatePickerOpen(true)}
                                onChange={(e) => handleDateChange([e.target.value, checkOutDate])}
                                required
                            />
                        </FormGroup>
                    </Col>
                ) : (
                    <>
                        <Col lg={2} md={2} className="col d-flex">
                            <FormGroup>
                                <Form.Label>Check-In</Form.Label>
                                <Form.Control
                                    ref={checkInDateRef}
                                    type="text"
                                    min={todayDate}
                                    value={checkInDate ? checkInDate : ''}
                                    onClick={() => setDatePickerOpen(true)}
                                    onChange={(e) => handleDateChange([e.target.value, checkOutDate])}
                                    placeholder="dd/mm/yyyy"
                                    required
                                />
                            </FormGroup>
                            <div className={`w-auto d-flex align-items-center ms-auto me-3`}>
                                <Button variant="clear" onClick={(e) => handleClear(e, "checkIn")}><IoMdClose strokeWidth={30} /></Button>
                            </div>
                        </Col>
                        <Col lg={2} md={2} className={`col d-flex`}>
                            <FormGroup>
                                <Form.Label>Check-Out</Form.Label>
                                <Form.Control
                                    ref={checkOutDateRef}
                                    type="text"
                                    min={todayDate}
                                    value={checkOutDate ? checkOutDate : ''}
                                    onClick={() => setDatePickerOpen(true)}
                                    onChange={(e) => handleDateChange([checkInDate, e.target.value])}
                                    placeholder="dd/mm/yyyy"
                                    required
                                />
                            </FormGroup>
                            <div className={`w-auto d-flex align-items-center ms-auto me-3`}>
                                <Button variant="clear" onClick={(e) => handleClear(e, "checkOut")}><IoMdClose strokeWidth={30} /></Button>
                            </div>
                        </Col>
                    </>
                )}
                <Col lg={3} md={4} sm={6} xs={6} className="col">
                    <FormGroup>
                        <Form.Label>Guests and rooms</Form.Label>
                        <DropdownButton
                            as={ButtonGroup}
                            title={`${adults === 1 && children === 0 ?
                                `${adults} Adult`
                                : `${adults + children} Travelers`}, ${rooms} Room${rooms > 1 ? 's' : ''}`
                            }
                            variant="outline-secondary"
                            id="travel-options-dropdown"
                            className="w-100 text-start"
                        >
                            <Dropdown.Item as="div">
                                <Row className="align-items-center">
                                    <Col>
                                        <label className="category-label">
                                            <Row>
                                                <span>Adults</span>
                                            </Row>
                                            <Row>
                                                <span>Aged 12+</span>
                                            </Row>
                                        </label>
                                    </Col>
                                    <Col className="d-flex align-content-center justify-content-end counter">
                                        <Button variant="outline-secondary"
                                            onClick={(e) => decrement(setAdults, adults, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={adults === 1}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="number"
                                            name="adults"
                                            className="text-center counter-input"
                                            step={1}
                                            min={1}
                                            value={adults}
                                            onChange={(e) => handleDropdownInputChange(e)}
                                            onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                                        />
                                        <Button variant="outline-secondary" className="above-input"
                                            onClick={(e) => increment(setAdults, adults, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={adults >= 9}
                                        >
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col>
                                        <label className="category-label">
                                            <Row>
                                                <span>{t("children")}</span>
                                            </Row>
                                            <Row>
                                                <span>Aged 2 to 12</span>
                                            </Row>
                                        </label>
                                    </Col>
                                    <Col className="d-flex align-content-center justify-content-end counter">
                                        <Button variant="outline-secondary"
                                            onClick={(e) => decrement(setChildren, children, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={children === 0}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="number"
                                            name="children"
                                            className="text-center counter-input"
                                            step={1}
                                            min={0}
                                            value={children}
                                            onChange={(e) => handleDropdownInputChange(e)}
                                            onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                                        />
                                        <Button variant="outline-secondary"
                                            onClick={(e) => increment(setChildren, children, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={children >= 9}
                                        >
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col>
                                        <label className="category-label">
                                            <Row>
                                                <span>Rooms</span>
                                            </Row>
                                            <Row>
                                                <span>Max 9 rooms</span>
                                            </Row>
                                        </label>
                                    </Col>
                                    <Col className="d-flex align-content-center justify-content-end counter">
                                        <Button variant="outline-secondary"
                                            onClick={(e) => decrement(setRooms, rooms, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={rooms === 1}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="number"
                                            name="rooms"
                                            className="text-center counter-input"
                                            step={1}
                                            min={0}
                                            value={rooms}
                                            onChange={(e) => handleDropdownInputChange(e)}
                                            onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                                        />
                                        <Button variant="outline-secondary"
                                            onClick={(e) => increment(setRooms, rooms, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={rooms >= 9}
                                        >
                                            +
                                        </Button>
                                    </Col>
                                </Row>

                                <Row className="d-grid gap-2">
                                    <Button variant="main-inverse" className="mt-3 text-center" onClick={handleDone}>
                                        Done
                                    </Button>
                                </Row>
                            </Dropdown.Item>
                        </DropdownButton>
                    </FormGroup>
                </Col>
                <Col lg md={12} sm={12} className="submit-btn col">
                    <Button variant="custom" type="submit" className="h-100">
                        {t("search")}
                    </Button>
                </Col>
            </Row >
            <div ref={datePickerRef}>
                {datePickerOpen && (
                    <DateRange
                        ranges={range}
                        minDate={new Date()}
                        moveRangeOnFirstSelection={false}
                        onChange={(item) => {
                            const startDate = item.selection.startDate ? new Date(item.selection.startDate.getTime() - item.selection.startDate.getTimezoneOffset() * 60000) : null;
                            const endDate = item.selection.endDate ? new Date(item.selection.endDate.getTime() - item.selection.endDate.getTimezoneOffset() * 60000) : null;
                            setRange([item.selection]);
                            if (startDate && endDate) {
                                handleDateChange([startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);
                            }
                        }}
                        months={2}
                        direction="horizontal"
                        className="calendarElement date-range"
                    />
                )}
            </div>
        </Form >
    );
};

export default HotelsSearchBar;