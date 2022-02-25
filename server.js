const express = require('express'); 
var cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');

const app = express(); 
app.use(cors());
const port = process.env.PORT || 5000; 
const EXPIRATION_TIME = 1;
const cacheDatabase = {};
const discountCodes = [];
let counter = 0;


// create a GET route
app.get('/serial_number/:serialNumber', (req, res) => {
  const serialNumber = decodeURIComponent(req.params?.serialNumber); 
  console.log({serialNumber});
  const discountCode = getDiscountCode(serialNumber);
  console.log({ discountCode });
  res.send({ discountCode }); 
});

const getDiscountCode = serialNumber => {
  if(!cacheDatabase[serialNumber]) return 'Invalid serial number';

  if(Object.keys(cacheDatabase[serialNumber]).length === 0) {
    const discountCode = discountCodes[counter % discountCodes.length];
    counter += 1;
    cacheDatabase[serialNumber] = { discountCode, expirationDate: Date.now() + EXPIRATION_TIME * 3600 * 1000 }
    return discountCode;
  }
  
  if(cacheDatabase[serialNumber].expirationDate > Date.now()) {
    return 'Serial Number Redeemed'
  }
  else {
    cacheDatabase[serialNumber] = {};
    return getDiscountCode(serialNumber);
  }
}

const loadSerialNumbers = () => {
  fs.createReadStream('serial_numbers.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    if(row.serial_number && row.serial_number !== '') cacheDatabase[row.serial_number] = {};
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    app.listen(port, () => {console.log(`Listening on port ${port}`)}); 
  });
}

const loadDiscountCodes = () => {
  fs.createReadStream('discount_codes.csv')
  .pipe(csv())
  .on('data', (row) => {
    //console.log(row);
    if(row.code && row.code !== '') discountCodes.push(row.code);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    loadSerialNumbers();
  });
}

loadDiscountCodes();
