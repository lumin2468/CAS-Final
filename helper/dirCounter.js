module.exports = function generateVoucherNumber(directorate, district, scheme, financialYear, counter) {
    const formattedCounter = counter.toString().padStart(5, '0');
    return `${directorate}/${district}/${scheme}/P-${financialYear}/${formattedCounter}`;
  }

  