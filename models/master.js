const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Department Schema
const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  directorate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
    },
  ],
  // Other department fields
});

// Directorate Schema
const directorateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
    },
  
  districts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
  ],
  schemes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
    },
  ],
  openingBalance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OpeningBalance",
  },
  abbreviation:{
    type:String,
    required:true,
  }
});

// District Schema
const districtSchema = new Schema({
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
    required: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DistrictName",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  bank: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
    },
  ],
  schemes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
    },
  ],
  openingBalance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OpeningBalance",
  },
  abbreviation:{
    type:String,
    required:true,
  },
  beneficiary:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
  }]
  // Other district fields
});

// Bank Details Schema
const bankDetailsSchema = new Schema({
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
    
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },

  bank: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  IFSCNumber: {
    type: String,
    required: true,
    unique: true,
  },

  balance: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  // Other bank details fields
});

// Scheme Schema
const schemeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchemeComponentMaster",
    },
  ],
  abbreviation:{
    type:String,
    required:true,
  }
});

// Cash Book Register Schema
const cashBookRegisterSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  // Other cash book register fields
});

// User Schema
const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  directorateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  officeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  // Other user fields
});

// Financial Year Schema
const financialYearSchema = Schema({
  year: {
    type: String,
    required: true,
  },
  // Other financial year fields
});

// Designation Schema
const designationSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  // Other designation fields
});

// Bank Reconciliation Schema
const bankReconciliationSchema = Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Successful", "Failed"],
    required: true,
  },
  // Other bank reconciliation fields
});

// Ledger Schema
const DirPayment = Schema({
  date: {
    type: Date,
    required: true,
  },
  modeofPayment: {
    type: String,
    required: true,
  },
  modeofPaymentId: {
    type: String,
    required: true,
  },
  modeofPaymentDate: {
    type: Date,
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  sanctionOrdNo: {
    type: String,
    required: true,
  },
  refVoucherNo: {
    type: String,
    required: true,
  },
 scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  distOfcName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  senderBank:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },
  receiverBank:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },
amount:{
    type: Number,
    required:true
  },
  financialYear:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialYear",
  },
  autoVoucherNo:{
    type:String,
    required:true,
    unique:true,
  },
  status:{
    type:String,
  },
  narration:{
    type: String,
    
  }

});

const DirReceipt = Schema({
  date: {
    type: Date,
    required: true,
  },
  modeof_payment: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  sanction_no: {
    type: String,
    required: true,
  },
  ref_voucher_no: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true
  },
 source: {
  type: String,
  required: true
  },
  directorate:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  source_bank:{
    type: String,
    required: true
  },

  receiver_bank:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },
amount:{
    type: Number,
    required:true
  },
  financialYear:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialYear",
  },
  autoVoucherNo:{
    type:String,
    required:true,
    unique:true,
  },

 desc:{
    type: String,
    
  }

});

const DisReceipt = Schema({
  date: {
    type: Date,
    required: true,
  },
  modeof_payment: {
    type: String,
    required: true,
  },
  transaction_Id: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  sanction_ord_no: {
    type: String,
    required: true,
  },
  ref_voucher_no: {
    type: String,
    required: true,
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  office_name:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  
  source_bank_details:{
    type: String,
    required: true
  },

  receiver_bank:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },
amount:{
    type: Number,
    required:true
  },
  financial_year:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialYear",
  },
  autoVoucherNo:{
    type:String,
    required:true,
    unique:true,
  },
 
 desc:{
    type: String,
    
  }

});

const DisPayment = Schema({
  date: {
    type: Date,
    required: true,
  },
  mode_of_payment: {
    type: String,
    required: true,
  },
  transaction_Id: {
    type: String,
    required: true,
  },
  transaction_date: {
    type: Date,
    required: true,
  },

  sanction_ord_no: {
    type: String,
    required: true,
  },
  beneficiary:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'Beneficiary',
  },
 scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  components_name:{
    type:String,
    required: true,
  },
  office_name:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  
  source_bank_details:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
  },

  benifBank:{
    type: String,
    required: true,
  },
amount:{
    type: Number,
    required:true
  },
  financial_year:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialYear",
  },
  autoVoucherNo:{
    type:String,
    required:true,
    unique:true,
  },
  status:{
    type:String,
    required:true,
  },
 
 desc:{
    type: String,
    
  }

});

const DisOfcPayment = Schema({
  date: {
    type: Date,
    required: true,
  },
  modeofPayment: {
    type: String,
    required: true,
  },
  modeofPaymentId: {
    type: String,
    required: true,
  },
  component:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "schemeComponenetMaster",
  },
  modeofPaymentDate: {
    type: Date,
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
  },
  sanctionOrdNo: {
    type: String,
    required: true,
  },
  refVoucherNo: {
    type: String,
  },
 scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },

  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Component",
  },
  distOfcName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  receiverBank:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Benificiary",
  },
amount:{
    type: Number,
    required:true
  },
  financialYear:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "FinancialYear",
  },
  autoVoucherNo:{
    type:String,
    required:true,
    unique:true,
  },
  status:{
    type:String,
  },
  narration:{
    type: String,
    
  }

});



const dirCounterSchema =Schema({
  directorate: String,
  district: String,
  scheme: String,
  financialYear: String,
  count: { type: Number, default: 1 },
});

const dirRecCounterSchema =Schema({
  directorate: String,
  district: String,
  scheme: String,
  financialYear: String,
  count: { type: Number, default: 1 },
});


  const disRecCounterSchema  =Schema({
    directorate: String,
    district: String,
    scheme: String,
    financialYear: String,
    count: { type: Number, default: 1 },
  });

  const disPayCounterSchema  =Schema({
    district: String,
    scheme: String,
    component: String,
    beneficiary:String,
    financialYear: String,
    count: { type: Number, default: 1 },
  });
// Bank Account Schema
const modeofpayment = Schema({
 name:{
  type:String,
 }
  // Other bank account fields
});

// Opening Balance Schema
const openingBalance = Schema({
  date: {
    type: Date,
    required: true,
  },
  financialYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'FinancialYear',
  },
  bank: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bank",
      required: true,
    },
  ],
  cash:{
    type:Number
  },
  Advance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advance",
  },

  // Other opening balance fields
});

// Notification Schema
const notificationSchema = Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  // Other notification fields
});

// Beneficiary Schema
const beneficiarySchema = Schema({
  benificiary_name: {
    type: String,
    required: true,
  },
  office_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Aadhar_No: {
    type: String,
    required: true,
    unique: true,
  },
  Bnk_Acc_No: {
    type: String,
    required: true,
  },
  Ifsc_code: {
    type: String,
    required: true,
  },

  branch_details: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  scheme: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
  ],
});
const beneficiaryBankSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  IFSC: {
    type: String,
  },
  Branch: {
    type: String,
    required: true,
  },
  AccNo: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
});

// Advance Schema
const advanceSchema = Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  modeOfPayment: {
    type: String,
    required: true,
  },
  voucherNo: {
    type: String,
    required: true,
  },
  transactionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: true,
  },
});

// Journal Schema
const journalSchema = Schema({
  ledger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  debit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ledger",
    required: true,
  },
  advance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advance",
  },
  voucherNo: {
    type: String,
    required: true,
  },
  // Other journal fields
});

// RTGS Schema
const rtgsSchema = Schema({
  transactionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  rtgsNo: {
    type: String,
    required: true,
  },
});

// NEFT Schema
const neftSchema = Schema({
  transactionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  neftNo: {
    type: String,
    required: true,
  },
});

// Cheque Schema
const chequeSchema = Schema({
  transactionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  chequeNo: {
    type: String,
    required: true,
  },
});

// Demand Draft Schema
const demandDraftSchema = Schema({
  transactionDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  demandDraftNo: {
    type: String,
    required: true,
  },
});



const transactionSchema = Schema({
  transactionType: {
    type: String,
    enum: ["Cash", "Treasury", "RTGS", "NEFT", "Cheque", "DemandDraft"],
    required: true,
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BeneficiaryMaster",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  senderBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
    required: true,
  },
  receiverBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
    required: true,
  },
  VocucherNo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerDetails",
  },
  // Other transaction fields
});

const contraSchema = Schema({
  cash: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cash",
    required: true,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    required: true,
  },
  voucherNo: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  remarks: {
    type: String,
    required: true,
  },
});

const districtNameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const schemeBankMaster = new Schema({
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Distict",
    required: true,
  },
  directorate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directorate",
    required: true,
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
    required: true,
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
    required: true,
  },
  description: {
    type: String,
  },
});

const schemeComponenetMaster = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  desc: {
    type: String,
    required: true,
  },
});
// Consolidated Schema
const consolidatedSchema = {
  Department: mongoose.model("Department", departmentSchema),
  Directorate: mongoose.model("Directorate", directorateSchema),
  District: mongoose.model("District", districtSchema),
  BankDetails: mongoose.model("BankDetails", bankDetailsSchema),
  Scheme: mongoose.model("Scheme", schemeSchema),
  CashBookRegister: mongoose.model("CashBookRegister", cashBookRegisterSchema),
  User: mongoose.model("User", userSchema),
  FinancialYear: mongoose.model("FinancialYear", financialYearSchema),
  Designation: mongoose.model("Designation", designationSchema),
  DistrictName: mongoose.model("DistrictName", districtNameSchema),
  SchemeBankMaster: mongoose.model("SchemeBankMaster", schemeBankMaster),
  SchemeComponentMaster: mongoose.model(
    "SchemeComponentMaster",
    schemeComponenetMaster
  ),
  BankReconciliation: mongoose.model(
    "BankReconciliation",
    bankReconciliationSchema
  ),
  DirPayment: mongoose.model("DirPayment", DirPayment),
  DirReceipt: mongoose.model("DirReceipt", DirReceipt),
  DisReceipt: mongoose.model("DisReceipt", DisReceipt),
  DisPayment: mongoose.model("DisPayment", DisPayment),
  DirCounter : mongoose.model('Counter', dirCounterSchema),
  DirRecCounter : mongoose.model('DirRecCounter', dirRecCounterSchema),
  DisRecCounter : mongoose.model('DisRecCounter', disRecCounterSchema),
  DisPayCounter : mongoose.model('DisPayCounter', disPayCounterSchema),
  modeofPayment: mongoose.model("ModeofPayment", modeofpayment),
  OpeningBalance: mongoose.model("OpeningBalance", openingBalance),
  Notification: mongoose.model("Notification", notificationSchema),
  Beneficiary: mongoose.model("Beneficiary", beneficiarySchema),
  Advance: mongoose.model("Advance", advanceSchema),
  Journal: mongoose.model("Journal", journalSchema),
  rtgs: mongoose.model("RTGS", rtgsSchema),
  neft: mongoose.model("NEFT", neftSchema),
  cheque: mongoose.model("Cheque", chequeSchema),
  demandDraft: mongoose.model("DemandDraft", demandDraftSchema),
  Transaction: mongoose.model("Transaction", transactionSchema),
  Contra: mongoose.model("Contra", contraSchema), // contra
};

module.exports = { consolidatedSchema };
