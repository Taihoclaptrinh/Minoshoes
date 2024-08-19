import "./AdminNavbar.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { Link } from "react-router-dom";

const AdminNavbar = () => {

  return (
    <div className="AdminNavbar">
      <div className="wrapper">
        <div className="search">
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <Link to="/" className="logo">Minoshoes</Link>
          </Link>
        </div> 
        <div className="items">
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
