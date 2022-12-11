import db from "../db/init";
const usersTab = db.collection('users');

class User {
  constructor(name, locationx, locationy, role, address) {
    this.name = name;
    this.locationx = locationx;
    this.locationy = locationy;
    this.role = role;
    this.address = address;
  }
  async save() {
    return usersTab.add({
        name: this.name,
        locationx: this.locationx,
        locationy: this.locationy,
        role: this.role,
        address: this.address,
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      })
      .catch((e) => {
        return new Promise((resolve, reject) => {
          reject(false);
        });
      });
  }
  async getAll() {
    let snapshot = await db.collection("users").get();
    const list = snapshot.docs.map((doc)=>(doc.data()));
    return list
  }
  async getByRole() {
    let snapshot = await db.collection("users").where('role', '==', '1').get();
    const list = snapshot.docs.map((doc)=>(doc.data()));
    return list
  }
}

export default User;
