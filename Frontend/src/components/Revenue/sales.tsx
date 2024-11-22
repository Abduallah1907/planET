import React, { useState } from "react";
import { Table, InputGroup, FormControl, Dropdown } from "react-bootstrap";
import { FaCaretDown } from "react-icons/fa";
import "./sales.css";
//Date interval
interface Sale {
  id: number;
  product: string;
  revenue: number;
  date: string; // DD/MM/YYYY format
  month: string; // Derived from date
}

// Function to format date to DD/MM/YYYY
const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const Sales: React.FC = () => {
  const sampleData: Sale[] = [
    {
      id: 1,
      product: "Product A",
      revenue: 500,
      date: "2024-11-01", // Initial format is YYYY-MM-DD
      month: "November",
    },
    {
      id: 2,
      product: "Activity B",
      revenue: 1200,
      date: "2015-10-15", // YYYY-MM-DD format
      month: "October",
    },
    {
      id: 3,
      product: "Iternary C",
      revenue: 800,
      date: "2013-11-10", // YYYY-MM-DD format
      month: "November",
    },
    {
      id: 4,
      product: "Product D",
      revenue: 400,
      date: "2024-09-25", // YYYY-MM-DD format
      month: "September",
    },
  ];

  // Convert the date format to DD/MM/YYYY
  const formattedData = sampleData.map((sale) => ({
    ...sale,
    date: formatDate(sale.date),
  }));

  const [sales, setSales] = useState<Sale[]>(formattedData);
  const [filters, setFilters] = useState({
    product: "",
    date: "",
    month: "",
  });

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
      (!filters.product ||
        sale.product.toLowerCase().includes(filters.product.toLowerCase())) &&
      (!filters.date || sale.date.startsWith(filters.date)) &&
      (!filters.month ||
        sale.month.toLowerCase().includes(filters.month.toLowerCase()))
    );
  });

  return (
    <div className="sales-container">
      <h2 className="mb-4">Sales Report</h2>
      <Table striped bordered hover responsive className="sales-table">
        <thead>
          <tr>
            <th>
              Type
              <InputGroup>
                <FormControl
                  type="text"
                  name="product"
                  value={filters.product}
                  placeholder="Filter"
                  onChange={handleFilterChange}
                  className="filter-input"
                  style={{ width: "120px" }}
                />
                <Dropdown
                  onSelect={(value) => handleDropdownSelect("product", value)}
                >
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCaretDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Product A">
                      Product A
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Product B">
                      Product B
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Product C">
                      Product C
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Product D">
                      Product D
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
            </th>
            <th>Revenue</th>
            <th>
              Date
              <InputGroup>
                <FormControl
                  type="text" // Changed to text to accept DD/MM/YYYY
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  placeholder="DD/MM/YYYY"
                  className="filter-input"
                  style={{ width: "120px" }}
                />
              </InputGroup>
            </th>
            <th>
              Month
              <InputGroup>
                <FormControl
                  type="text"
                  name="month"
                  value={filters.month}
                  placeholder="Filter"
                  onChange={handleFilterChange}
                  className="filter-input"
                  style={{ width: "120px" }}
                />
                <Dropdown
                  onSelect={(value) => handleDropdownSelect("month", value)}
                >
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCaretDown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="November">November</Dropdown.Item>
                    <Dropdown.Item eventKey="October">October</Dropdown.Item>
                    <Dropdown.Item eventKey="September">
                      September
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.product}</td>
              <td>${sale.revenue.toFixed(2)}</td>
              <td>{sale.date}</td> {/* Date in DD/MM/YYYY format */}
              <td>{sale.month}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Sales;
