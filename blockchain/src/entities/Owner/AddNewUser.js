import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import Grid from "@material-ui/core/Grid";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseLine";

import axios from "axios";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';



const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3,1, 2),
  },
}));
function AddNewUser(props) {

  const classes = useStyles();
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [name, setName] = useState("");
  const [locationx, setLocationX] = useState("");
  const [locationy, setLocationY] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [loading, isLoading] = useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  console.log([account]);

  const handleInputChange = (e) => {
    if (e.target.id === "name") {
      setName(e.target.value);
    } else if (e.target.id === "locationx") {
      setLocationX(e.target.value);
      //change position.lat in localStrage
      let pos = JSON.parse(localStorage.getItem("currentpos"));
      pos.lat = Number(e.target.value.replaceAll(" ", ""));
      localStorage.setItem("currentpos", JSON.stringify(pos));
    } else if (e.target.id === "locationy") {
      setLocationY(e.target.value);
      //change position.lat in localStrage
      let pos = JSON.parse(localStorage.getItem("currentpos"));
      pos.lng = Number(e.target.value.replaceAll(" ", ""));
      localStorage.setItem("currentpos", JSON.stringify(pos));
    } else if (e.target.id === "address") {
      setAddress(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    const RObject = {
      name: name,
      locationx: locationx,
      locationy: locationy,
      role: role,
      address: address,
    };
    var n = web3.utils.padRight(web3.utils.fromAscii(name), 64);
    var loc = [String(locationx), String(locationy)];
    supplyChain.methods
      .registerUser(n, loc, Number(role), address)
      .send({ from: account })
      .once("receipt", (receipt) => {
        axios.post("http://localhost:3001/api/user/save-details", RObject);

       isLoading(false);
      });
  };

  function getEventData() {
    supplyChain.events
      .UserRegister({ fromBlock: 0, toBlock: "latest" })
      .on("data", (event) => {
        console.log(event);
      });
  }

  if (loading) {
    return <Loader></Loader>;
  }
  getEventData();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add New User
        </Typography>
        <form className={classes.root} noValidate autoComplete="on">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            onChange={handleInputChange}
          />
          <br></br>
          <TextField
            id="locationx"
            label="Locationx"
            variant="outlined"
            value={JSON.parse(localStorage.getItem("currentpos")).lat}
            onChange={handleInputChange}
          />
          <br></br>
          <TextField
            id="locationy"
            label="Locationy"
            variant="outlined"
            value={JSON.parse(localStorage.getItem("currentpos")).lng}
            onChange={handleInputChange}
          />
          <br></br>
          <FormControl variant="outlined" className={classes.formControl}>

          <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
          <Select
            id="role"
            label="Role"
            onChange={handleChange}
            variant="outlined"
          >
            <MenuItem value={"1"}>supplier</MenuItem>
            <MenuItem value={"2"}>transporter</MenuItem>
            <MenuItem value={"3"}>manufacturer</MenuItem>
            <MenuItem value={"4"}>wholesaler</MenuItem>
            <MenuItem value={"5"}>distributor</MenuItem>
            <MenuItem value={"6"}>customer</MenuItem>
          </Select>
          </FormControl>
          <br></br>
          <TextField
            id="address"
            label="Account"
            variant="outlined"
            onChange={handleInputChange}
          />
          <br></br>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default AddNewUser;
