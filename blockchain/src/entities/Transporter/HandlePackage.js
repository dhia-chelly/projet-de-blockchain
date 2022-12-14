import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import axios from "axios";
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#1565c0',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function HandlePackage(props) {
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  let [pAddress, setpAddress] = useState("");
  let [type, setType] = useState("");
  let [cid, setCid] = useState("");
  const [dwa, setDwa] = useState([]);

  const classes = useStyles();

  function transport(data) {
    isLoading(true);

    if(data.status == "S_T"){
      pAddress = data.rawMaterialAddress
      cid = data.rawMaterialAddress
      type = 1
    }
    console.log(pAddress)
    console.log( type)
    console.log( cid)
        supplyChain.methods.transporterHandlePackage(pAddress, type, cid).send({from: account})
        .once('receipt', async (receipt) => {
          await axios.post(
            "http://localhost:3001/api/raw-material/change-status",
            { status: "M_T", adrRM: data.rawMaterialAddress }
          );
          getRawMaterial();
          isLoading(false);
        })
  }

  async function getRawMaterial() {
    let data = await axios.get("http://localhost:3001/api/raw-material/get-by-status/S_T")
    setDwa(data.data);
    console.log(data.data);
    isLoading(false);
  }
  useEffect( () => {
    getRawMaterial();
  }, []);
  return (
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell>Description</StyledTableCell>
          <StyledTableCell align="center">Quantity</StyledTableCell>
          <StyledTableCell align="center">from</StyledTableCell>
          <StyledTableCell align="center">to</StyledTableCell>
          <StyledTableCell align="center">Raw Material Package</StyledTableCell>
          <StyledTableCell align="center">Request</StyledTableCell>

        </TableRow>
      </TableHead>
      <TableBody>
        {dwa.map((data) => (
          <StyledTableRow key={data.rawMaterialAddress}>
            <StyledTableCell component="th" scope="row">
            {data.description}
            </StyledTableCell>
            <StyledTableCell align="center">{data.quantity}</StyledTableCell>
            <StyledTableCell align="center">{data.supplierName}</StyledTableCell>
            <StyledTableCell align="center">{data.manufacturerAddress}</StyledTableCell>
            <StyledTableCell align="center">{data.rawMaterialAddress}</StyledTableCell>
           
            
            <StyledTableCell align="center"  > <Button
      variant="outlined" size="small" color="primary" 
      className={classes.button}
      onClick={() => transport(data)}
      endIcon={<Icon>send</Icon>}
    >
      transport
    </Button></StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );

}
/*
  return (
    <Grid container style={{ backgroundColor: "white", display: "center", alignItems: "center", maxWidth: 400, justify: "center"}}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          
          <Typography component="h1" variant="h5">Enter Package Details</Typography>
          <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="pAddress" label="Package Address" name="pAddress"/>
            </Grid>
            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="type" label="Transporter type" name="type"/>
            </Grid>
            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="cid" label="Cid" name="cid"/>
            </Grid>

            </Grid>
            <Button
              type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={ handleSubmit } >
              Submit
            </Button>
          
          </form>
        </div>
      </Container>
    </Grid>
  );
}
*/