import RawMaterial from '../models/raw-material.model';

const saveRawMaterialDetails = async (req, res) => {
    let rawMaterial = new RawMaterial(req.body.description, req.body.quantity, req.body.rawMaterialAddress,req.body.status,req.body.supplierAddress,req.body.supplierName,req.body.manufacturerAddress);
    let returnValue = await rawMaterial.save();
    if (returnValue) {
        res.status(201).send({
            'message': 'Saved!',
            'error': false
        });
    } else {
        res.status(201).send({
            'message': 'Saved!',
            'error': true
        });
    }
}
const getRMByStatus = async (req, res) => {
    let RM = new RawMaterial();
    let returnValues = await RM.getRMByStatus(req.params.status);
    res.send(returnValues)

    
}
const getRMAll = async (req, res) => {
    let RM = new RawMaterial();
    let returnValues = await RM.getRMAll();
    res.send(returnValues)


}
const getRMById = async (req, res) => {
    let RM = new RawMaterial();
    let returnValues = await RM.getRMId(req.params.id);
    res.send(returnValues)


}
const changeStatus = async (req, res) => {
    let RM = new RawMaterial();
    let returnValues = await RM.changeStatus(req);
    res.send(returnValues)


}
const changeManif = async (req, res) => {
    let RM = new RawMaterial();
    let returnValues = await RM.changeManif(req);
    res.send(returnValues)


}

export { saveRawMaterialDetails , getRMByStatus,getRMAll,getRMById,changeStatus,changeManif};