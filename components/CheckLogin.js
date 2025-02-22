import React from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Head from "./head";
import Layout from "./layout";
import Loader from "./loader";
import "../styles/components/CheckLogin.scss";

class CheckLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loading: true,
      admin: false
    };
  }

  componentDidMount() {
    const dukaanToken = Cookies.get("dukaan-token");
    if (dukaanToken) {
      const userInfo = jwt.decode(dukaanToken);
      if (userInfo && userInfo.data.oneauth_id) {
        if (userInfo.data.role == "admin" || userInfo.data.role == "staff") {
          this.setState({
            loggedIn: true,
            loading: false,
            admin: true
          });
        } else {
          this.setState({
            loggedIn: true,
            loading: false,
            admin: false
          });
        }
      } else {
        this.setState({
          loggedIn: false,
          loading: false
        });
      }
    } else {
      this.setState({
        loggedIn: false,
        loading: false
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <Head title={"Dukaan | Coding Blocks"} />
          <Layout />
          <Loader />
        </div>
      );
    }
    if (!this.state.loggedIn && !this.state.loading) {
      return (
        <div>
          <Head title={"Dukaan | Coding Blocks"} />
          <Layout />
          <div className={"not-logged-in"}>
            <h2>Welcome to Dukaan!</h2>
            <h3>
              The page you are trying to view requires you to be logged in.
            </h3>
            <h3>
              <a href="/login" className={"red"}>
                Click here to login
              </a>
            </h3>
          </div>
        </div>
      );
    } else if (
      this.state.loggedIn &&
      !this.state.loading &&
      !this.state.admin
    ) {
      return (
        <div>
          <Head title={"Dukaan | Coding Blocks"} />
          <Layout />
          <div className={"not-logged-in"}>
            <h2>Welcome to Dukaan!</h2>
            <h3>You need to be an admin to view this page.</h3>
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default CheckLogin;
