import React from 'react';
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import './CardList.css'; // Custom CSS for styling

const items = [
  { id: 1, title: 'Card 1' },
  { id: 2, title: 'Card 2' },
  { id: 3, title: 'Card 3' },
];

const CardList = () => {
  return (
    <div className="vertical-card-list">
      {items.map((item) => (
        <Card className="vertical-card-item" key={item.id}>
          <CardContent>
            <Typography variant="h5" component="div">
              {item.title}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="outlined" color="primary">
              Action 1
            </Button>
            <Button size="small" variant="contained" color="secondary">
              Action 2
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default CardList;
