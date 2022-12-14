import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import RawMaterial from "../../build/RawMaterial.json";
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import axios from "axios";
export default function RequestProduct2Manufacturer(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      flexGrow: 1,

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
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(true);
  const [rawMaterialAddress, setrawMaterialAddress] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [dwa, setDwa] = useState([]);

  async function getRawMaterial() {
    let data = await axios.get("http://localhost:3001/api/raw-material/get-by-status/atSupp")
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
    let signature = prompt('Enter signature\n'+ 'the adr of raw material is :' +data.rawMaterialAddress);
    supplyChain.methods
      .requestProduct(
        account,
        data.supplierAddress,
        data.rawMaterialAddress,
        signature
      )
      .send({ from: account })
      .once("receipt", async (receipt) => {
        alert("Request Made to Supplier!");
        isLoading(false);
      });
  }
  useEffect( () => {
    getRawMaterial();
  }, []);


    return (
      <div>
      <Grid container spacing={3}>
                {dwa.map((data) => (

           <Grid item xs={3} key={data[0]}>
            <div>
              <svg
                className="bd-placeholder-img card-img-top"
                width="70%"
                height="150"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder: dwa"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
              >
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"></rect>
                <LocalPharmacyIcon/>
              </svg>

              <div className="card-body">
                <p className="card-text">Description: {data.description}</p>
                <p className="card-text">Supplier: {data.supplierName}</p>
                <p className="card-text">Quantity: {data.quantity}</p>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                  <button onClick={() => req(data)}>Request</button>
                  </div>
                </div>
              </div>
            </div>
            </Grid>
        ))}
        </Grid>
    </div>
    );

}
