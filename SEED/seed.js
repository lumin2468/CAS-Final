const { consolidatedSchema } = require("../models/master")

const {User,Designation,DistrictName}= consolidatedSchema
const mongoose = require('mongoose');

// Increase the default timeout value (in milliseconds)

mongoose.connect('mongodb+srv://Admin:8r2orA6FnbbZZXOS@cluster0.s121j0z.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 30000, // 30 seconds timeout
});
// director123
const seed=async()=>{
    const director= new User({name:'Director', email: 'director@example.com', password: '$2a$12$tbZhQURQA2oQoYsDmnGmfOOAB7UGCS.bJ7J.wZT6Uf3oL4231wkHS', mobile: '967577665', designation:'64c18b20f266f19d9a36be72', directorateId:'64c18f2c7690204365a3e915'})
    const newDir=await director
    console.log(newDir)
    newDir.save()
}

// const seed=async()=>{
//     const district= new DistrictName({name:'Cuttack'})
//     const newDis=await district
//     console.log(newDis)
//     newDis.save()
// }
seed()

// const seed=async()=>{
//     const designation= new Designation({name:'CDVO'})
//     const newDesg=await designation
//     newDesg.save()
// }


