import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Transactions from "../../build/Transactions.json";
import RawMaterial from "../../build/RawMaterial.json";
import axios from "axios";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { saveAs } from "file-saver";


const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80ch",
    },
  },
  formControl: {
    width: "100%", // Fix IE 11 issue.
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

export default function AddRawMaterial(props) {
  const classes = useStyles();

  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [transporterAddress, setTransporterAddress] = useState("");
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transporters, setTransporters] = useState([]);
  //Qr Code
  const [size, setSize] = useState(400);
  const [bgColor, setBgColor] = useState("ffffff");
  const [qrCode, setQrCode] = useState("");

  const downloadImage = (dataString) => {
    saveAs(`http://api.qrserver.com/v1/create-qr-code/?data=${dataString}&size=${size}x${size}&bgcolor=${bgColor}, ${dataString}.jpg`)
// Put your image url here.
  }
  const handleChange = (event) => {
    console.log(event.target.value)
    setTransporterAddress(event.target.value);
  };
  const handleInputChange = (e) => {
    if (e.target.id === "description") {
      setDescription(e.target.value);
    } else if (e.target.id === "quantity") {
      setQuantity(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    let d = web3.utils.padRight(web3.utils.fromAscii(description), 64);
    supplyChain.methods
      .createRawMaterialPackage(d, quantity, transporterAddress, account)
      .send({ from: account })
      .once("receipt", async (receipt) => {
        let rawMaterialAddresses = await supplyChain.methods
          .getAllPackages()
          .call({ from: account });
        let rawMaterialAddress =
          rawMaterialAddresses[rawMaterialAddresses.length - 1];
        const rawMaterial = new web3.eth.Contract(
          RawMaterial.abi,
          rawMaterialAddress
        );
        let data = await rawMaterial.methods
          .getSuppliedRawMaterials()
          .call({ from: account });
        let txnContractAddress = data[6];
        let txnHash = receipt.transactionHash;
        const transactions = new web3.eth.Contract(
          Transactions.abi,
          txnContractAddress
        );
        transactions.methods
          .createTxnEntry(
            txnHash,
            account,
            rawMaterialAddress,
            txnHash,
            "10",
            "10"
          )
          .send({ from: account }); //TODO: get user location -> (latitude, longitude)
        console.log(account);

        let supplier = await axios.post(
          "http://localhost:3001/api/user/get-by-adr/",
          { adr: account }
        );
        console.log(supplier.data);
        const RObject = {
          description: description,
          supplierAddress: account,
          supplierName: supplier.data[0].name,
          quantity: quantity,
          rawMaterialAddress: rawMaterialAddress,
          status: "S",
          manufacturerAddress:account,
        };
        console.log(RObject);
        axios
          .post("http://localhost:3001/api/raw-material/save-details", RObject)
          .then((res) => console.log(res.data));
          downloadImage(`description : ${description} , supplierName:${RObject.supplierName},dateEXP:${new Date().toString()} ,transporter Address:${transporterAddress},quantity:${quantity}`)
          
        isLoading(false);
        //
      });
  };

  
  async function getTransporters() {
    let data = await axios.get("http://localhost:3001/api/user/get-by-role/2");
    setTransporters(data.data);
  }
  useEffect( () => {
    getTransporters();
  }, []);
  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {" "}
            Add Raw Material
          </Typography>
          <form className={classes.form} autoComplete="on">
                <TextField
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="description"
                  label="Material Description"
                  name="description"
                />

                <TextField
                  variant="outlined"
                  onChange={handleInputChange}
                  required
                  fullWidth
                  id="quantity"
                  label="Material Quantity"
                  name="quantity"
                />
              
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Transporter
                </InputLabel>
                <Select
                  id="transport-address"
                  label="Transporter Address"
                  name="transport-address"
                  required
                  onChange={handleChange}
                  variant="outlined"
                >
                  {transporters.map((data) => (
                    <MenuItem value={data.address}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>

  );
}
