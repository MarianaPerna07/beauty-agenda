import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
  headerRoot: {
    backgroundColor: '#F5F1E9 !important', // Match the page background
    boxShadow: 'none !important', // Remove any shadow
    borderBottom: 'none !important', // Remove any border
    minHeight: '0 !important',
    height: 'auto !important',
    '& .MuiToolbar-root': {
      minHeight: '48px !important', // Compact height
      padding: '0 16px !important',
    }
  },
  header: {
    fontWeight: 500,
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '1.2rem',
    color: '#5c7160',
    letterSpacing: '0.01em',
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    marginRight: theme.spacing(1.5),
    borderRadius: 20, // More rounded corners
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(192, 160, 128, 0.2)',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(192, 160, 128, 0.3)',
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(2),
        width: 'auto',
    },
    },
    searchIcon: {
    padding: theme.spacing(0, 1.5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5c7160',
    opacity: 0.8,
    },
    inputRoot: {
    color: '#5c7160',
    fontFamily: "'Quicksand', sans-serif",
    width: '100%',
    fontSize: '0.875rem',
    },
    inputInput: {
    padding: theme.spacing(0.75, 0.75, 0.75, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3.5)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.875rem',
    [theme.breakpoints.up('sm')]: {
        width: '14ch',
        '&:focus': {
        width: '20ch',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
    },
    },
    logoutButton: {
    color: '#5c7160',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    '&:hover': {
        backgroundColor: 'rgba(165, 191, 153, 0.25)',
    },
    transition: 'all 0.2s',
    },
  logoutIcon: {
    fontSize: '1.2rem',
  },
}));

const PrivateHeader = () => {
  const classes = useStyles();
  let history = useHistory();

  React.useEffect(() => {
    const headerElement = document.querySelector('.MuiPaper-root.MuiAppBar-root');
    if (headerElement) {
      headerElement.classList.add(classes.headerRoot);
    }
  }, [classes.headerRoot]);

  const handleLogout = event => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <>
      <Typography variant="h6" noWrap className={classes.header}>
        Your Moments
      </Typography>
      <div className={classes.grow} />
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon fontSize="small" />
        </div>
        <InputBase
          placeholder="Pesquisar..."
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
      <IconButton 
        aria-label="logout" 
        className={classes.logoutButton} 
        onClick={handleLogout}
        size="small"
      >
        <ExitToAppIcon className={classes.logoutIcon} />
      </IconButton>
    </>
  );
};

export default PrivateHeader;
