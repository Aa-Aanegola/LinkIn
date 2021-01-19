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

export default class Apply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SOP: ""
        }
    }

    static contextType = UserContext;

    onChangeSOP = (event) => {
        this.setState({SOP: event.target.value});
    }
    
    submit = async (event) => {
        const {userContext} = this.context;
        if(!userContext.user) {
            alert('Must be logged in to apply');
            return;
        }
        
        let listingID = window.location.href.split('/').pop();
        
        const newApp = {
            applicantID: userContext.user._id,
            SOP: this.state.SOP,
            listingID: listingID,
            applicationDate: new Date()
        }

        try {
            const res = await axios.post('/api/applications/apply', newApp);
            if(res.status != 200) {
                console.log(res);
            } else {
                alert('Application submitted');
                window.location.assign('/');
            }
        } catch {
            alert('Failed to submit application');
            window.location.assign('/');
        }
        alert("Application submitted");
        window.location.assign('/');
    }

    render() {
        const {userContext} = this.context;

        if(!userContext.user || userContext.user.type !== "Applicant") {
            return <Redirect to="/"></Redirect>
        }


        return (
            <div>
                <h2>SOP</h2>
                <div className="form-group">
                    <textarea value={this.state.SOP} onChange={this.onChangeSOP} cols={60} rows={10}/> 
                </div>
                <button onClick={this.submit} className="btn btn-primary">Submit</button>
            </div>
        )
    }
}