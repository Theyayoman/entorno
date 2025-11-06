// TablaPrototipos
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import Swal from "sweetalert2";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "envase",
    label: "Envase",
  },
  {
    id: "tapa",
    label: "Tapa",
  },
  {
    id: "sello",
    label: "Sello",
  },
  {
    id: "aditamento",
    label: "Aditamento",
  },
  {
    id: "formula",
    label: "Fórmula",
  },
  {
    id: "formato",
    label: "Formato",
  },
  {
    id: "acciones",
    label: "",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
          >
            {headCell.label}
            {/* <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{ fontWeight: "bold" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel> */}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
      ]}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Prototipos
      </Typography>
      <Tooltip title="Filter list">
        {/* <IconButton>
          <FilterListIcon />
        </IconButton> */}
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TablaPrototipos() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        await axios
          .get("/api/ProductEngineering/getPrototipos")
          .then((response) => {
            setProductos(response.data);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductos();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productos.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...productos]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Deseas eliminar el prototipo?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgb(31 41 55)",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await axios
        .post(`/api/ProductEngineering/eliminarPrototipo`, { id: id })
        .then(
          Swal.fire({
            title: "Eliminado",
            text: "El prototipo ha sido eliminado correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            const newProductos = productos.filter(
              (producto) => producto.id !== id
            );
            setProductos(newProductos);
          })
        )
        .catch((error) => {
          console.error("Error al guardar el prototipo:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el prototipo contacte al administrador",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <EnhancedTableToolbar />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={productos.length}
          />
          <TableBody>
            {productos.map((producto, index) => {
              const isItemSelected = selected.includes(producto.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={producto.id}
                  selected={isItemSelected}
                >
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    align={"center"}
                    sx={{ marginLeft: "15px" }}
                  >
                    {producto.envase?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    {producto.tapa?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    {producto.sello?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    {producto.aditamento?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    {producto.formula?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    {producto.formato?.nombre || "Articulo no seleccionado"}
                  </TableCell>
                  <TableCell align={"center"} sx={{ marginLeft: "15px" }}>
                    <IconButton
                      onClick={() => handleDelete(producto.id)}
                      sx={{ color: "#1f2937" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={productos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
