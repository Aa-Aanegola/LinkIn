import React, {Component, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { UserContext } from './components/contexts/UserContext';
import Loader from 'react-loader-spinner';

// import UsersList from './components/Users/UsersList'
// import Home from './components/Common/Home'
import Register from './components/common/Register';
import Navbar from './components/templates/Navbar';
import Login from './components/common/Login';
import Home from './components/common/Home';
import Profile from './components/common/Profile';
import CreateJob from './components/common/CreateJob';
import DisplayRecruiterJobs from './components/common/DisplayRecruiterJobs';
import DisplayApplicantJobs from './components/common/DisplayApplicantJobs';
import Apply from './components/common/Apply';
import MyApplications from './components/common/MyApplications';
import ViewApplications from './components/common/ViewApplications';
import AcceptedApplicants from './components/common/AcceptedApplicants';
import axios from 'axios';
// import Profile from './components/Users/Profile'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      token:null,
      user: null,
      loading: true
    }
  }

  async componentDidMount() {
    let token = localStorage.getItem('token');
    if(!token) {
      localStorage.setItem('token', "");
      token = "";
    } else {
      try {
        const res = await axios.post('/api/users/getuser', {token});
        this.setState({token: token, user: res.data});
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }
    this.setState({loading: false});
  }

  setUserContext = (newContext) => {
    this.setState({user : newContext.user, token : newContext.token});
  }

  render() {
    if(this.state.loading) {
      return (
          <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}/>
      )
  }

  return (
  <Router>
    <div className="container">
      <UserContext.Provider value={{userContext : this.state, setUserContext : this.setUserContext}}>
      <Navbar/>
      <br/>
      {/* <Route path="/" exact component={Home}/> */}
      {/* <Route path="/users" exact component={UsersList}/> */}
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
      <Route exact path="/" component ={Home}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/createjob" component={CreateJob}/>
      <Route path="/displayrecruiterjobs" component={DisplayRecruiterJobs}/>
      <Route path="/displayapplicantjobs" component={DisplayApplicantJobs}/>
      <Route path="/apply" component={Apply}/>
      <Route path="/myapplications" component={MyApplications}/>
      <Route path="/viewapplications" component={ViewApplications}/>
      <Route path="/myemployees" component={AcceptedApplicants}/>
      </UserContext.Provider>
    </div>
  </Router>
  )
  };
}

export default App;
