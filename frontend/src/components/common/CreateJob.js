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

export default class CreateJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            recruiterEmail: "",
            appCap: 0,
            posCap: 0,
            postDate: new Date(),
            closeDate: new Date(),
            type: "",
            duration: 0,
            salary: 0,
            posFilled: 0,
            appFilled: 0,
            requiredSkills: ""
        }
    }

    static contextType = UserContext;

    onChangeTitle = (event) => {
        this.setState({title: event.target.value});
    }

    onChangeAppCap = (event) => {
        this.setState({appCap: event.target.value});
    }

    onChangePosCap = (event) => {
        this.setState({posCap: event.target.value});
    }

    onChangeCloseDate = (event) => {
        this.setState({closeDate: event});
    }

    onChangeSalary = (event) => {
        this.setState({salary: event.target.value});
    }

    onChangeType = (event) => {
        this.setState({type: event.target.value});
    }
    
    onChangeDuration = (event) => {
        this.setState({duration: event.target.value});
    }

    onChangeRequiredSkills = (event) => {
        this.setState({requiredSkills: event.target.value});
    }

    onCreation = async (e) => {
        e.preventDefault();

        const {userContext} = this.context;
        console.log(userContext.user);
        this.state.recruiterEmail = userContext.user.email;

        const listing = this.state;
        console.log(listing);
        try {
            const res = await axios.post('/api/listings/create', listing);
            if(res.status != 200)
                console.log(res);
            else 
                alert("Job created");
            window.location.reload(true);
        } catch {
            alert("Unable to create job");
        }
    }

    render() {
        const {userContext} = this.context;
        if(!userContext.user)
            return (<Redirect to="/"/>)
        return (
            <div>
                <form onSubmit={this.onCreation}>
                    <div className="form-group">
                        <label>Title: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.title}
                               onChange={this.onChangeTitle}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Maximum applicants: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.appCap}
                               min={0}
                               onChange={this.onChangeAppCap}
                               />
                    </div>
                    <div className="form-group">
                        <label>Number of positions: </label>
                        <br/>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.posCap}
                               min={0}
                               onChange={this.onChangePosCap}
                               />
                    </div>
                    <div className="form-group">
                        <label>Closing date: </label>
                        <DateTimePicker onChange={this.onChangeCloseDate} value={this.state.closeDate}/>
                    </div>
                    <div className="form-group">
                        <label>Type: </label>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.type}
                        onChange={this.onChangeType}
                        >
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Work from home">Work from home</MenuItem>
                        </Select>
                    </div>
                    <div className="form-group">
                        <label>Duration (0 indicates indefinite): </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.duration} 
                               max={6}
                               min={0}
                               onChange={this.onChangeDuration}
                               />
                    </div>
                    <div className="form-group">
                        <label>Salary per month: </label>
                        <input type="number" 
                               className="form-control" 
                               value={this.state.salary}
                               min={0}
                               onChange={this.onChangeSalary}
                               />
                    </div>
                    <div className="form-group">
                        <label>Required skills (comma separated): </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.requiredSkills}
                               onChange={this.onChangeRequiredSkills}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}