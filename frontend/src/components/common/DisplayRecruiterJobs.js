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
import Box from '@material-ui/core/Box';

export default class DisplayRecruiterJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        }
    }

    static contextType = UserContext;

    componentDidMount = async () => {
        const {userContext} = this.context;
        try {
            const res = await axios.get('/api/listings/');
            if(res.status != 200) {
                alert('Failed to load jobs');    
            } else {
                console.log(userContext.user.email);
                this.setState({jobs : res.data});
                const myJobs = this.state.jobs.filter((listing) => listing.recruiterEmail === userContext.user.email && listing.posFilled != listing.posCap);
                this.setState({jobs: myJobs});
                console.log(this.state.jobs);
            }
        } catch {
            alert('Failed to load jobs');
        }
        
    }
 
    posCapChange = (event) => {
        console.log(event.target.value);
        const newJobs = this.state.jobs;
        newJobs.find(x => x._id === event.target.id).posCap = event.target.value;
        this.setState({jobs: newJobs});
    }

    appCapChange = (event) => {
        console.log(event.target.value);
        const newJobs = this.state.jobs;
        newJobs.find(x => x._id === event.target.id).appCap = event.target.value;
        this.setState({jobs: newJobs});
    }

    closeDateChange = (newDate, id) => {
        console.log(newDate);
        console.log(id);
        const newJobs = this.state.jobs;
        newJobs.find(x => x._id === id).closeDate = new Date(newDate);
        this.setState({jobs: newJobs});
    }

    removeJob = async (event) => {
        console.log(event.target.id);
        const jobToDelete = this.state.jobs.find(x => x._id === event.target.id);
        console.log(jobToDelete);
        const res = await axios.post('/api/listings/delete', jobToDelete);
        if(res.status != 200) {
            alert('Failed to delete job');
        } else {
            alert('Job deleted successfully');
            window.location.assign('/createjob');
        }
    }

    editJob = async (event) => {
        const editJob = this.state.jobs.find(x => x._id === event.target.id);
        const res = await axios.post('/api/listings/edit', editJob);
        if(res.status != 200) {
            alert('Failed to edit job');
        } else {
            alert('Job edited successfully');
            window.location.assign('/createjob');
        }
    }

    viewApplications = (event) => {
        window.location.assign(`/viewapplications/${event.target.id}`);
    }

    render() {
        const {userContext} = this.context;

        if(!userContext.user || userContext.user.type !== "Recruiter") {
            return <Redirect to="/"></Redirect>
        }


        return (
        <div>
        {this.state.jobs.map(
            (listing) => 
                <div key={listing._id}>
                    <Box component="span" display="block"><b>Title: {listing.title}</b></Box>
                    <input type="text" id={listing._id} onChange={this.posCapChange} value={listing.posCap}/>
                    <input type="text" id={listing._id} onChange={this.appCapChange} value={listing.appCap}/>
                    <DateTimePicker id={listing._id} onChange={(newDate) => this.closeDateChange(newDate, listing._id)} value={new Date(listing.closeDate)}/>
                    <Box component="span" display="block">Applications filled: {listing.appFilled}</Box>
                    <Box component="span" display="block">Positions filled: {listing.posFilled}</Box>
                    <button id={listing._id} className="btn btn-primary" onClick={this.removeJob}>x</button>
                    <button id={listing._id} className="btn btn-primary" onClick={this.editJob}>Save</button>
                    <button id={listing._id} className="btn btn-primary" onClick={this.viewApplications}>View Applications</button>
                </div>
        )}
        </div>
        )
    }
}