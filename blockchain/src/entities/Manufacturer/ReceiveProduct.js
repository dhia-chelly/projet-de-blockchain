import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader";
import RawMaterial from "../../build/RawMaterial.json";
import Transactions from "../../build/Transactions.json";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import AllInboxIcon from '@material-ui/icons/AllInbox';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function ReceiveProduct(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [dwa, setDwa] = useState([]);

  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  let [address, setAddress] = useState("");
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);

  async function verifySignature(sellerAddress, signature) {
    let v = "0x" + signature.slice(130, 132).toString();
    let r = signature.slice(0, 66).toString();
    let s = "0x" + signature.slice(66, 130).toString();
    let messageHash = web3.eth.accounts.hashMessage(address);
    let verificationOutput = await supplyChain.methods
      .verify(sellerAddress, messageHash, v, r, s)
      .call({ from: account });

    return verificationOutput;
  }

  async function recive(adr) {
    address = adr 
    console.log(adr)
    console.log(address)
    let rawMaterial = new web3.eth.Contract(RawMaterial.abi, address);
    let data = await rawMaterial.methods
      .getSuppliedRawMaterials()
      .call({ from: account });
    let events = await supplyChain.getPastEvents("sendEvent", {
      filter: { packageAddr: address },
      fromBlock: 0,
      toBlock: "latest",
    });
    events = events.filter((event) => {
      return event.returnValues.packageAddr == address;
    });

    console.log(events);
    let supplier = data[3];
    let signature = events[0]["returnValues"][3];
    let verificationOutput = await verifySignature(supplier, signature);
    if (verificationOutput) {
      alert("Signature verified");
      supplyChain.methods
        .manufacturerReceivedPackage(address, account, supplier, signature)
        .send({ from: account })
        .once("receipt", async (receipt) => {
          await axios.post(
            "http://localhost:3001/api/raw-material/change-status",
            { status: "M", adrRM: adr }
          );
          getRawMaterial();
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
              transporterAddress,
              account,
              prevTxn,
              "10",
              "10"
            )
            .send({ from: account });
        });
    }
  }
  async function getRawMaterial() {
    let data = await axios.get(
      "http://localhost:3001/api/raw-material/get-by-status/M_T"
    );
    setDwa(data.data);
    console.log(data.data);
    isLoading(false);
  }
  useEffect(() => {
    getRawMaterial();
  }, []);

  if (loading) {
    return (
      <div>
        <p>
          Package with address <b>{address}</b> received!
        </p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {dwa.map((data) => (
          <Grid item xs={3}>
            <Card>
              <CardContent  className={classes.paper}>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  From : {data.supplierName}
                </Typography>
               < AllInboxIcon style={{ fontSize: 75 }}  color="primary"  />
                <Typography className={classes.pos} color="black">
                {data.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small"  onClick={() => recive(data.rawMaterialAddress)} >Recive</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
