import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Badge, Button } from "react-bootstrap";
import { AdminService } from "../../services/AdminService";
import { IComplaint } from "../../types/IComplaint";
import ComplaintsModal from "./ComplaintsModal";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import FilterListIcon from "@mui/icons-material/FilterList";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Utils } from "../../utils/utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof IComplaint;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "tourist_name", numeric: false, label: "Name" },
  { id: "title", numeric: false, label: "Title" },
  { id: "date", numeric: true, label: "Complaint's Date" },
  { id: "createdAt", numeric: true, label: "Filed At" },
  { id: "status", numeric: false, label: "Status" },
];

function descendingComparator(
  a: IComplaint,
  b: IComplaint,
  orderBy: keyof IComplaint
) {
  const valueA =
    orderBy === "tourist_name" ? a.tourist_name.user_id.name || "" : a[orderBy];

  const valueB =
    orderBy === "tourist_name" ? b.tourist_name.user_id.name || "" : b[orderBy];

  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof IComplaint>(
  order: Order,
  orderBy: Key
): (a: IComplaint, b: IComplaint) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(
    null
  );
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IComplaint>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getComplaintsData = async () => {
    const ComplaintsData = await AdminService.getComplaints();
    console.log(ComplaintsData.data);
    setComplaints(ComplaintsData.data);
  };

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints((prevComplaints: any) =>
      prevComplaints.map((complaint: any) =>
        complaint.complaint_id === complaintId
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );
  };

  useEffect(() => {
    getComplaintsData();
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IComplaint
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewDetails = (complaint: IComplaint) => {
    setSelectedComplaint(complaint);
    setModalShow(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Assuming you're using anchorEl to position the menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredComplaints = filterStatus
    ? complaints.filter((complaint) => complaint.status === filterStatus)
    : complaints;

  const visibleRows = [...filteredComplaints]
    .sort(getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align="center"
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
                {headCell.label === "Status" && (
                  <>
                    <FilterListIcon
                      style={{ marginRight: "4px", cursor: "pointer" }}
                      onClick={(event) =>
                        handleMenuClick(
                          event as unknown as React.MouseEvent<HTMLElement>
                        )
                      } // Cast the event
                      aria-label="Filter" // Optional for accessibility
                    />
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          setFilterStatus("Pending");
                          setPage(0);
                          handleMenuClose();
                        }}
                      >
                        Show Pending
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterStatus("Resolved");
                          setPage(0);
                          handleMenuClose();
                        }}
                      >
                        Show Resolved
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setFilterStatus(null);
                          setPage(0);
                          handleMenuClose();
                        }}
                      >
                        Show All
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((complaint) => (
            <TableRow
              hover
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#f5f5f5",
                  width: "100%",
                },
              }}
              key={complaint.complaint_id}
            >
              <TableCell align="center">
                {complaint.tourist_name.user_id.name}
              </TableCell>
              <TableCell align="center">{complaint.title}</TableCell>
              <TableCell align="center">
                {Utils.formatDateDay(new Date(complaint.date))}
              </TableCell>
              <TableCell align="center">
                {Utils.formatDateDay(new Date(complaint.createdAt))}
              </TableCell>
              <TableCell align="center">
                <Badge
                  bg={complaint.status === "Pending" ? "inactive" : "active"}
                  className={"custom-status-badge rounded-4 text-center"}
                >
                  {complaint.status}
                </Badge>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="main-inverse"
                  onClick={() => handleViewDetails(complaint)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <ComplaintsModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              setSelectedComplaint(null);
            }}
            complaint={selectedComplaint}
            onStatusChange={handleStatusChange}
          />
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredComplaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </TableContainer>
  );
}
