import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
    adminWrapper: {
        height: "100%",
        display: "flex"
    }
}));

const Admin: React.FC = (props: any) => {
    const classes = useStyles();

    return (
        <div className={classes.adminWrapper}>
           <h3>Admin area</h3>
        </div>
    );
}

export default Admin;
