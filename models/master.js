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
      ref: "Schemes",
    },
  ],
  openingBalance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OpeningBalance",
  },
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
      ref: "Schemes",
    },
  ],
  openingBalance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OpeningBalance",
  },
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
  paymentAmount:{
    type: Number,
    required:true
  },
  receiveAmount:{
    type: Number,
    required:true
  },
  narration:{
    type: String,
    
  }

});

// Bank Account Schema
const bankAccountSchema = Schema({
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankDetails",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  reconciliation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankReconciliation",
  },
  // Other bank account fields
});

// Opening Balance Schema
const openingBalance = Schema({
  level: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  scheme: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
  ],
  Ledger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerDetails",
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
  name: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
  },
  pan: {
    type: String,
    required: true,
  },
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
  BankAccount: mongoose.model("BankAccount", bankAccountSchema),
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
