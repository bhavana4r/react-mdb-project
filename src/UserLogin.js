import React, { useState } from 'react';
import { MDBInput, MDBBtn, MDBCard, MDBCardBody,MDBIcon } from 'mdb-react-ui-kit';
import { useHistory } from 'react-router-dom';
export const USerLogin=()=>{
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history=useHistory();

  const handleSubmit = (e) => {

    history.push('/dashboard');
  };
    return(
             <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <MDBCard style={{ width: '400px', height: '450px' }}>
        <MDBCardBody>
          <form onSubmit={handleSubmit}>
          <MDBIcon fas icon="user-lock" size="4x" />
            <br/>
            <br/>
            <div className="grey-text">
              <MDBInput label="Email" icon="envelope" group type="email" validate error="wrong" success="right" value={email} onChange={(e) => setEmail(e.target.value)} />
              <br/>
              <MDBInput label="Password" icon="lock" group type="password" validate value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="text-center py-4">
              <MDBBtn color="info" type="submit">Login</MDBBtn>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}