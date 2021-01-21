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

export default class MyApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            myApps: [],
            display: [],
        }
    }

    static contextType = UserContext;

    componentDidMount = async () => {
        const {userContext} = this.context;
        try {
            const res = await axios.get('/api/listings/');
            if(res.status != 200) {
                console.log('Failed to load jobs');    
            } else {
                this.setState({jobs : res.data});
                console.log(this.state.jobs);
            }
        } catch {
            alert('Failed to load jobs');
        }
        try {
            const res = await axios.get(`/api/applications/app/${userContext.user._id}`);
            if(res.status != 200) {
                console.log('Failed to load applications');
            } else {
                this.setState({myApps: res.data});
                console.log(this.state.myApps);
            }
        } catch {
            console.log("Failed to load applications");
        }
        let display = [];
        let counter = 0;
        this.state.myApps.forEach( (app) => {
            let listing = this.state.jobs.find((ele) => ele._id === app.listingID);
            if(!listing) {
                display.push({id: counter++, title: "Deleted", joinDate: "Deleted", salary: 0, recruiterEmail: "Deleted", status: app.status});
            } else {
                display.push({id: counter++, title: listing.title, joinDate: app.joinDate, salary: listing.salary, recruiterEmail: listing.recruiterEmail, status: app.status});
            }
        });
        this.setState({display: display});
        console.log(this.state.display);
    }

    render() {
        const {userContext} = this.context;
        if(!userContext.user || userContext.user.type !== "Applicant"){
            return <Redirect to="/"/>
        }
        return (
            <div style={{width: '100%'}}>
                <Table striped bordered hover>
                    <thead>
                    <tr><th>Title</th><th>Join Date</th><th>Salary</th><th>Recruiter Email</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                    {
                        this.state.display.map((app) => 
                            <tr>
                                <td>{app.title}</td><td>{new Date(app.joinDate).toUTCString()}</td><td>{app.salary}</td><td>{app.recruiterEmail}</td><td>{app.status}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>
            </div>
        )
    }
}