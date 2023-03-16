import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PetsIcon from '@mui/icons-material/Pets';
import { ListItemSecondaryAction } from '@mui/material';

const ListItems = ({ setCurrentView }) => {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => {
        setCurrentView('dashboard')
      }}>
        <ListItemIcon>
            <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => {
        setCurrentView('orders')
      }}>
        <ListItemIcon>
            <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
      <ListItemButton onClick={() => {
        setCurrentView('users')
      }}>
        <ListItemIcon>
            <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
      <ListItemButton onClick={() => {
        setCurrentView('puppies')
      }}>
        <ListItemIcon>
            <PetsIcon />
        </ListItemIcon>
      <ListItemText primary="Puppies" />
      </ListItemButton>
    </React.Fragment>
  )
};

export default ListItems;