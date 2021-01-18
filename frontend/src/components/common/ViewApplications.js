import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from '../contexts/UserContext';
import DateTimePicker from 'react-datetime-picker';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Table from 'react-bootstrap/Table';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import Box from '@material-ui/core/Box';

export default class ViewApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            applicants: [],
            display: [],
            descending: false,
            loading: true
        }
    }

    componentDidMount = async () => {
        let listingID = window.location.href.split('/').pop();
        try {
            const res = await axios.get(`/api/applications/listing/${listingID}`);
            if(res.status != 200) {
                console.log('No data retrieved');
            } else {
                this.setState({applications: res.data});    
            }
        } catch {
            console.log("Failed to retrieve data");
        }
        try {
            const res = await axios.get('/api/users/all');
            if(res.status != 200) {
                console.log("Error communicating with server");
            } else {
                this.setState({applicants: res.data});
            }
        } catch {
            console.log("Failed to retrieve applicants");
        }

        console.log(this.state.applications);
        console.log(this.state.applicants);

        const temp = [];

        this.state.applications.forEach((app => {
            if(app.status != "Rejected")
            {
                const user = this.state.applicants.find((applicant) => applicant._id === app.applicantID)
                let struct = {
                    applicantID: user._id,
                    applicationID: app._id,
                    name: user.name,
                    skills: user.skills,
                    applicationDate: app.applicationDate,
                    education: user.education,
                    SOP: app.SOP,
                    status: app.status
                }
                temp.push(struct);
            }
        }))
        this.setState({display: temp});
        console.log(this.state.display);

        this.setState({loading: false});
    }

    toggleAscending = (event) => {
        this.setState({descending: false});
    }

    toggleDescending = (event) => {
        this.setState({descending: true});
    }

    sortName = (event) => {
        const newDisplay = this.state.display;
        newDisplay.sort((a, b) => a.name - b.name);
        if(this.state.descending)
            newDisplay.reverse();
        this.setState({display: newDisplay});
    }

    sortDate = (event) => {
        const newDisplay = this.state.display;
        newDisplay.sort((a, b) => a.applicationDate - b.applicationDate);
        if(this.state.descending)
            newDisplay.reverse();
        this.setState({display: newDisplay});
    }

    reject = async (event) => {
        try {
            const res = await axios.post('/api/applications/reject', {id: event.target.id});
            if(res.status != 200) {
                alert("Failed to reject application");
            } else {
                window.location.reload();
            }
        } catch {
            console.log("Failed to reject application");
        }
    }

    shortlist = async (event) => {
        try {
            const res = await axios.post('/api/applications/shortlist', {id: event.target.id});
            if(res.status != 200) {
                alert("Failed to shortlist application");
            } else {
                window.location.reload();
            }
        } catch {
            console.log("Failed to shortlist application");
        }
    }

    accept = async (event) => {
        try {
            const id = event.target.id;
            console.log(id);
            const res = await axios.post('/api/applications/get', {id});
            console.log(res.data);
            console.log(id);
            const res2 = await axios.post('/api/applications/accept', {applicantID: res.data[0].applicantID, applicationID: id});
            if(res2.status != 200) {
                alert("Failed to accept application");
            } else {
                window.location.reload();
            }
        } catch {
            console.log("Failed to accept application");
        }
        window.location.reload();
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
            <div>
            <h3>Filters</h3>
            <button onClick={this.sortName} className="btn btn-secondary">Sort By Name</button>
            <button onClick={this.sortDate} className="btn btn-secondary">Sort By Application Date</button>
            <button onClick={this.toggleAscending} className="btn btn-secondary">Ascending</button>
            <button onClick={this.toggleDescending} className="btn btn-secondary">Descending</button>
            {
                this.state.display.map((struct) => 
                <div>
                <Box component="span" display="block"><b>Name of applicant : {struct.name} </b></Box>
                <Box component="span" display="block">Skills : {struct.skills.join(',')} </Box>
                <Box component="span" display="block">Application date: {new Date(struct.applicationDate).toUTCString()}</Box>
                <Box component="span" display="block">Education</Box>
                <Table bordered>
                    <tr><th>Name</th><th>Start Year</th><th>End Year</th></tr>
                    {
                        struct.education.map((insti) => 
                            <tr>
                                <td>{insti.name}</td>
                                <td>{insti.startYear}</td>
                                <td>{insti.endYear}</td>
                            </tr>
                        )
                    }
                </Table>
                <Box component="span" display="block">SOP:</Box>
                <textarea readOnly={true} cols={100} rows={10}>{struct.SOP}</textarea>
                <Box component="span" display="block">Status: {struct.status}</Box> 
                {
                    struct.status === "Pending" 
                    ?   <div>
                        <button id={struct.applicationID} onClick={this.shortlist} className="btn btn-primary">Shortlist</button>
                        <button id={struct.applicationID} onClick={this.reject} className="btn btn-primary" style={{background: "red"}}>Reject</button> 
                        </div>
                    :   struct.status === "Shortlisted" 
                    ?   <div>
                        <button id={struct.applicationID} onClick={this.accept} className="btn btn-primary">Accept</button>
                        <button id={struct.applicationID} onClick={this.reject} className="btn btn-primary" style={{background: "red"}}>Reject</button>
                        </div>
                    :   <div>
                        <button className="btn btn-primary" style={{background: "green"}}>Accepted</button> 
                        </div>
                }
                <br/>
                <br/>
                </div>
                )    
            }
            </div>
        )
    }
}