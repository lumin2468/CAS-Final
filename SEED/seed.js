const { consolidatedSchema } = require("../models/master")

const {User,Designation,DistrictName}= consolidatedSchema
const mongoose = require('mongoose');

// Increase the default timeout value (in milliseconds)

mongoose.connect('mongodb+srv://Admin:8r2orA6FnbbZZXOS@cluster0.s121j0z.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000, // 30 seconds timeout
});

// const seed=async()=>{
//     const admin= new User({name:'admin', email: 'admin@example.com', password: '$2a$12$8ZmK5jgGAvq48w6yfleFVOshZDv15f4TFHp8z0FVkCPaOQ.CdCgRm', mobile: '9675776767', designation:'64bf7d618be72ad5fb8eb923'})
//     const newAdmin=await admin
//     console.log(newAdmin)
//     newAdmin.save()
// }

const seed=async()=>{
    const district= new DistrictName({name:'Khorda'})
    const newDis=await district
    console.log(newDis)
    newDis.save()
}
seed()

// const seed=async()=>{
//     const designation= new Designation({name:'DFO'})
//     const newDesg=await designation
//     console.log(newDesg)
//     newDesg.save()
// }
// seed()

