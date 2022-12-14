import db from '../db/init';

class RawMaterial {

    constructor(description, quantity, rawMaterialAddress,status,supplierAddress,supplierName,manufacturerAddress) {
        this.description = description;
        this.quantity = quantity;
        this.rawMaterialAddress = rawMaterialAddress;
        this.status=status;
        this.supplierAddress=supplierAddress;
        this.supplierName=supplierName;
        this.manufacturerAddress=manufacturerAddress;
    }

    async save() {
        return db.collection('raw-materials').doc(this.rawMaterialAddress).set({
            'description': this.description,
            'quantity': this.quantity,
            'rawMaterialAddress': this.rawMaterialAddress,
            'status': this.status,
            'supplierAddress': this.supplierAddress,
            'supplierName': this.supplierName,
            'manufacturerAddress':this.manufacturerAddress

        }).then(() => {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        }).catch((e) => {
            return new Promise((resolve, reject) => {
                reject(false)
            })
        })
    }
    async getRMByStatus(s) {
        let snapshot = await db.collection("raw-materials").where('status', '==', s).get();
        const list = snapshot.docs.map((doc)=>(doc.data()));
        return list
      }
      
      async getRMAll() {
        let snapshot = await db.collection("raw-materials").get();
        const list = snapshot.docs.map((doc)=>(doc.data()));
        return list
      }
      async getRMId(id) {
        let snapshot =await db.collection("raw-materials").where('rawMaterialAddress', '==',id).get()
        const rm = snapshot.docs.map((doc)=>(doc.data()));
        return rm;
      }
      async changeStatus(req) {
        return await db.collection("raw-materials").doc(req.body.adrRM).update({status: req.body.status}).
        then(() => {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        }).catch((e) => {
            return new Promise((resolve, reject) => {
                reject(false)
            })
        })
        
    }
    async changeManif(req) {
        return await db.collection("raw-materials").doc(req.body.adrRM).update({manufacturerAddress: req.body.adrM }).
        then(() => {
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        }).catch((e) => {
            return new Promise((resolve, reject) => {
                reject(false)
            })
        })
    }
      
      
}

export default RawMaterial;