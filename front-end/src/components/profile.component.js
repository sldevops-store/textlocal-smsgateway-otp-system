import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import ExternalCallService from "../services/external.call.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  async componentDidMount() {

    //var auth = await AuthService.isAuthenticated();
    
    //if (!auth) this.setState({ redirect: "/home" });
    ExternalCallService.getDashboardHome().then(res=>{
        this.setState({
          content: res.data,
          userReady: true
        });
      console.log("Res"+res);

    }, 
    err => {
      if(err.response.status==403){
        console.log("retry with new access token");
        AuthService.isAuthenticated();
      }

      this.setState({
        content: "try again later",
        userReady: false
      });
    }
    )
    .catch(err=>{

      if(err.response.status==403){
        console.log("retry with new access token");
        AuthService.isAuthenticated();
      }

      this.setState({
        content: "try again later",
        userReady: false
      });
    })
    
    // if (!auth) this.setState({ redirect: "/home" });

    // .then(
    //   response => {
    //     this.setState({
    //       content: response.data,
    //       userReady: true
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       content:
    //         (error.response && error.response.data) ||
    //         error.message ||
    //         error.toString()
    //     });
    //   }
    // );

    console.log("State: " +JSON.stringify(this.state));
    //this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
          {this.state.content}
          </h3>
        </header>
      </div>
      :<div>
        <header className="jumbotron">
          <h3>
            Full access need to show content
          </h3>
        </header>
      </div>}
      </div>
    );
  }
}
