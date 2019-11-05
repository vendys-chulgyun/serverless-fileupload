import React from 'react';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Tooltip from '@material-ui/core/Tooltip'

import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  card: {
    // maxWidth: 345,
    // paddingBottom: '3px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundSize: 'contain'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function PhotoCard({ item, handle }) {
  console.log('#### card', item);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const deletePhoto = async () => {
    await handle(item.name);
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            Img
          </Avatar>
        }
        action={
          <Tooltip title="link copy">
            <IconButton aria-label="settings"
              onClick={handleExpandClick}
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        }
        title={item.name}
        subheader={moment(item.date).format('YYYY-MM-DD HH:MM')}
      />
      <CardMedia
        className={classes.media}
        image={item.photoUrl}
        title={item.name}
      />
      <CardActions disableSpacing>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={deletePhoto}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
    
  );
}
