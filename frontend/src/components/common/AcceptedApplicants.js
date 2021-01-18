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

export default class AcceptedApplicants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            applicants: [],
            applications: [],
            listings: [],
            display: []
        }
    }

    static contextType = UserContext;

    componentDidMount = async (event) => {
        try {
            const res = await axios.get('/api/users/all');
            if(res.status != 200){
                alert("Unable to get users");
            } else {
                this.setState({applicants: res.data}); 
            }
        } catch {
            console.log("Failed to get users");
        }
        try {
            const res = await axios.get('/api/applications/getall');
            if(res.status != 200){
                alert("Unable to get applications");
            } else {
                this.setState({applications: res.data});
            }
        } catch {
            console.log("Failed to get applications");
        } 
        try {
            const res = await axios.get('/api/listings/');
            if(res.status != 200){
                alert("Unable to get listings");
            } else {
                this.setState({listings: res.data});
            }
        } catch {
            console.log("Failed to get listings");
        }

        const {userContext} = this.context;

        
        const myJobs = this.state.listings.filter((job) => job.recruiterEmail === userContext.user.email);
        const temp = [];

        myJobs.forEach((job) => {
            const accepted = this.state.applications.filter((application) => application.listingID === job._id && application.status === "Accepted");
            accepted.forEach((application) => {
                const applicant = this.state.applicants.filter((applicant) => applicant._id === application.applicantID)[0];
                console.log(applicant);
                temp.push({
                    title: job.title,
                    name: applicant.name,
                    joinDate: application.joinDate,
                    type: job.type,
                })
            })
        })
        this.setState({display: temp});
        console.log(this.state.display);
        this.setState({loading: false});
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
                <h3>My Employees</h3>
                <Table striped border hover>
                    <tr><th>Title</th><th>Name</th><th>joinDate</th><th>Type</th></tr>
                    {
                        this.state.display.map((ele) => 
                            <tr>
                                <td>{ele.title}</td>
                                <td>{ele.name}</td>
                                <td>{new Date(ele.joinDate).toUTCString()}</td>
                                <td>{ele.type}</td>
                            </tr>
                        )
                    }
                </Table>
            </div>
        )
    }
}