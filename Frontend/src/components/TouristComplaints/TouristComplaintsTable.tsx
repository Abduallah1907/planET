import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "react-bootstrap";
import { IComplaintTourist } from "../../types/IComplaint";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { TouristService } from "../../services/TouristService";
import { useAppSelector } from "../../store/hooks";
import FilterListIcon from "@mui/icons-material/FilterList";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Badge } from "react-bootstrap";

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
  id: keyof IComplaintTourist;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
}

const headCells: readonly HeadCell[] = [
  //   { id: "tourist_name", numeric: false, label: "Name" },
  { id: "title", numeric: false, label: "Title" },
  { id: "body", numeric: false, label: "Body" },
  { id: "date", numeric: true, label: "Complaint's Date" },
  { id: "date", numeric: true, label: "Created At" },

  { id: "status", numeric: false, label: "Status" },
  { id: "reply", numeric: false, label: "Reply" },
];

function descendingComparator(
  a: IComplaintTourist,
  b: IComplaintTourist,
  orderBy: keyof IComplaintTourist
) {
  const valueA = orderBy === "title" ? a.title || "" : a[orderBy];

  const valueB = orderBy === "title" ? b.title || "" : b[orderBy];

  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof IComplaintTourist>(
  order: Order,
  orderBy: Key
): (a: IComplaintTourist, b: IComplaintTourist) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function TouristComplaintsTable() {
  const [complaints, setComplaints] = useState<IComplaintTourist[]>([]);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IComplaintTourist>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const Tourist = useAppSelector((state) => state.user);
  const TouristId = Tourist.stakeholder_id?._id;

  const getComplaintsData = async () => {
    const ComplaintsData = await TouristService.viewMyComplaints(TouristId);
    console.log(ComplaintsData.data);
    setComplaints(ComplaintsData.data);
  };

  useEffect(() => {
    getComplaintsData();
  }, [TouristId]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IComplaintTourist
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: any) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`; // Format as HH:mm:ss
  };

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
            <TableCell align="inherit"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((complaint) => (
            <TableRow key={complaint.complaint_id}>
              <TableCell align="center">{complaint.title}</TableCell>
              <TableCell align="center">{complaint.body}</TableCell>
              <TableCell align="center">
                {formatDate(new Date(complaint.date))}
              </TableCell>
              <TableCell align="center">
                {formatTime(new Date(complaint.date))}
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
                {complaint.reply ? complaint.reply : "-"}
              </TableCell>
            </TableRow>
          ))}
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
