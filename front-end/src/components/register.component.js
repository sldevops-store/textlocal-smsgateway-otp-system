import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import ExternalCallService from "../services/external.call.service";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.userReady = false;
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      mobile:"",
      successful: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      ExternalCallService.userRegister(
        this.state.username,
        this.state.email,
        this.state.mobile
      ).then(
        response => {

          if(response.data.success){
            this.setState({
              message: response.data.msg,
              successful: true
            });
            window.location.replace(process.env.REACT_APP_LOGGED_IN_URL);
          }else{
            this.setState({
              message: response.data.msg,
              successful: false
            });
          }
        },
        error => {
          if(error.response.status==403){
            console.log("retry with new access token");
            AuthService.isAuthenticated();
          }
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.msg) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  componentDidMount(){
    ExternalCallService.userIsRegistered().then(
      res=>{
        if(res.data.registered){
          localStorage.setItem("userInfo", res.data.toString());
          window.location.replace(process.env.REACT_APP_LOGGED_IN_URL);
        }
    
        this.setState({
          mobile: res.data.phnNumber
        });
        this.userReady = true
        console.log("Res"+res.data.phnNumber);

      }, 
      err => {
        if(err.response.status==403){
          console.log("retry with new access token");
          AuthService.isAuthenticated();
        }
      }
    )
    .catch(err=>{
      console.log("error");
      window.location.replace(process.env.REACT_APP_LOGIN_HOME_URL);
      
    })
  }

  render() {
    return ( true ?
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="phnNumber">Mobile Number:  {this.state.mobile}</label>
                </div>
                <div className="form-group">
                  <label htmlFor="username">Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>:
      null
    );
  }
}
