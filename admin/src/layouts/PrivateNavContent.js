import React, { useMemo, forwardRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EventNoteIcon from '@material-ui/icons/EventNote';
import PeopleIcon from '@material-ui/icons/People';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(1.5, 0),
  },
  listItem: {
    position: 'relative',
    borderRadius: 8,
    margin: theme.spacing(0.5, 1.5),
    padding: theme.spacing(0.75, 1.5),
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(165, 191, 153, 0.08)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(165, 191, 153, 0.15)',
      '&:hover': {
        backgroundColor: 'rgba(165, 191, 153, 0.25)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '20%',
        height: '60%',
        width: 3,
        backgroundColor: '#a5bf99',
        borderRadius: 2,
      },
    }
  },
  icon: {
    color: '#5c7160',
    opacity: 0.7,
    minWidth: 40,
    '& svg': {
      fontSize: '1.2rem',
    },
    '.Mui-selected &': {
      color: '#5c7160',
      opacity: 1,
    }
  },
  text: {
    margin: 0,
    '& span': {
      fontFamily: "'Quicksand', sans-serif",
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#5c7160',
      letterSpacing: '0.01em',
    },
    '.Mui-selected &': {
      '& span': {
        fontWeight: 600,
      }
    }
  },
  divider: {
    margin: theme.spacing(1, 2),
    backgroundColor: 'rgba(192, 160, 128, 0.2)',
    height: 1,
  }
}));

const menus = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    url: '/dashboard',
  },
  {
    label: 'Agenda',
    icon: <EventNoteIcon />,
    url: '/appointments',
  },
  {
    label: 'Clientes',
    icon: <PeopleIcon />,
    url: '/clients',
  },
  {
    label: 'Estatísticas',
    icon: <InsertChartIcon />,
    url: '/stats',
  },
  {
    label: 'Definições',
    icon: <SettingsIcon />,
    url: '/settings',
  },
];

const PrivateNavContent = () => {
  const classes = useStyles();
  const { path } = useRouteMatch();

  const ListItemLink = props => {
    const { icon, primary, to } = props;

    const renderLink = useMemo(
      () =>
        forwardRef((linkProps, ref) => (
          <Link ref={ref} to={to} {...linkProps} />
        )),
      [to],
    );

    return (
      <ListItem
        button
        component={renderLink}
        selected={path.includes(to)}
        className={classes.listItem}
      >
        {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} className={classes.text} disableTypography={false} />
      </ListItem>
    );
  };

  return (
    <>
      <List className={classes.list}>
        {menus.map(({ label, icon, url }, index) => (
          <li key={index}>
            <ListItemLink to={url} primary={label} icon={icon} />
          </li>
        ))}
      </List>
    </>
  );
};

export default PrivateNavContent;
