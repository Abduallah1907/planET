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
import { Utils } from "../utils/utils";
import { FaExchangeAlt, FaMapPin } from "react-icons/fa";
import { IoMdAirplane, IoMdClose } from "react-icons/io";
import { IoFlag } from "react-icons/io5";
import SkyscannerService from "../services/SkyscannerService";
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

interface FlightSearchBarProps {
    onSubmit?: (data: object, searchQuery: object) => void;
}

const FlightsSearchBar: React.FC<FlightSearchBarProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const directionButtons = ["oneWay", "roundTrip"]
    const [flightDirection, setFlightDirection] = useState(0);

    const [dateRange, setDateRange] = useState<[string | null, string | null]>([
        null,
        null,
    ]);
    const [fromDestination, setFromDestination] = useState<string>("");
    const [fromDestinationDisplayed, setFromDestinationDisplayed] = useState<string>("");
    const [fromDestinations, setFromDestinations] = useState<Location[]>([]);
    const [fromSelectedOption, setFromSelectedOption] = useState<string>("");
    const [fromDropdownOpen, setFromDropdownOpen] = useState<boolean>(false);

    const [toDestination, setToDestination] = useState<string>("");
    const [toDestinationDisplayed, setToDestinationDisplayed] = useState<string>("");
    const [toDestinations, setToDestinations] = useState<Location[]>([]);
    const [toSelectedOption, setToSelectedOption] = useState<string>("");
    const [toDropdownOpen, setToDropdownOpen] = useState<boolean>(false);

    const [isRotated, setIsRotated] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 992);
    const [departureDate, returnDate] = dateRange;
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [infants, setInfants] = useState<number>(0);
    const [travelClass, setTravelClass] = useState<keyof typeof classOptions>('ECONOMY');
    const classOptions = {
        'ECONOMY': 'Economy',
        'PREMIUM_ECONOMY': 'Premium Economy',
        'BUSINESS': 'Business Class',
        'FIRST': 'First Class'
    }

    const [nonStop, setNonStop] = useState<boolean>(false);

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);

    const fromDestinationRef = useRef<HTMLInputElement>(null);
    const toDestinationRef = useRef<HTMLInputElement>(null);
    const departureDateRef = useRef<HTMLInputElement>(null);
    const returnDateRef = useRef<HTMLInputElement>(null);
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
        if (name === "adults" && valueInt < 1) return;
        if (valueInt < 0 && name !== "adults") return;
        if (valueInt > 9) return;
        switch (name) {
            case "adults":
                setAdults(valueInt);
                break;
            case "children":
                setChildren(valueInt);
                break;
            case "infants":
                setInfants(valueInt);
                break;
            default:
                break;
        }
    }

    const getLocations = async (keyword: string) => {
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
        if (setDestinations === setFromDestinations) {
            setFromDestinationDisplayed(value);
        } else {
            setToDestinationDisplayed(value);
        }
        debouncedGetAirports(value, setDestinations);
    };

    const debouncedGetAirports = useDebounce(async (value, setDestinations) => {
        if (value === "") {
            if (setDestinations === setFromDestinations) {
                setFromDestination("");
                setFromDestinations([]);
                setFromDropdownOpen(false);
            } else {
                setToDestination("");
                setToDestinations([]);
                setToDropdownOpen(false);
            }
            return;
        }
        const locations = await getLocations(value);
        if (setDestinations === setFromDestinations) {
            setFromDestinations(locations);
            if (locations.length > 0)
                setFromDropdownOpen(true)
            else
                setFromDropdownOpen(false);
            setToDropdownOpen(false);
        } else {
            setToDestinations(locations);
            if (locations.length > 0)
                setToDropdownOpen(true)
            else
                setToDropdownOpen(false);
            setFromDropdownOpen(false);
        }
    }, 500);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                fromDropdownRef.current &&
                !fromDropdownRef.current.contains(event.target as Node)
            ) {
                setFromDropdownOpen(false);
            }
            if (
                toDropdownRef.current &&
                !toDropdownRef.current.contains(event.target as Node)
            ) {
                setToDropdownOpen(false);
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

    const handleClassChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.stopPropagation();
        const { value } = e.target
        setTravelClass(value as keyof typeof classOptions);
    }

    const increment = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (value < 8) {
            setter(value + 1);
        }
    };

    const handleOptionSelect = (option: Location, setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (setDropdownVisible === setFromDropdownOpen) {
            setFromDestinationDisplayed(Utils.capitalizeFirstLetter(option.PlaceName) + " (" + option.IataCode + ")");
            setFromDestination(option.IataCode);
            setFromSelectedOption(option.CityName ? `${Utils.capitalizeFirstLetter(option.CityName)}, ${Utils.capitalizeFirstLetter(option.CountryName)}` : `${Utils.capitalizeFirstLetter(option.CountryName)}`);
            setFromDropdownOpen(false);
        }
        else {
            setToDestinationDisplayed(Utils.capitalizeFirstLetter(option.PlaceName) + " (" + option.IataCode + ")");
            setToDestination(option.IataCode);
            setToSelectedOption(option.CityName ? `${Utils.capitalizeFirstLetter(option.CityName)}, ${Utils.capitalizeFirstLetter(option.CountryName)}` : `${Utils.capitalizeFirstLetter(option.CountryName)}`);
            setToDropdownOpen(false);
        }
    };

    const decrement = (
        setter: React.Dispatch<React.SetStateAction<number>>,
        value: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation(); // Prevent dropdown from closing
        if (setter === setAdults && value === 1) return;
        if (value > 0) {
            setter(value - 1);
        }

    };

    const handleSwapClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsRotated(!isRotated);
        const temp = fromDestination;
        setFromDestination(toDestination);
        setToDestination(temp);
        const tempDisplayed = fromDestinationDisplayed;
        setFromDestinationDisplayed(toDestinationDisplayed);
        setToDestinationDisplayed(tempDisplayed);
        const tempDestinations = fromDestinations;
        setFromDestinations(toDestinations);
        setToDestinations(tempDestinations);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>, field: string) => {
        switch (field) {
            case "from":
                setFromDestination("");
                setFromDestinationDisplayed("");
                setFromDestinations([]);
                setFromSelectedOption("");
                setFromDropdownOpen(false);
                break;
            case "to":
                setToDestination("");
                setToDestinationDisplayed("");
                setToDestinations([]);
                setToSelectedOption("");
                setToDropdownOpen(false);
                break;
            case "depart":
                setDateRange([null, returnDate]);
                break;
            case "return":
                setDateRange([departureDate, null]);
                break;
        }
    };

    const handleFlightDirection = (index: number) => {
        setFlightDirection(index);
    }

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
        if (!fromDestination) {
            fromDestinationRef.current?.focus();
            if (fromDestinations.length > 0) {
                setFromDropdownOpen(true);
            }
            return;
        }
        if (!toDestination) {
            toDestinationRef.current?.focus();
            if (toDestinations.length > 0) {
                setToDropdownOpen(true);
            }
            return;
        }
        if (!departureDate) {
            departureDateRef.current?.focus();
            return;
        }
        if (flightDirection !== 0 && !returnDate) {
            returnDateRef.current?.focus();
            return;
        }

        const formData = {
            originLocationCode: fromDestination,
            destinationLocationCode: toDestination,
            departureDate: departureDate,
            adults: adults,
            children: children,
            infants: infants,
            travelClass: travelClass,
            nonStop: nonStop,
            ...(flightDirection !== 0 && { returnDate: returnDate })
        }
        if (onSubmit) {
            onSubmit(formData, {...formData,fromSelectedOption: fromSelectedOption,toSelectedOption: toSelectedOption,});
        }
    };

    const isOneWay = directionButtons[flightDirection] === "oneWay";
    const isRoundTrip = directionButtons[flightDirection] === "roundTrip";

    // date state
    const [range, setRange] = useState<Range[]>([
        {
            startDate: departureDate ? new Date(departureDate) : new Date(),
            endDate: returnDate ? new Date(returnDate) : new Date(),
            key: 'selection',
            color: "#d76f30"
        }
    ])

    return (
        <Form className="flights-search-container" onSubmit={handleDone}>
            <Row className={`option-selector mb-2`}>
                <div className="col-auto px-0 rounded-5">
                    <Button
                        name="oneWay"
                        variant=""
                        className={`rounded-5 me-3 ${isOneWay ? "active" : ""}`}
                        onClick={() => handleFlightDirection(0)}>
                        One Way
                    </Button>
                    <Button
                        name="roundTrip"
                        variant=""
                        className={`rounded-5 ${isRoundTrip ? "active" : ""}`}
                        onClick={() => handleFlightDirection(1)}>
                        Round Trip
                    </Button>
                </div>
            </Row>
            <Row className="form-controls-row">
                <Col lg={2} md={3} sm={12} xs={12} className="col d-flex">
                    <Form.Group ref={fromDropdownRef} className="w-100">
                        <Form.Label>From</Form.Label>
                        <Form.Control
                            ref={fromDestinationRef}
                            type="text"
                            style={{ border: 'none' }}
                            placeholder={t('country_city_airport')}
                            aria-label={t('country_city_airport')}
                            value={fromDestinationDisplayed}
                            onClick={() => { fromDestinations.length > 0 && setFromDropdownOpen(true) }}
                            onChange={(e) => handleDestinationChange(e, setFromDestinations)}
                            className="destination-input"
                            required
                        />
                        {fromDropdownOpen && (
                            <Dropdown.Menu show={fromDropdownOpen} className="w-auto p-0 airports-dropdown">
                                {fromDestinations.map((option, index) => (
                                    <Dropdown.Item key={index} onClick={() => handleOptionSelect(option.AirportInformation ? option.AirportInformation : option, setFromDropdownOpen)}>
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
                <Col lg={2} md={3} sm={12} xs={12} className="col py-0">
                    <div className="swap-button-container">
                        <button
                            type="button"
                            tabIndex={-1}
                            className={`btn swap-button ${isRotated ? 'rotated' : ''}`}
                            onMouseDown={(e) => e.preventDefault()}  // Prevent the button from gaining focus
                            onClick={(e) => handleSwapClick(e)}>
                            <span>
                                <FaExchangeAlt />
                            </span>
                        </button>
                    </div>
                    <div className="d-flex h-100">
                        <Form.Group ref={toDropdownRef} className={`${!isSmallScreen && 'ps-4'} w-100`} style={{ padding: "0.75rem 0.5rem" }}>
                            <Form.Label>To</Form.Label>
                            <Form.Control
                                ref={toDestinationRef}
                                type="text"
                                style={{ border: 'none' }}
                                placeholder={t('country_city_airport')}
                                aria-label={t('country_city_airport')}
                                value={toDestinationDisplayed}
                                onClick={() => { toDestinations.length > 0 && setToDropdownOpen(true) }}
                                onChange={(e) => handleDestinationChange(e, setToDestinations)}
                                className="destination-input"
                                required
                            />
                            {toDropdownOpen && (
                                <Dropdown.Menu show={toDropdownOpen} className="w-auto p-0 airports-dropdown">
                                    {toDestinations.map((option, index) => (
                                        <Dropdown.Item key={index} onClick={() => handleOptionSelect(option.AirportInformation ? option.AirportInformation : option, setToDropdownOpen)}>
                                            <Row className="align-items-center">
                                                <Col xs={1} md={1} className="d-flex justify-content-center align-items-center p-0">
                                                    {option.Type === 'CITY' ? <FaMapPin /> : (option.Type === 'COUNTRY' ? <IoFlag /> : <IoMdAirplane style={{ transform: "rotate(45deg)" }} />)}
                                                </Col>
                                                <Col xs={10} md={10} className="my-0">
                                                    <Row>
                                                        <span className="ms-2 location-name">{option.PlaceName} ({option.IataCode})</span>
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
                        <div className={`w-auto d-flex align-items-center me-3 ${isSmallScreen && 'mt-2'}`}>
                            <Button variant="clear" onClick={(e) => handleClear(e, "to")}>
                                <IoMdClose strokeWidth={30} />
                            </Button>
                        </div>
                    </div>
                </Col>
                {isMediumScreen ? (
                    <Col xs={6} sm={6} md={3} className="col">
                        <FormGroup>
                            <Form.Label>{isRoundTrip ? "Dates" : "Depart"}</Form.Label>
                            <Form.Control
                                ref={departureDateRef}
                                type="text"
                                min={todayDate}
                                value={
                                    (isRoundTrip && departureDate && returnDate) ?
                                        `${format(new Date(departureDate), 'dd MMM') ?? ''} - ${format(new Date(returnDate), 'dd MMM') ?? ''}` :
                                        (departureDate ? format(new Date(departureDate), 'dd MMM') : '')
                                }
                                placeholder={isRoundTrip ? "Choose Dates" : "Add date"}
                                onClick={() => setDatePickerOpen(true)}
                                onChange={(e) => handleDateChange([e.target.value, returnDate])}
                                required
                            />
                        </FormGroup>
                    </Col>
                ) : (
                    <>
                        <Col lg={2} md={2} className="col d-flex">
                            <FormGroup>
                                <Form.Label>Depart</Form.Label>
                                <Form.Control
                                    ref={departureDateRef}
                                    type="text"
                                    min={todayDate}
                                    value={departureDate ? departureDate : ''}
                                    onClick={() => setDatePickerOpen(true)}
                                    onChange={(e) => handleDateChange([e.target.value, returnDate])}
                                    placeholder="dd/mm/yyyy"
                                    required
                                />
                            </FormGroup>
                            <div className={`w-auto d-flex align-items-center ms-auto me-3`}>
                                <Button variant="clear" onClick={(e) => handleClear(e, "depart")}><IoMdClose strokeWidth={30} /></Button>
                            </div>
                        </Col>
                        <Col lg={2} md={2} className={`col d-flex ${isOneWay ? "disabled" : ""}`}>
                            <FormGroup>
                                <Form.Label>Return</Form.Label>
                                {isOneWay ? (
                                    <Form.Control type="text" disabled={true} value={"(One Way)"} />
                                ) : (
                                    <Form.Control
                                        ref={returnDateRef}
                                        type="text"
                                        min={todayDate}
                                        value={returnDate ? returnDate : ''}
                                        onClick={() => setDatePickerOpen(true)}
                                        onChange={(e) => handleDateChange([departureDate, e.target.value])}
                                        placeholder="dd/mm/yyyy"
                                        required
                                    />
                                )}
                            </FormGroup>
                            {isRoundTrip && (
                                <div className={`w-auto d-flex align-items-center ms-auto me-3`}>
                                    <Button variant="clear" onClick={(e) => handleClear(e, "return")}><IoMdClose strokeWidth={30} /></Button>
                                </div>
                            )}
                        </Col>
                    </>
                )}
                <Col lg={2} md={3} sm={6} xs={6} className="col">
                    <FormGroup>
                        <Form.Label>Travelers & Travel Class</Form.Label>
                        <DropdownButton
                            as={ButtonGroup}
                            title={Utils.truncateString(adults === 1 && children === 0 && infants === 0 ?
                                `${adults} Adult, ${classOptions[travelClass]}`
                                : `${adults + children + infants} Travelers, ${classOptions[travelClass]}`,
                                isSmallScreen ? 20 : 25)
                            }
                            variant="outline-secondary"
                            id="travel-options-dropdown"
                            className="w-100 text-start"
                        >
                            <Dropdown.Item as="div">
                                <Row>
                                    <Form.Group className="form-group" id="nation">
                                        <Form.Label className="pb-1">Cabin Class:</Form.Label>
                                        <div className="custom-select-container">
                                            <Form.Control
                                                as="select"
                                                name="nation"
                                                value={travelClass}
                                                id="nation"
                                                onChange={(e) => handleClassChange(e)}
                                                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                                                className="custom-form-control"
                                                required
                                            >
                                                {Object.entries(classOptions).map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <BiChevronDown className="dropdown-icon" /> {/* Dropdown icon */}
                                        </div>
                                    </Form.Group>
                                </Row>
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
                                            disabled={adults >= 8}
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
                                            disabled={children >= 8}
                                        >
                                            +
                                        </Button>
                                    </Col>
                                </Row>
                                <Row className="align-items-center">
                                    <Col>
                                        <label className="category-label">
                                            <Row>
                                                <span>Infants</span>
                                            </Row>
                                            <Row>
                                                <span>Aged 0 to 2</span>
                                            </Row>
                                        </label>
                                    </Col>
                                    <Col className="d-flex align-content-center justify-content-end counter">
                                        <Button variant="outline-secondary"
                                            onClick={(e) => decrement(setInfants, infants, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={infants === 0}
                                        >
                                            -
                                        </Button>
                                        <input
                                            type="number"
                                            name="infants"
                                            className="text-center counter-input"
                                            step={1}
                                            min={0}
                                            value={infants}
                                            onChange={(e) => handleDropdownInputChange(e)}
                                            onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                                        />
                                        <Button variant="outline-secondary"
                                            onClick={(e) => increment(setInfants, infants, e)}
                                            style={{ cursor: 'pointer' }}
                                            disabled={infants >= 8}
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
                    isRoundTrip ? (
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
                    ) : (
                        <Calendar
                            minDate={new Date()}
                            className="calendarElement"
                            color="#d76f30"
                            date={departureDate ? new Date(departureDate) : new Date()}
                            onChange={(item) => {
                                const localDate = new Date(item.getTime() - item.getTimezoneOffset() * 60000);
                                handleDateChange([localDate.toISOString().split('T')[0], null]);
                                setRange([{ startDate: localDate, endDate: localDate, key: 'selection', color: "#d76f30" }]);
                            }} />
                    )
                )}
            </div>
            <Row>
                <FormGroup className="flight-direct-check">
                    <Form.Check
                        type="checkbox"
                        checked={nonStop}
                        onChange={(e) => setNonStop(e.target.checked)}
                        label={<span>Direct Flights</span>} />
                </FormGroup>
            </Row>
        </Form >
    );
};

export default FlightsSearchBar;