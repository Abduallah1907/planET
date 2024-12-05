import React, { useState, useEffect } from "react";
import {
  Table,
  InputGroup,
  FormControl,
  Dropdown,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { FaCaretDown } from "react-icons/fa";
import SalesService from "../../services/SalesService";
import "./sales.css";
import CustomFormGroup from "../FormGroup/FormGroup";
import { useAppSelector } from "../../store/hooks";
import { Utils } from "../../utils/utils";

interface Adv_Sales {
  _id: string;
  type: string;
  name: string;
  total_revenue: number;
  first_buy: string;
  last_buy: string;
  tourist_count: number;
}
// Helper function to validate the date format
const isValidDate = (date: string): boolean => {
  // Allow empty string as valid
  if (date === "") {
    return true;
  }

  // Regular expression to match dd/mm/yyyy format
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

const formatDate = (date: string) => {
  return Utils.formatDateDay(new Date(date));
};

const Adv_Sales: React.FC = () => {
  const Adv = useAppSelector((state) => state.user);
  const [sales, setSales] = useState<Adv_Sales[]>([]);
  const [filters, setFilters] = useState({
    typeFilter: "",
    nameFilter: "",
    touristCountFilter: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for start and end dates
  const [startDate, setStartDate] = useState<string>(""); // Default start date
  const [endDate, setEndDate] = useState<string>(""); // Default end date

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if TG.email is available
      if (!Adv.email) {
        throw new Error("No email found. Please make sure you're logged in.");
      }

      const response = await SalesService.getSalesAdv(
        Adv.email,
        startDate,
        endDate
      );

      // Log the response for debugging purposes
      console.log("API Response:", response);

      // Check if response is valid and contains the success field
      if (!response || !response.success) {
        throw new Error(
          "Failed to load sales data: Response is missing success field."
        );
      }

      // Check if salesReports is an array
      if (response.data && Array.isArray(response.data.salesReports)) {
        const formattedData = response.data.salesReports.map((sale: any) => ({
          _id: sale._id,
          type: sale.type,
          name: sale.name,
          total_revenue: sale.total_revenue,
          tourist_count: sale.tourist_count,
          first_buy: formatDate(sale.first_buy),
          last_buy: formatDate(sale.last_buy),
        }));

        setSales(formattedData);
      } else {
        throw new Error(
          "Unexpected API response format: salesReports is not an array."
        );
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to load sales data. Please try again later."
      );
      console.error("Error fetching sales:", err); // Log errors for further debugging
    } finally {
      setLoading(false);
    }
  };

  const [dateError, setDateError] = useState<string | null>(null); // State to store date error

  const handleDateChange = () => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setDateError("Please enter dates in the correct format (dd/mm/yyyy).");
    } else {
      setDateError(null); // Clear error if date is valid
      fetchSales(); // Trigger fetch when the button is pressed
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleDropdownSelect = (name: string, value: string | null) => {
    if (value) {
      setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    }
  };

  const filteredSales = sales.filter((sale) => {
    return (
      (filters.typeFilter === "" ||
        sale.type.toLowerCase().includes(filters.typeFilter.toLowerCase())) &&
      (filters.nameFilter === "" ||
        sale.name.toLowerCase().includes(filters.nameFilter.toLowerCase())) &&
      (filters.touristCountFilter === "" || // Check the tourist count filter
        sale.tourist_count === parseInt(filters.touristCountFilter)) // Assuming it's numeric
    );
  });

  const totalRevenue = filteredSales.reduce(
    (total, sale) => total + sale.total_revenue,
    0
  );

  if (loading) {
    return (
      <Spinner
        animation="border"
        variant="primary"
        className="loading-spinner"
      />
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="sales-container">
      <h2 className="mb-4 text-center">Sales Report</h2>

      <div className="form-row">
        {/* Start Date */}
        <CustomFormGroup
          label="Start Date "
          type="text"
          id="startDate"
          value={startDate}
          placeholder="Enter Start Date (dd/mm/yyyy)"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStartDate(e.target.value)
          }
          disabled={false}
          required={false}
          name={""}
        />
        {/* End Date */}
        <CustomFormGroup
          label="End Date"
          type="text"
          id="endDate"
          value={endDate}
          placeholder="Enter End Date (dd/mm/yyyy)"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEndDate(e.target.value)
          }
          disabled={false}
          required={false}
          name={""}
        />
        {/* Button */}
        <Button onClick={handleDateChange} className="apply-dates-btn">
          Apply Dates
        </Button>
        {dateError && <Alert variant="danger">{dateError}</Alert>}{" "}
        {/* Show error */}
      </div>

      <Table striped bordered hover responsive className="sales-table">
        <thead>
          <tr>
            <th>
              Type
              <InputGroup>
                <FormControl
                  type="text"
                  name="typeFilter"
                  value={filters.typeFilter}
                  placeholder="Filter by Type"
                  onChange={handleFilterChange}
                  className="filter-input"
                  style={{ width: "120px" }}
                />
                <Dropdown
                  onSelect={(value) =>
                    handleDropdownSelect("typeFilter", value)
                  }
                >
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCaretDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Array.from(new Set(sales.map((sale) => sale.type))).map(
                      (type, index) => (
                        <Dropdown.Item eventKey={type} key={index}>
                          {type}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
            </th>
            <th>
              Name
              <InputGroup>
                <FormControl
                  type="text"
                  name="nameFilter"
                  value={filters.nameFilter}
                  placeholder="Filter by Name"
                  onChange={handleFilterChange}
                  className="filter-input"
                  style={{ width: "120px" }}
                />
                <Dropdown
                  onSelect={(value) =>
                    handleDropdownSelect("nameFilter", value)
                  }
                >
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCaretDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Array.from(new Set(sales.map((sale) => sale.name))).map(
                      (name, index) => (
                        <Dropdown.Item eventKey={name} key={index}>
                          {name}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
            </th>
            <th>Revenue</th>
            <th>First Buy</th>
            <th>Last Buy</th>
            <th>
              Tourist Count
              <InputGroup>
                <FormControl
                  type="text"
                  name="touristCountFilter"
                  value={filters.touristCountFilter}
                  placeholder="Filter by Tourist Count"
                  onChange={handleFilterChange}
                  className="filter-input"
                  style={{ width: "120px" }}
                />
                <Dropdown
                  onSelect={(value) =>
                    handleDropdownSelect("touristCountFilter", value)
                  }
                >
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCaretDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Array.from(
                      new Set(sales.map((sale) => sale.tourist_count))
                    ).map((touristCount, index) => (
                      <Dropdown.Item
                        eventKey={touristCount.toString()}
                        key={index}
                      >
                        {touristCount}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale.type}</td>
              <td>{sale.name}</td>
              <td>{sale.total_revenue}</td>
              <td>{sale.first_buy}</td>
              <td>{sale.last_buy}</td>
              <td>{sale.tourist_count}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <strong>Total Revenue</strong>
            </td>
            <td colSpan={3}>
              <strong>{totalRevenue}</strong>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Adv_Sales;
