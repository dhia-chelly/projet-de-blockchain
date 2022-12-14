import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import RawMaterial from "../../build/RawMaterial.json";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import axios from "axios";
import Transactions from "../../build/Transactions.json";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { saveAs } from "file-saver";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#1565c0",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function ViewRawMaterials(props) {
  const classes = useStyles();
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  let [manufacturer, setManufacturer] = useState("");
  const [dwa, setDwa] = useState([]);
  function req(data) {}
  async function handleSubmit() {
    var rawMaterialAddresses = await supplyChain.methods
      .getAllPackages()
      .call({ from: account });
    var components = rawMaterialAddresses.map((addr) => {
      return (
        <div>
          <ul>
            <li>
              <Link
                to={{
                  pathname: `/supplier/view-raw-material/${addr}`,
                  query: {
                    address: addr,
                    account: account,
                    web3: web3,
                    supplyChain: supplyChain,
                  },
                }}
              >
                {addr}
              </Link>
            </li>
          </ul>
        </div>
      );
    });
    setAddresses(components);
    isLoading(true);
  }
  async function getRawMaterial() {
    let data = await axios.get(
      "http://localhost:3001/api/raw-material/get-by-status/"
    );
    setDwa(data.data);
    console.log(data.data);
    isLoading(false);
  }
  function sendPackage(dataRM) {
    console.log(dataRM)
    let rawMaterialAddress = dataRM.rawMaterialAddress
    manufacturer=dataRM.manufacturerAddress
    let rawMaterial = new web3.eth.Contract(
      RawMaterial.abi,
      rawMaterialAddress
    );
    let signature = prompt("Enter signature");
    supplyChain.methods
      .sendPackageToEntity(manufacturer, account, rawMaterialAddress, signature)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        let data = await rawMaterial.methods
          .getSuppliedRawMaterials()
          .call({ from: account });
        let txnContractAddress = data[6];
        let transporterAddress = data[4];
        let txnHash = receipt.transactionHash;
        const transactions = new web3.eth.Contract(
          Transactions.abi,
          txnContractAddress
        );
        let txns = await transactions.methods
          .getAllTransactions()
          .call({ from: account });
        let prevTxn = txns[txns.length - 1][0];
        transactions.methods
          .createTxnEntry(
            txnHash,
            account,
            transporterAddress,
            prevTxn,
            "10",
            "10"
          )
          .send({ from: account });
       
        await axios.post(
          "http://localhost:3001/api/raw-material/change-status",
          { status: "S_T", adrRM: rawMaterialAddress }
        ).then(  getRawMaterial());
      });

  }
  useEffect(() => {
    getRawMaterial();
  }, []);

  if (loading) {
    return (
      <div>
        <h4>Raw Material addresses</h4>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell align="center">Quantity</StyledTableCell>
                <StyledTableCell align="center">
                  Raw Material Address
                </StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dwa.map((data) => (
                <StyledTableRow key={data.rawMaterialAddress}>
                  <StyledTableCell component="th" scope="row">
                    {data.description}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {data.quantity}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                  <Link to={{ pathname: `/supplier/view-raw-material/${data.rawMaterialAddress}`,
                   query: { address: data.rawMaterialAddress, account: account, web3: web3, supplyChain: supplyChain } }}>                    {data.rawMaterialAddress}</Link>


                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {(() => {
                      if (data.status == "S") {
                        return <div>Created</div>;
                      } else if (data.status == "M_req") {
                        return <div>Requested</div>;
                      }
                      else if (data.status == "S_res") {
                        return <div>Waiting to be sent</div>;
                      }
                      else if (data.status == "S_T") {
                        return <div>Waiting to be transported</div>;
                      }
                      else if (data.status == "T_M") {
                        return <div>Collected by transporter</div>;
                      } else if (data.status == "M") {
                        return <div>Delivred</div>;
                      }
                    })()}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                  {(() => {
                      if (data.status == "S") {
                        return <div></div>;
                      } else if (data.status == "M_req") {
                        return <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={() => req(data)}
                        endIcon={<Icon>send</Icon>}
                      >
                        <Link
            to={{
              pathname: `/supplier/view-request/${data.rawMaterialAddress}`,
              query: {
                address: data.rawMaterialAddress,
                account: account,
                web3: web3,
                supplyChain: supplyChain,
              },
            }}
          >
            View Requests
          </Link>
                      </Button>
                      }
                      else if (data.status == "S_res") {
                        return <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={() => sendPackage(data)}
                        endIcon={<Icon>send</Icon>}
                      >
                        Send Package
                      </Button>
                      }
                      else if (data.status == "S_T") {
                        return <div></div>;
                      }
                      else if (data.status == "T_M") {
                        return <div></div>;
                      } else if (data.status == "M") {
                        return <div></div>;
                      }
                    })()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    handleSubmit();
    return <p>Getting addresses</p>;
  }
}
