import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { TablePagination } from "@mui/material";

export default function RecordsTable({ data }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const getDuration = (start, end) => {
    var duration = moment.duration(end.diff(start));
    return duration.asMinutes();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Time started</TableCell>
              <TableCell>Time ended</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Game Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.fullname}</TableCell>
                <TableCell>
                  {moment(new Date(row.startTime.toDate())).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </TableCell>
                <TableCell>
                  {moment(row.endTime.toDate()).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </TableCell>
                <TableCell>
                  {getDuration(
                    moment(row.startTime.toDate()),
                    moment(row.endTime.toDate())
                  ).toFixed(2)}{" "}
                  mins
                </TableCell>
                <TableCell>{row.gameLabel}</TableCell>
                <TableCell>{row.gameScore}</TableCell>
                <TableCell>{row.gameLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
