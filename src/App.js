import React, { Component, useState } from "react";
import Layout from "./components/Layout";
import Landing from "./components/Landing";
import "./styles/main.css";
import Home from "./components/Home";
import Login from "./components/Login";
import { Router, Link, Redirect } from "@reach/router";
import PrivateRoute from "./components/helpers/PrivateRoute";
import Exam from "./components/Exam";
import PostSubmit from "./components/PostSubmit";
import Loading from "./components/Loading";
import Caught from "./components/Caught";
import { Auth } from "@aws-amplify/auth";
import Demo from "./components/Demo";
import { AuthState } from "@aws-amplify/ui-components";
import QuestionSetSelector from "./components/QuestionSetSelector";
import QuestionSetSelectorContainer from "./components/containers/QuestionSetSelectorContainer";
import ExamContainer from "./components/containers/ExamContainer";
import LandingContainer from "./components/containers/LandingContainer";
import DemoVideos from "./components/DemoVideos";

class App extends Component {
  constructor(props) {
    super(props);
    this.setAuthState = this.setAuthState.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.loadForSeconds = this.loadForSeconds.bind(this);
    this.state = {
      isLoading: false,
      authState: undefined,
      currentUser: "",
      isSignedIn: false,
    };
  }

  async setAuthState(s) {
    this.setState({ authState: s });
    if (s === "signedin") {
      let user = await Auth.currentAuthenticatedUser().catch((e) => {
        console.log(e);
      });
      this.setState({ currentUser: user.username, isSignedIn: true });
    }
  }

  setLoading(val) {
    this.setState({ isLoading: val });
  }

  loadForSeconds() {
    this.setLoading(true);
    setTimeout(() => {
      this.setLoading(false);
    }, 1500);
  }

  render() {
    return (
      <Layout isSignedIn={this.state.isSignedIn}>
        <Loading show={this.state.isLoading} />
        <Router>
          <PrivateRoute
            component={LandingContainer}
            isSignedIn={this.state.isSignedIn}
            path={"/landing"}
            loadForSeconds={this.loadForSeconds}
            currentUser={this.state.currentUser}
            setAuthState={this.setAuthState}
          />
          <Login
            isSignedIn={this.state.isSignedIn}
            authState={this.state.authState}
            setAuthState={this.setAuthState}
            path={"/start"}
            loadForSeconds={this.loadForSeconds}
          />
          <Home path={"/"} />
          <PrivateRoute
            isSignedIn={this.state.isSignedIn}
            component={Demo}
            currentUser={this.state.currentUser}
            path={"/demo"}
            loadForSeconds={this.loadForSeconds}
            setAuthState={this.setAuthState}
          />
          <DemoVideos path={"/demoVideos"} />
          <PrivateRoute
            component={ExamContainer}
            isSignedIn={this.state.isSignedIn}
            path={"/exam"}
            currentUser={this.state.currentUser}
            loadForSeconds={this.loadForSeconds}
          />
          <PrivateRoute
            component={QuestionSetSelectorContainer}
            isSignedIn={this.state.isSignedIn}
            path={"/selectQuestionSet"}
            currentUser={this.state.currentUser}
            loadForSeconds={this.loadForSeconds}
            authState={this.state.authState}
            setAuthState={this.setAuthState}
          />
          <PrivateRoute
            component={PostSubmit}
            isSignedIn={this.state.isSignedIn}
            path={"/thankyou"}
            loadForSeconds={this.loadForSeconds}
          />
          <Caught path={"/caught"} loadForSeconds={this.loadForSeconds} />
        </Router>
      </Layout>
    );
  }
}

export default App;
