import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

import Owner from "../images/Distributer.jpg";
import Distributer from "../images/Distributer.jpg";
import Supplier from "../images/Supplier1.jpg";
import Manufacturer from "../images/Manufacturer1.jpg";
import Transporter from "../images/Transporter2.jpg";
import Wholesaler from "../images/Wholesaler.jpg";

import SignIn from "../login/SignIn";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root1: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(3),

  },
  media: {
    height: 100,
    paddingLeft: 20,
  },
}));


function Cards() {
  const classes = useStyles();

  return (
    <Router  >
      <Grid className={classes.root1} >
      <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Owner{" "}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/owner" size="small" color="primary">
                {" "}
                Click Here{" "}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Supplier
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/supplier" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Transporter
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/transporter" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Manufacturer
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/manufacturer" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>
       
      </Grid>
      <Grid className={classes.root1}>
      <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Wholesaler
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/wholesaler" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Distributor
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/distributor" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item md={3} style={{ margin: "5px" }}>
          <Card >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" href="/customer" size="small" color="primary">
                  Customer
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button href="/customer" size="small" color="primary">
                Click Here
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Router>
  );
}
export default Cards;
