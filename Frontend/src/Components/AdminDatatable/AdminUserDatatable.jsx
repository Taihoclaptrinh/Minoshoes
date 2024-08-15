import "./AdminDatatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource.js"; // Adjust the path as needed
import { Link } from "react-router-dom";
import { useState } from "react";

const AdminUserDatatable = () => {
  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/admin/users/${params.row.id}`} className="viewButton">
            View
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="AdminDatatable">
      <div className="datatableTitle">
        Users
        <Link to="/admin/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default AdminUserDatatable;
