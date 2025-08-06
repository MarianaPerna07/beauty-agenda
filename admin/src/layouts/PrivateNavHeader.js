import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../assets/images/Logo-YourMoments.png";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: (props) => (props.collapsed ? 8 : 16),
    transition: "0.3s",
    backgroundColor: "#F5F1E9",
    position: "relative",
    overflow: "hidden"
  },
  avatar: {
    width: (props) => (props.collapsed ? 48 : 60),
    height: (props) => (props.collapsed ? 48 : 60),
    transition: "0.3s",
    backgroundColor: "#a5bf99",
    color: "#ffffff",
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 500,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
    border: "2px solid rgba(255, 255, 255, 0.8)"
  },
  nameText: {
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 500,
    color: "#5c7160",
    fontSize: "1.1rem"
  },
  emailText: {
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 400,
    color: "rgba(92, 113, 96, 0.7)",
    fontSize: "0.85rem"
  },
  divider: {
    backgroundColor: "rgba(192, 160, 128, 0.3)",
    margin: "0px"
  },
  logo: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: (props) => (props.collapsed ? 24 : 32),
    height: "auto",
    opacity: 0.15,
    transition: "0.3s"
  },
  decorator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px",
    background: "linear-gradient(to right, #c0a080, #e9d3a3, #c0a080)"
  }
}));

const PrivateNavHeader = ({ collapsed }) => {
  const classes = useStyles({ collapsed });
  const initials = "YM"; // Your Moments initials

  return (
    <>
      <div className={classes.container}>
        <div className={classes.decorator} />
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar className={classes.avatar}>
            {initials}
          </Avatar>
          
          <div style={{ paddingBottom: collapsed ? 8 : 16 }} />
          
          {!collapsed && (
            <>
              <Typography variant="h6" noWrap className={classes.nameText}>
                Admin
              </Typography>
              <Typography noWrap gutterBottom className={classes.emailText}>
                yourmomentos@admin.pt
              </Typography>
            </>
          )}
        </div>
        
        {/* Small logo watermark */}
        <img 
          src={logo}
          alt=""
          className={classes.logo}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <Divider className={classes.divider} />
    </>
  );
};

PrivateNavHeader.propTypes = {
  collapsed: PropTypes.bool
};

PrivateNavHeader.defaultProps = {
  collapsed: false
};

export default PrivateNavHeader;
