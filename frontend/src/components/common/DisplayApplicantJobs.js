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
import SearchField from 'react-search-field';
import Fuse from 'fuse.js';
import ReactLoading from 'react-loading';

export default class DisplayApplicantJobs extends Component {
    constructor(props){
        super(props);
        this.state = {
            jobs: [],
            curJobs: [],
            myApps: [],
            descending: false,
            filterType: "Full-time",
            filterSalaryLow: 0,
            filterSalaryHigh: 0,
            filterDuration: 1,
        }
    }

    static contextType = UserContext;

    componentDidMount = async () => {
        try {
            const res = await axios.get('/api/listings/');
            if(res.status != 200) {
                console.log('No data retrieved');
            } else {
                const today = new Date();
                console.log(res.data);
                const notExpired = res.data.filter((job) => new Date(job.closeDate) > today);
                console.log(notExpired);
                this.setState({jobs: notExpired});
                this.setState({curJobs: notExpired});
            }
            const {userContext} = this.context;
            const res2 = await axios.get(`/api/applications/app/${userContext.user._id}`);
            if(res2.status != 200) {
                console.log("Failed to retrieve applications");
            } else {
                this.setState({myApps: res2.data});
                console.log(this.state.myApps);
            }
            this.setState({loading: false});
        } catch {
            console.log('Failed to retrieve data');
        }
    }

    searchJob = (event) => {
        const fuse = new Fuse(this.state.jobs, {keys: ['title']});
        const newJobs = fuse.search(event);
        const tempArr =[];
        newJobs.forEach((ele) => tempArr.push(ele.item));
        this.setState({curJobs: tempArr});
        if(event === "")
            this.setState({curJobs: this.state.jobs});
    }

    toggleAscending = (event) => {
        this.setState({descending: false});
    }

    toggleDescending = (event) => {
        this.setState({descending: true});
    }

    sortDuration = (event) => {
        const newJobs = this.state.curJobs;
        newJobs.sort((a, b) => a.duration - b.duration);
        if(this.state.descending)
            newJobs.reverse();
        this.setState({curJobs: newJobs});
    }

    sortSalary = (event) => {
        const newJobs = this.state.curJobs;
        newJobs.sort((a, b) => a.salary - b.salary);
        if(this.state.descending)
            newJobs.reverse();
        this.setState({curJobs: newJobs});
    }

    onChangeFilterType = (event) => {
        this.setState({filterType: event.target.value});
    }

    onChangeFilterSalaryLow = (event) => {
        console.log(event.target.value);
        this.setState({filterSalaryLow: event.target.value});
    }

    onChangeFilterSalaryHigh = (event) => {
        console.log(event.target.value);
        this.setState({filterSalaryHigh: event.target.value});
    }

    onChangeFilterDuration = (event) => {
        this.setState({filterDuration: event.target.value});
    }

    applyFilterType = (event) => {
        let jobList = this.state.curJobs.filter((ele) => ele.type === this.state.filterType);
        this.setState({curJobs: jobList});
    }

    resetSortAndFilter = (event) => {
        this.setState({curJobs: this.state.jobs});
    }

    applyFilterSalary = (event) => {
        let jobList = this.state.curJobs.filter((ele) => ele.salary >= this.state.filterSalaryLow && ele.salary <= this.state.filterSalaryHigh);
        this.setState({curJobs: jobList});
    }

    applyFilterDuration = (event) => {
        let jobList = this.state.jobs.filter((ele) => ele.duration < this.state.filterDuration);
        this.setState({curJobs: jobList});
    }

    apply = (event) => {
        if(this.state.myApps.filter((ele) => ele.status === 'Pending').length >= 10) {
            alert('Can only have 10 pending applications');
        } else {
            if(this.state.myApps.filter((ele) => ele.status === 'Accepted').length > 0) {
                alert("Already accepted in a job");
            } else {
                window.location.assign(`/apply/${event.target.id}`);
            }
        }
    }

    render() {
        const {userContext} = this.context;
        if(!userContext.user || userContext.user.type != "Applicant"){
            return (
                <Redirect to="/"/>
            )
        }

        return (
            <div>
            <SearchField placeholder="Search..." onEnter={this.searchJob} searchText=""/>
            <button onClick={this.sortDuration} className="btn btn-secondary">Sort By Duration</button>
            <button onClick={this.sortSalary} className="btn btn-secondary">Sort By Salary</button>
            <button onClick={this.toggleAscending} className="btn btn-secondary">Ascending</button>
            <button onClick={this.toggleDescending} className="btn btn-secondary">Descending</button>
            <br/>
            <h1>Filters</h1>
            <label>Type:</label>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.filterType}
            onChange={this.onChangeFilterType}
            >
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Work from home">Work from home</MenuItem>
            </Select>
            <button onClick={this.applyFilterType} className="btn btn-primary">Apply Type Filter</button>
            <br/>
            <label>Salary:</label>
            <input type="number" min={0} value={this.state.filterSalaryLow} onChange={this.onChangeFilterSalaryLow}/>
            <input type="number" min={0} value={this.state.filterSalaryHigh} onChange={this.onChangeFilterSalaryHigh}/>
            <button onClick={this.applyFilterSalary} className="btn btn-primary">Apply Salary Filter</button>
            <br/>
            <label>Duration:</label>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.filterDuration}
            onChange={this.onChangeFilterDuration}
            >
            <MenuItem value={1}>1 Month</MenuItem>
            <MenuItem value={2}>2 Months</MenuItem>
            <MenuItem value={3}>3 Months</MenuItem>
            <MenuItem value={4}>4 Months</MenuItem>
            <MenuItem value={5}>5 Months</MenuItem>
            <MenuItem value={6}>6 Months</MenuItem>
            <MenuItem value={7}>7 (All)</MenuItem>
            </Select>
            <button onClick={this.applyFilterDuration} className="btn btn-primary">Apply Duration Filter</button>
            <br/>
            <button onClick={this.resetSortAndFilter} className="btn btn-primary">Reset</button>
            <br/>
            <br/>
            {
                this.state.curJobs.map(
                    (listing) => 
                    <div id={listing._id}>
                        <Box component="span" display="block"><b>Title: {listing.title}</b></Box>
                        <Box component="span" display="block">Recruiter Email ID: {listing.recruiterEmail}</Box>
                        <Box component="span" display="block">Number of positions: {listing.posCap - listing.posFilled}</Box>
                        <Box component="span" display="block">Duration: {listing.duration}</Box>
                        <Box component="span" display="block">Salary: {listing.salary}</Box>
                        <Box component="span" display="block">Type: {listing.type}</Box>
                        <Box component="span" display="block">Closing date: {new Date(listing.closeDate).toUTCString()}</Box>
                        {
                            console.log(this.state.myApps.find(app => app.listingID === listing._id))
                        }
                        {
                            this.state.myApps.find(app => app.listingID === listing._id) ? <button className="btn btn-primary" style={{backgroundColor: "green"}}>Applied</button>
                            :   listing.posFilled >= listing.posCap || listing.appFilled >= listing.appCap ? <button className="btn btn-primary" style={{backgroundColor: "red"}}>Full</button>
                            : <button className="btn btn-primary" id= {listing._id} onClick={this.apply}>Apply</button>
                        }
                    </div>
                )
            }
            </div>
        )
    }
}