import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  Box,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import SalesService from "../../services/SalesService";
import { Utils } from "../../utils/utils";
import { Container } from "react-bootstrap";
import { useAppContext } from "../../AppContext";

interface Sale {
  _id: string;
  type: string;
  name: string;
  total_revenue: number;
  first_buy: string;
  last_buy: string;
}

// Helper function to validate the date format
const isValidDate = (date: string): boolean => {
  if (date === "") {
    return true;
  }
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
};

const formatDate = (date: string) => {
  return Utils.formatDateDay(new Date(date));
};

const Sales: React.FC = () => {
  const Admin = useAppSelector((state) => state.user);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filters, setFilters] = useState({
    typeFilter: "",
    nameFilter: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [dateError, setDateError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Sale>("total_revenue");
  const { currency, baseCurrency, getConvertedCurrencyWithSymbol } =
    useAppContext();

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await SalesService.getAllSales(startDate, endDate);
      if (
        response.success &&
        response.data.salesReports &&
        Array.isArray(response.data.salesReports)
      ) {
        const formattedData = response.data.salesReports.map((sale: any) => ({
          _id: sale._id,
          type: sale.type,
          name: sale.name,
          total_revenue: sale.total_revenue,
          first_buy: formatDate(sale.first_buy),
          last_buy: formatDate(sale.last_buy),
        }));
        setSales(formattedData);
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to load sales data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDateChange = () => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      setDateError("Please enter dates in the correct format (dd/mm/yyyy).");
    } else {
      setDateError(null);
      fetchSales();
    }
  };

  const handleDropdownSelect = (name: string, value: string | null) => {
    if (value !== null) {
      setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    }
  };

  const handleRequestSort = (property: keyof Sale) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data: Sale[]) => {
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
        sale.name.toLowerCase().includes(filters.nameFilter.toLowerCase()))
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
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container className="mt-3">
      <h2 className="mb-4 text-center">Sales Report</h2>

      <Box className="form-row" display="flex" justifyContent="space-between">
        <TextField
          label="Start Date (dd/mm/yyyy)"
          type="text"
          id="startDate"
          value={startDate}
          placeholder="Start Date "
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStartDate(e.target.value)
          }
          fullWidth
        />
        <TextField
          label="End Date (dd/mm/yyyy)"
          type="text"
          id="endDate"
          value={endDate}
          placeholder="End Date"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEndDate(e.target.value)
          }
          fullWidth
        />
        <Button
          onClick={handleDateChange}
          type="submit"
          className="btn-main-inverse "
        >
          Apply Dates
        </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSales.map((sale) => (
              <TableRow key={sale._id}>
                <TableCell>{sale.type}</TableCell>
                <TableCell>{sale.name}</TableCell>
                <TableCell>{sale.total_revenue}</TableCell>
                <TableCell>{sale.first_buy}</TableCell>
                <TableCell>{sale.last_buy}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Total Revenue</strong>
              </TableCell>
              <TableCell colSpan={3}>
                <strong>{convertedPrice}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Sales;
