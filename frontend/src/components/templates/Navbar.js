import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {UserContext} from '../contexts/UserContext';
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {
    
    constructor(props) {
        super(props);
        
    }

    static contextType = UserContext;

    componentDidMount() {
        const {userContext, setUserContext} = this.context;
        this.setState({userContext, setUserContext});
        console.log(this.context);
    }

    render() {
        const {userContext} = this.context;
        if(userContext.user) {
            if(userContext.user.type === 'Applicant'){
                return (
                    <div>                
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link to="/" className="navbar-brand">LinkIn</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to="/profile" className="nav-link">Edit Profile</Link>
                                </li>
                                <li>
                                    <Link to="/displayapplicantjobs" className="nav-link">View Jobs</Link>
                                </li>
                                <li>
                                    <Link to="/myapplications" className="nav-link">My Applications</Link>
                                </li>
                                <li>
                                    <button onClick={() => {localStorage.setItem('token', ""); window.location.reload()}}>Logout</button>
                                </li>                            
                            </ul>
                        </div>
                    </nav>
                </div>
                )
            } else {
                return (
                    <div>                
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link to="/" className="navbar-brand">LinkIn</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="navbar-item">
                                    <Link to="/profile" className="nav-link">Edit Profile</Link>
                                </li>
                                <li>
                                    <Link to="/createjob" className="nav-link">Create Job</Link>
                                </li>
                                <li>
                                    <Link to="/displayrecruiterjobs" className="nav-link">My jobs</Link>
                                </li>
                                <li>
                                    <button onClick={() => {localStorage.setItem('token', ""); window.location.reload()}}>Logout</button>
                                </li>                            
                            </ul>
                        </div>
                    </nav>
                </div>
                )
            }
        }
        return (
            <div>                
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">LinkIn</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="navbar-item">
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>                            
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}