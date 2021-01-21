import React, {Component} from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Redirect} from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default class Register extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            name: '',
            email: '',
            password: '',
            type: ''
        }
    };
    
    componentDidMount() {
        const {userContext, setUserContext} = this.context;
        this.setState({userContext, setUserContext});
        console.log(this.context);
    }

    static contextType = UserContext;

    onChangeName = (event) =>  {
        this.setState({ name: event.target.value });
    }

    onChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    onChangeType = (event) => {
        this.setState({type : event.target.value});
    }

    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            type: this.state.type,
            password: this.state.password
        }

        console.log(newUser);

        axios.post('/api/users/register', newUser)
             .then(async res => {alert("Created\t" + res.data.email);
                   console.log(res.data);
                })
             .catch(res => {alert("Failed to create user")});
        this.setState({
            name: '',
            email: '',
            password: '',
            type: ''
        });
    }

    render() {
        const {userContext} = this.context;
        if(userContext.user)
            return (<Redirect to="/"/>);

        return (
            <div>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.type}
                onChange={this.onChangeType}
                >
                <MenuItem value="Applicant">Applicant</MenuItem>
                <MenuItem value="Recruiter">Recruiter</MenuItem>
                </Select>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text" 
                               className="form-control" 
                               value={this.state.name}
                               onChange={this.onChangeName}
                               />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email" 
                               className="form-control" 
                               value={this.state.email}
                               onChange={this.onChangeEmail}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
                               className="form-control" 
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}