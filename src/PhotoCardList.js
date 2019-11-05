import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import PhotoCard from './PhotoCard';

const useStyles = makeStyles(theme => ({
    photoList: {
        margin: 'auto',
        width: '100%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    photo: {
        display: 'block'
    }

}));
  
export default function PhotoCardList({ photos, handle }) {
    const classes = useStyles();

    console.log('### card list', photos);
    return (
        (photos && photos.length > 0)
        ?
        <List className={classes.photoList}>
        {
            photos.map((item, key) => {
                return (
                    <ListItem key={key} className={classes.photo}>
                        <PhotoCard item={item} handle={handle} />
                    </ListItem>
                );
            })
        }
        </List>
        :
        <div>이미지가 없음.</div>
    );
  }