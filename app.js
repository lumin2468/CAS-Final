if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const ejs = require("ejs");
engine = require("ejs-mate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { consolidatedSchema } = require("./models/master");
const verifyToken = require("./helper/auth");
const isAuthenticated = require("./helper/authenticated");
const session = require('express-session');
const generateVoucherNumber= require("./helper/dirCounter");



// Import the Mongoose models
const {
  Department,
  Directorate,
  District,
  DistrictName,
  FinancialYear,
  Scheme,
  BankDetails,
  SchemeComponentMaster,
  SchemeBankMaster,
  DirPayment,
  DirCounter,
  User,
  modeofPayment,
  Designation,
} = consolidatedSchema;

// Create the Express app
const app = express();


const pages=['/cas/dashboard/assets','/cas/assets','/cas/directorate/assets', '/cas/district/assets','/cas/district/receipt/assets' ]
// app.use(
//   "/cas/assets",
//   express.static((path.join(__dirname,"/public/assets")))
// );
// app.use(
//   "/cas/district/assets",
//   express.static((path.join(__dirname,"/public/assets")))
// );
// app.use(
//   "/cas/directorate/assets",
//   express.static((path.join(__dirname,"/public/assets")))
// );
// app.use(
//   "/cas/dashboard/assets",
//   express.static((path.join(__dirname,"/public/assets")))
// );
app.use(pages,
  express.static((path.join(__dirname,"/public/assets")))
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public/")));
app.engine("ejs", engine);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// console.log(process.env.SECRET_KEY)
// -------------------Session Storage --------------------------------
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true
}));


// Connect to MongoDB
mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define routes
app.get("/cas", async (req, res) => {
  const designation = await Designation.find();
  res.render("index", { designation });
});

app.post(
  "/cas/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
    body("userType").notEmpty(),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, userType } = req.body;
      console.log(req.body);

      // Find the designation by name
      const designation = await Designation.findOne({ name: userType });
      if (!designation) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Find the user by email and designation
      const user = await User.findOne({
        email,
        designation: designation._id,
      }).populate("designation");
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid credentials password" });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user._id,
          designation: user.designation,
          directorate:user.directorateId,
          officeId:user.officeId,
        },
        };

      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Error during token generation:", err);
            return res.status(500).redirect("/cas",{ message: "Token generation failed" });
          }
          req.session.token = token;
          res.redirect(`/cas/dashboard/`);
        }
      );
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.get("/cas/dashboard", verifyToken, (req, res) => {
  const { designation, id } = req.user;
  console.log(`gffgfghf`,req.user);

  // Render the dashboard EJS template based on the user's designation
  if (designation.name === "Admin") {
    res.render("dashboard", {
      username: req.user.username,
    });
  } else if (designation.name === "Director") {
    
    res.render('directorate/dashboard');
  } else if (designation.name === "DFO") {
    res.render(`districtOffice/district_office`, {
      title: "Dashboard",
      username: req.user.username,
    });
  } else {
    // Handle other designations or unknown designation
    res.status(403).json({ message: "Forbidden" });
  }
});

// // Example route to get all departments
app.get("/cas/departments", async (req, res) => {
  try {
    const departments = await Department.find();
    res.render("departments", { departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/departments", async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const departments = new Department({ name });
    departments.save();
    res.redirect("departments");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/cas/directorate",isAuthenticated, async (req, res) => {
  try {
    const directorate = await Directorate.find().populate("department");
    const departments = await Department.find();
  
    res.render("directorate", { departments, directorate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/directorate", async (req, res) => {
  try {
   
    const { department, directorate } = req.body;
    const dep = await Department.findOne({ name: department });
    const dir = new Directorate({ name: directorate, department: dep._id });
    dep.directorate.push(dir?._id)
    dep.save();
    dir.save();
    res.redirect("directorate");
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cas/district", async (req, res) => {
  try {
    const directorates = await Directorate.find();
    const districtName = await DistrictName.find();
    const district = await District.find()
      .populate("directorate")
      .populate("district");
    console.log(district);
    res.render("districtLevelOffice", { directorates, district, districtName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/district", async (req, res) => {
  try {
    const { directorate, districtName, office_name, office_address } = req.body;
    const directorateName = await Directorate.findOne({ name: directorate });
    const districtRef = await DistrictName.findOne({ name: districtName });
    const districtOffice = new District({
      name: office_name,
      directorate: directorateName._id,
      district: districtRef._id,
      address: office_address,
    }); 
    
    
    directorateName.districts.push(districtOffice._id);
    directorateName.save()
    await districtOffice.save();
    
    res.redirect("district");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cas/scheme", async (req, res) => {
  try {
    const directorates = await Directorate.find();
    const schemes = await Scheme.find().populate("directorate");
    console.log(schemes);
    res.render("scheme", { directorates, schemes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/scheme", async (req, res) => {
  try {
    const { schemeName, startDate, endDate, directorate, schemeDesc } =
      req.body;
      const directorateName = await Directorate.findOne({ name: directorate });
      console.log(`gghjghghghghg`,directorateName)
    const schemeData = new Scheme({
      name: schemeName,
      startDate: startDate,
      endDate: endDate,
      directorate: directorateName._id,
      description: schemeDesc,
    });
    const newScheme = await schemeData;
    directorateName.schemes.push(newScheme._id)
    directorateName.save()

    newScheme.save();
    res.redirect("scheme");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ... Define more routes for other resources ...

app.get("/cas/bank", async (req, res) => {
  try {
    const level = ["Directorate", "District"];
    const directorate = await Directorate.find();
    const districts =await  District.find();
    res.render("banks", { directorate, districts, level });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/bank", async (req, res) => {
  try {
  const {bankName,Ifsc_code,branchName,accountNo,Balance,directorate,district_office, address}=req.body;
  const direcOfc=await Directorate.findOne({name:directorate});
  let distOfc={}
  console.log(district_office)
  if(!(district_office ==='Select')){
    distOfc=await District.findOne({name:district_office});
    console.log(distOfc)
  }
  
  const bankMaster=new BankDetails({directorate:direcOfc?._id, office:distOfc?._id,bank:bankName, accountNumber:accountNo,IFSCNumber:Ifsc_code,balance:Balance,branch:branchName,address:address })
  if(!(directorate ==='Select')){
    direcOfc.bank=bankMaster._id;
    direcOfc.save()
  }
 
  if(!(district_office ==='Select')){
    distOfc.bank.push(bankMaster._id)
    distOfc.save()
  }
  bankMaster.save()
  res.status(200).redirect('/cas/bank')
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/cas/scheme2bank", async (req, res) => {
  try {
    const directorate_data= await Directorate.find()
    const district_office=await District.find()
    const bank_details=await BankDetails.find()
    const scheme_details=await Scheme.find()
    
   
    res.render("SchemeBank.ejs",{directorate_data,bank_details,scheme_details,district_office});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/cas/scheme2bank", async (req, res) => {
  try {
    console.log(`I am in`)
    const {directorate,office_name,scheme_name,bank_name, scheme_desc}= req.body
    const office_details= await District.findOne({name: office_name})
    const scheme_details= await Scheme.findOne({name: scheme_name})
    const bank_details= await BankDetails.findOne({bank: bank_name})
    
    const schemeBankDetails=new SchemeBankMaster({office:office_details._id, directorate:office_details.directorate,scheme:scheme_details._id,bankId:bank_details._id,description:scheme_desc})
    scheme_details.bank=schemeBankDetails.bankId
    scheme_details.save()
    schemeBankDetails.save()
   res.redirect('/cas/scheme2bank')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cas/scheme2component", async (req, res) => {
  try {
    const scheme_details=await Scheme.find()
    
   
    res.render("schemeComponent.ejs",{scheme_details});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/cas/scheme2component", async (req, res) => {
  try {
    const {component_name,scheme_name,code,compo_desc}= req.body
    // const directorate_data= await Directorate.find()
    // const district_office=await District.find()
    // const bank_details=await BankDetails.find()
    const scheme_value=await Scheme.findOne({name:scheme_name})
    const new_Component= new SchemeComponentMaster({name:component_name,code:code, scheme:scheme_value._id, desc:compo_desc})
    new_Component.save()
    scheme_value.components.push(new_Component._id)
    scheme_value.save()
    res.redirect('/cas/scheme2component')
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/cas/directorate/payment',isAuthenticated,async (req, res) => {
  try {
    const directorateOfc=req.user.user.directorate
    let voucherNo=""
   
    if(req.query.voucher){
      voucherNo=req.query.voucher
    }
   
    const financialYear= await FinancialYear.find()
    const modeofpmnt= await modeofPayment.find()
    const directorate_data= await Directorate.findOne({_id:directorateOfc})
    .populate('districts')
    .populate('bank')
    const schemes=await Scheme.find({directorate:directorate_data._id}).populate('components')
     const paymentDetails= await DirPayment.find()
    .populate("distOfcName")
    .populate("scheme")
    .populate("receiverBank")
    .populate("financialYear")
    
    res.render('directorate/payment-voucher',{directorate_data, schemes, financialYear,modeofpmnt, voucherNo, paymentDetails})
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }});

  app.post('/cas/directorate/payment',async (req, res) => {
    try {
      const {date, modeof_payment,transaction_Id,transaction_date,sanction_ord_no, ref_voucher_no, schemeName, directorate, ofc_name,receiver_bank,p_amount, financial_year,desc}=req.body;
      const directorate_data= await Directorate.findOne({name:directorate})
      const district_office=await District.findOne({name:ofc_name})
      const scheme_details=await Scheme.findOne({name:schemeName})
      const finacialYearDetails=await FinancialYear.findOne({year:financial_year})
      const bnkDetails=await SchemeBankMaster.findOne({office:district_office._id,scheme:scheme_details._id }).populate('bankId')
      console.log(`BANK MAPPING`,bnkDetails)
  
      //counter implementation for generating aucto-voucher
      const counter = await DirCounter.findOneAndUpdate(
        {
          directorate,
          district:ofc_name,
          scheme:schemeName,
          financialYear:financial_year,
        },
        { $inc: { count: 1 } }, // Increment the counter by 1
        { upsert: true, new: true } // Create a new document if it doesn't exist
      );
      
      const voucherNo = generateVoucherNumber(directorate_data.abbreviation, district_office.abbreviation, scheme_details.abbreviation, financial_year, counter.count);
      const payment = new DirPayment({
        date,
        modeofPayment:modeof_payment,
        modeofPaymentId:transaction_Id,
        modeofPaymentDate:transaction_date,
        directorate:directorate_data._id,
        distOfcName:district_office._id,
        sanctionOrdNo:sanction_ord_no,
        refVoucherNo:ref_voucher_no,
        scheme:scheme_details._id,
        receiverBank:bnkDetails.bankId._id,
        amount:p_amount,
        financialYear:finacialYearDetails._id,
        autoVoucherNo:voucherNo,
        narration:desc,
        status:'pending'
      });

      
     payment.save()
     
     res.redirect(`/cas/directorate/payment?voucher=${encodeURIComponent(voucherNo)}`);

     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }});
  
    // /cas/directorate/payments/
    app.get('/cas/directorate/payments/:schemeName', async (req, res) => {
     try {
        const schemeName = req.params.schemeName;
        const componentData = await Scheme.findOne({ name: schemeName }).populate('components');
        res.json(componentData)
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from the database.' });
      }
    });

    app.get('/cas/directorate/payments/bank/:officeName/:schemeName', async (req, res) => {
      try {
         const {officeName, schemeName} = req.params;
         console.log(officeName, schemeName); 
         const ofcId=await District.findOne({name: officeName})
         const schmId=await Scheme.findOne({name: schemeName})
         const bnkDetails=await SchemeBankMaster.find({office:ofcId._id,scheme:schmId._id }).populate('bankId')
         res.json(bnkDetails);
        //  const componentData = await Scheme.findOne({ name: schemeName }).populate('components');
        //  res.json(componentData)
       } catch (error) {
         console.error('Error fetching data:', error);
         res.status(500).json({ error: 'Failed to fetch data from the database.' });
       }
     });

    //  ---------------DistOfc-------------------

    app.get('/cas/district/acknmnt',isAuthenticated, async (req, res) => {
      try {
        const office_Id=req.user.user.officeId
        const paymentDetails= await DirPayment.find({distOfcName:office_Id})
        .populate("distOfcName")
        .populate("scheme")
        .populate("receiverBank")
        .populate("financialYear")
         res.render('districtOffice/payment_acknowledge',{paymentDetails})
       } catch (error) {
         console.error('Error fetching data:', error);
         res.status(500).json({ error: 'Failed to fetch data from the database.' });
       }
     });
     app.post('/cas/district/payment/:paymentId', async (req, res) => {
      const paymentId = req.params.paymentId;
      const newStatus = req.body.status;
    
      try {
        // Update the payment status in the database based on the paymentId
        await DirPayment.findByIdAndUpdate(paymentId, { status: newStatus });
        res.redirect('/cas/district/acknmnt')
      } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/cas/district/receipt/:id',async (req, res) => {
      try {
       const id = req.params.id;
       const receiptDetails= await DirPayment.findById(id)
       .populate("distOfcName")
       .populate("scheme")
       .populate("receiverBank")
       .populate("financialYear")

        res.render('districtOffice/receipt-voucher', {receiptDetails})
       
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }})
    

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});







