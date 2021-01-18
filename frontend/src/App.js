import React, {Component, useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import { UserContext } from './components/contexts/UserContext';

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
import axios from 'axios';
// import Profile from './components/Users/Profile'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      token:null,
      user: null
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
  }

  setUserContext = (newContext) => {
    this.setState({user : newContext.user, token : newContext.token});
  }

  render() {

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
        </UserContext.Provider>
      </div>
    </Router>
    )
  };
}

export default App;
