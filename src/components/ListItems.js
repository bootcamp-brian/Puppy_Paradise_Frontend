import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import PetsIcon from '@mui/icons-material/Pets';

const ListItems = ({ setCurrentView }) => {
  return (
    <React.Fragment>
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