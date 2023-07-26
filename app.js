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
const dotenv = require('dotenv');
dotenv.config(); 

// Import the Mongoose models
const {
  Department,
  Directorate,
  District,
  DistrictName,
  Scheme,
  BankDetails,
  SchemeComponentMaster,
  SchemeBankMaster,
  User,
  Designation,
} = consolidatedSchema;

// Create the Express app
const app = express();
app.use(
  "/cas/assets",
  express.static((path.join(__dirname,"/public/assets")))
);
app.use(
  "/cas/directorate/assets",
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

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://Admin:8r2orA6FnbbZZXOS@cluster0.s121j0z.mongodb.net/",
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
        },
      };

      jwt.sign(
        payload,
        "LCu7Ugc54QD3pbaD52pbSIa45tkgbqLT",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error("Error during token generation:", err);
            return res.status(500).json({ message: "Token generation failed" });
          }

          res.redirect(`/cas/dashboard?token=${token}`);
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
    res.render(`cas/directorate/dashboard/${id}`, {
      title: "Dashboard",
      username: req.user.username,
    });
  } else if (designation.name === "DFO") {
    res.render(`cas/district/dashboard/${_id}`, {
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

app.get("/cas/dashboard", async (req, res) => {
  try {
    res.status(200).render("dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cas/directorate", async (req, res) => {
  try {
    const directorate = await Directorate.find().populate("department");
    const departments = await Department.find();
    console.log(departments);
    res.render("directorate", { departments, directorate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cas/directorate", async (req, res) => {
  try {
    console.log(req.body);
    const { department, directorate } = req.body;
    const dep = await Department.findOne({ name: department });
    console.log(dep);
    const dir = new Directorate({ name: directorate, department: dep._id });
    const newDirectorate = dir;
    newDirectorate.save();
    res.redirect("directorate");
    // const newDirectorateValue= await newDirectorate
    // console.log(newDirectorateValue)
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
    const newDistrictOffice = await districtOffice;
    await newDistrictOffice.save();
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
    const directorateName = await Directorate.find({ name: directorate });
    const schemeData = new Scheme({
      name: schemeName,
      startDate: startDate,
      endDate: endDate,
      directorate: directorateName._id,
      description: schemeDesc,
    });
    const newScheme = await schemeData;
    console.log(newScheme);
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
  let distOfc=""
  if(!district_office ==='Select'){
    distOfc=await District.findOne({name:district_office});
    console.log(distOfc._id);
  }
  const bankMaster=new BankDetails({directorate:direcOfc._id, office:distOfc?._id,bank:bankName, accountNumber:accountNo,IFSCNumber:Ifsc_code,balance:Balance,branch:branchName,address:address })
  bankMaster.save()
  res.status('200').redirect('/cas/bank')
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cas/directorate/:id", async (req, res) => {
  try {
    res.render("Directorate/dashboard.ejs");
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
    const {directorate,office_name,scheme_name,bank_name, scheme_desc}= req.body
    const office_details= await District.findOne({name: office_name})
    const scheme_details= await Scheme.findOne({name: scheme_name})
    const bank_details= await BankDetails.findOne({bank: bank_name})
    
    const schemBankDetails=new SchemeBankMaster({office:office_details._id, directorate:office_details.directorate,scheme:scheme_details._id,bankId:bank_details._id,description:scheme_desc})
    schemBankDetails.save()
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
    // const directorate_data= await Directorate.find()
    // const district_office=await District.find()
    // const bank_details=await BankDetails.find()
    // const scheme_details=await Scheme.find()
    console.log(req.body)
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});