import React, { useState, useEffect }  from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';


const FormPage = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log('body');
      const response = await fetch(`http://localhost:5000/serial_number/${encodeURIComponent(serialNumber)}`);
      console.log({response});
      const body = await response.json();
      console.log(body);
      if (response.status !== 200) {
        throw Error(body.message) 
      }
      setDiscountCode(body.discountCode);
    };

    fetchData();
  },[setDiscountCode, serialNumber]);


return (
<MDBContainer style={{color: 'white'}}>
  <MDBRow>
    <MDBCol md="12" className="d-flex align-items-center justify-content-center">
      <form className="" 
            onSubmit={e => {
            e.preventDefault();
            console.log(e.target.inputY.value);
            setSerialNumber(e.target.inputY.value);
          }}>
        <p className="h4 text-center mb-4">Free Zattoo</p>
        <div className="p-3">Lorem Ipsum Generador. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        <input placeholder="Enter your 16 digit code here" 
               id="inputY"
               type="text" 
              //  value={serialNumber}
               className="form-control" />
        <div className="text-center mt-4 p-3">
          <MDBBtn style={{borderColor: 'white', borderStyle: 'solid', borderWidth: '1px'}} 
          color="gray" 
          type="submit">
            Submit
          </MDBBtn>
        </div>
      </form>
    </MDBCol>
  </MDBRow>
  <MDBRow>
    <MDBCol md="12">
        <p className="h4 text-center mb-4">Discount Code</p>
        <div style={{height: '60px', borderColor: 'white', borderStyle: 'solid', borderWidth: '1px'}}>{discountCode}</div>
    </MDBCol>
  </MDBRow>
</MDBContainer>
);
};

export default FormPage;