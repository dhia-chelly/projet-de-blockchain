import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Header from "../header/Header";
import Card from "../cards/Cards";
import background from "../../main_dashboard/assets/img/bg.png";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridGap: theme.spacing(3),
      },
      paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
      },
      divider: {
        margin: theme.spacing(2, 0),
      },
    }));
const myStyle = {
  backgroundImage: `url(${background})`,
  height: "100vh",
  fontSize: "50px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

class Landing extends Component {


  render() {
    return (

      <Grid style={myStyle} container spacing={3} direction="row"
      justifyContent="flex-end"
      alignItems="center">
         <Grid item xs={6}>
        </Grid>
        <Grid item xs={6} >
        <Card />
        </Grid>
        
      </Grid>
    );
  }
}
export default Landing;
