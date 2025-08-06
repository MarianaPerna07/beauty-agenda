import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
    minHeight: 'calc(100vh - 64px - 40px)',
    position: 'relative',
    fontFamily: "'Quicksand', sans-serif",
    backgroundColor: '#F5F1E9',
    color: '#5c7160',
  },
  contentContainer: {
    position: 'relative',
    zIndex: 1,
  },
  decorElement1: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 100,
    height: 100,
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 0,
  },
  decorElement2: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 80,
    height: 80,
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 0,
    transform: 'rotate(-45deg)',
  }
}));

const PrivateContent = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* Decorative elements */}
      <div className={classes.decorElement1}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,0 C60,0 0,60 0,100 L100,100 L100,0 Z" fill="#a5bf99" />
        </svg>
      </div>
      <div className={classes.decorElement2}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,80 Q40,60 60,80 T100,80 Q80,60 80,40 T80,0 Q60,20 40,0 T0,0 Q20,40 0,80 Z" fill="#5c7160"/>
        </svg>
      </div>
      
      {/* Main content */}
      <Grid container className={classes.contentContainer}>
        {children}
      </Grid>
    </div>
  );
};

export default PrivateContent;
