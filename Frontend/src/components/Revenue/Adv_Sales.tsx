import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
  Alert,
  TableSortLabel,
  Container,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import SalesService from "../../services/SalesService";
import { Utils } from "../../utils/utils";
import { useAppContext } from "../../AppContext";
import { Spinner } from "react-bootstrap";

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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Adv_Sales>("total_revenue");
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

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

  const handleRequestSort = (property: keyof Adv_Sales) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data: Adv_Sales[]) => {
    return data.sort((a, b) => {
      if (orderBy === "total_revenue") {
        return sortDirection === "asc"
          ? a.total_revenue - b.total_revenue
          : b.total_revenue - a.total_revenue;
      }
      if (orderBy === "type") {
        return sortDirection === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      if (orderBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
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

  const sortedSales = sortData(filteredSales);

  const totalRevenue = sortedSales.reduce(
    (total, sale) => total + sale.total_revenue,
    0
  );
  const convertedPrice = useMemo(() => {
    return getConvertedCurrencyWithSymbol(totalRevenue, baseCurrency, currency);
  }, [baseCurrency, currency, getConvertedCurrencyWithSymbol]);

  if (loading) {
    return (
      <Spinner
        animation="border"
        variant="primary"
        className="loading-spinner"
      />
    );
  }

  return (
    <Container className="mt-3">
      <h2 className="mb-4 text-center">Sales Report</h2>

      <Box display="flex" flexDirection="column" gap="16px" className="mb-4">
        <Box display="flex" justifyContent="space-between" gap="16px">
          <TextField
            label="Start Date (dd/mm/yyyy)"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="End Date (dd/mm/yyyy)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleDateChange}
            className="btn-main-inverse"
            sx={{
              minWidth: "150px",
              backgroundColor: "#d76f30;",
              "&:hover": {
                backgroundColor: "#d76f30;",
              },
              "&:focus": {
                backgroundColor: "#d76f30;",
              },
            }}
          >
            Apply Dates
          </Button>
        </Box>
        {dateError && <Alert severity="error">{dateError}</Alert>}
      </Box>

      <TableContainer component={Paper} className="mt-2">
        <Table aria-label="sales report table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "type"}
                  direction={sortDirection}
                  onClick={() => handleRequestSort("type")}
                >
                  Type
                </TableSortLabel>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <Select
                    value={filters.typeFilter}
                    onChange={(e) =>
                      handleDropdownSelect("typeFilter", e.target.value)
                    }
                    displayEmpty
                    sx={{ fontSize: "0.875rem", width: "100px" }}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    {Array.from(new Set(sales.map((sale) => sale.type))).map(
                      (type, index) => (
                        <MenuItem value={type} key={index}>
                          {type}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={sortDirection}
                  onClick={() => handleRequestSort("name")}
                >
                  Name
                </TableSortLabel>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <Select
                    value={filters.nameFilter}
                    onChange={(e) =>
                      handleDropdownSelect("nameFilter", e.target.value)
                    }
                    displayEmpty
                    sx={{ fontSize: "0.875rem", width: "100px" }}
                  >
                    <MenuItem value="">Select Name</MenuItem>
                    {Array.from(new Set(sales.map((sale) => sale.name))).map(
                      (name, index) => (
                        <MenuItem value={name} key={index}>
                          {name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "total_revenue"}
                  direction={sortDirection}
                  onClick={() => handleRequestSort("total_revenue")}
                >
                  Revenue
                </TableSortLabel>
              </TableCell>
              <TableCell>First Buy</TableCell>
              <TableCell>Last Buy</TableCell>
              <TableCell>
                <TableSortLabel>Tourist Count</TableSortLabel>
                <TextField
                  label="Filter by Count"
                  value={filters.touristCountFilter}
                  onChange={(e) =>
                    handleDropdownSelect("touristCountFilter", e.target.value)
                  }
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>{sale.type}</TableCell>
                <TableCell>{sale.name}</TableCell>
                <TableCell>{sale.total_revenue}</TableCell>
                <TableCell>{sale.first_buy}</TableCell>
                <TableCell>{sale.last_buy}</TableCell>
                <TableCell>{sale.tourist_count}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Total Revenue</strong>
              </TableCell>
              <TableCell colSpan={4}>
                <strong>{convertedPrice}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Adv_Sales;
