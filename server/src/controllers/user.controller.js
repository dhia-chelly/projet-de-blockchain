import User from '../models/user.model';

export const saveUserDetails = async (req, res) => {
    let user = new User(req.body.name, req.body.locationx, req.body.locationy,req.body.role, req.body.address);
    let returnValue = await user.save();
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
export const getUsers = async (req, res) => {
    let user = new User();
    let returnValues = await user.getAll();
    res.send(returnValues)


}
export const getUsersByRole = async (req, res) => {
    let user = new User();
    let returnValues = await user.getByRole(req.params.role);
    res.send(returnValues)


}

export const getUsersByAdr = async (req, res) => {
    let user = new User();
    let returnValues = await user.getUsersByAdr(req.body.adr);
    res.send(returnValues)


}


