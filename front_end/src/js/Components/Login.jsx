import React from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel,
  Button,
} from 'react-bootstrap';

const Login = React.createClass({
  render() {
    return (
      <Col sm={6} smOffset={3} style={{ marginTop: '100px' }}>
        <Col xs={10} xsOffset={2}>
          <h1 style={{ marginLeft: '-10px', marginBottom: '30px' }}>Login</h1>
        </Col>
        <Form action="/login" method="post" horizontal className="login-form">
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Username
            </Col>
            <Col sm={10}>
              <FormControl name="username" type="text" placeholder="Username" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password
            </Col>
            <Col sm={10}>
              <FormControl
                name="password"
                type="password"
                placeholder="Password"
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={8}>
              <Button type="submit">Sign in</Button>
            </Col>
          </FormGroup>
        </Form>
      </Col>
    );
  },
});

export default Login;
