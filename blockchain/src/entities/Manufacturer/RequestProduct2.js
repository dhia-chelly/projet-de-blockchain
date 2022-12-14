import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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

export default function RequestProduct2Manufacturer(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      flexGrow: 1,

    },
    table: {
      minWidth: 700,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });
  const classes = useStyles();

  const [account] = useState(props.account);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(true);
  const [dwa, setDwa] = useState([]);

  async function getRawMaterial() {
    let data = await axios.get("http://localhost:3001/api/raw-material/get-by-status/S")
    setDwa(data.data);
   /* 
    var accountSupp="0xf97Dd89a94EBC179f3482C645bCED65782A0e7D3"
    var rawMaterialAddresses = await supplyChain.methods
      .getAllPackages()
      .call({ from: accountSupp });

    rawMaterialAddresses.map(async (addr) => {
      let rawMaterial = new web3.eth.Contract(RawMaterial.abi, addr);
      let data = await rawMaterial.methods
        .getSuppliedRawMaterials()
        .call({ from: accountSupp });
      data[1] = web3.utils.hexToUtf8(data[1]);
      var test = await supplyChain.methods.getUserInfo(data[5]).call();
      var nameS = web3.utils.hexToUtf8( test.name).trim()
      dwa.push([addr, data[1], data[2], data[3], data[4],data[5] , data[6],nameS]);
    });

    // console.log(dwa)
    setDwa(dwa);
    console.log(dwa)*/
    isLoading(false);
  }

  function req(data) {
    isLoading(true);
    let signature = prompt('Enter signature');
    supplyChain.methods
      .requestProduct(
        account,
        data.supplierAddress,
        data.rawMaterialAddress,
        signature
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {
        console.log(data.rawMaterialAddress)
        await axios.post(
          "http://localhost:3001/api/raw-material/change-status",
          { status: "M_req", adrRM: data.rawMaterialAddress }
        );
        getRawMaterial();
        alert("Request Made to Supplier!");
        isLoading(false);
      });
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
            <StyledTableCell align="center">Supplier</StyledTableCell>
            <StyledTableCell align="center">Raw Material Address</StyledTableCell>
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
              <StyledTableCell align="center">{data.rawMaterialAddress}</StyledTableCell>
             
              
              <StyledTableCell align="center"  > <Button
        variant="outlined" size="small" color="primary" 
        className={classes.button}
        onClick={() => req(data)}
        endIcon={<Icon>send</Icon>}
      >
        Request
      </Button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );

}
