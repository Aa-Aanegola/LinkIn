import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from '../contexts/UserContext';
import Box from '@material-ui/core/Box';
import {generate} from 'shortid';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactNo : "",
            bio : "",
            skillOptions: ['C++', 'Python', 'JS', 'Julia', 'React', 'Express', 'C']
        }
    }

    componentDidMount() {
        const {userContext, setUserContext} = this.context;
        this.setState({userContext, setUserContext});
        console.log(this.context);
        if(userContext.user) {
            this.state.bio = userContext.user.bio;
            this.state.contactNo = userContext.user.contactNo;
        }
    }

    onChangeBio = (event) => {
        const {userContext, setUserContext} = this.context;
        let user = userContext.user;
        user.bio = event.target.value;
        setUserContext({user : user});
    }
    onChangePhoneNumber = (event) => {
        const {userContext, setUserContext} = this.context;
        let user = userContext.user;
        user.contactNo = event.target.value;
        setUserContext({user : user});
    }

    onSubmit = async (event) => {
        try {
            const {userContext} = this.context;
            const newUser = userContext.user;
            console.log(newUser);
            const res = await axios.post('/api/users/update', newUser);

        } catch (err) {
            alert(err);
        }
    }

    instiNameChange = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        newUser.education.find(edu => edu.id === event.target.id).name = event.target.value;
        setUserContext({user : newUser});
    }

    instiStartChange = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        newUser.education.find(edu => edu.id === event.target.id).startYear = event.target.value;
        setUserContext({user : newUser});
    }

    instiEndChange = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        newUser.education.find(edu => edu.id === event.target.id).endYear = event.target.value;
        setUserContext({user : newUser});
    }

    addInsti = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        const edu = newUser.education;
        edu.push({id: generate(), name:'', startYear: '', endYear: ''});
        newUser.education = edu;
        setUserContext({user: newUser});
    }

    removeInsti = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        const edu = newUser.education.filter(x => x.id !== event.target.id);
        newUser.education = edu;
        setUserContext({user:newUser});
    }

    commitChanges = async (event) => {
        try {
            const {userContext} = this.context;
            const newUser = userContext.user;
            console.log(newUser);
            const res = await axios.post('/api/users/update', newUser);

        } catch (err) {
            alert(err);
        }
    }

    onClickSkill = (skill) => {
        console.log(skill);
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        if(newUser.skills.indexOf(skill) === -1)
            newUser.skills.push(skill);
        setUserContext({user: newUser});
    }

    changeSkills = (event) => {
        const {userContext, setUserContext} = this.context;
        const newUser = userContext.user;
        const newSkills = event.target.value.split(',');
        newUser.skills = newSkills;
        setUserContext({user: newUser});
    }

    static contextType = UserContext;

    render() {
        const {userContext} = this.context;
        if(userContext.user) {
            if(userContext.user.type === 'Applicant') {
                return (
                    <div>
                        <Box component="span" display="block">Currently logged in as : {userContext.user.name} </Box>
                        <Box component="span" display="block">Type of user : {userContext.user.type} </Box>
                        <Box component="span" display="block">Email ID: {userContext.user.email} </Box>
                        <Box component="span" display="block">Education</Box>
                        {userContext.user.education.map(
                            (edu) => 
                            <div key ={edu.id}>
                                <input type="text" id={edu.id} onChange={this.instiNameChange} value={edu.name} placeholder={edu.name}/>
                                <input type="text" id={edu.id} onChange={this.instiStartChange} value={edu.startYear} placeholder={edu.startYear}/>
                                <input type="text" id={edu.id} onChange={this.instiEndChange} value={edu.endYear} placeholder={edu.endYear}/>
                                <button id={edu.id} onClick={this.removeInsti} className="danger">x</button>
                            </div>
                            
                        )}
                        <button onClick={this.addInsti} className="btn btn-secondary">Add Institute</button>
                        <br/>
                        <Box component="span" display="block">Skills</Box>
                        <input type="text" onChange={this.changeSkills} value={userContext.user.skills.join(',')}/>
                        {
                            this.state.skillOptions.map(skill => 
                            <button size="small" onClick={() => this.onClickSkill(skill)} id={skill} className="btn btn-secondary">{skill}</button>
                            )
                        }
                        <br/>
                        <button onClick={this.commitChanges} className="btn btn-primary">Save changes</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Box component="span" display="block">Currently logged in as : {userContext.user.name} </Box>
                        <Box component="span" display="block">Type of user : {userContext.user.type} </Box>
                        <Box component="span" display="block">Email ID: {userContext.user.email} </Box>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Bio: </label>
                                <textarea value={userContext.user.bio} onChange={this.onChangeBio} cols={60} rows={10}/> 
                            </div>
                            <div className="form-group">
                                <label>Phone Number: </label>
                                <input type="text" value={userContext.user.contactNo} onChange={this.onChangePhoneNumber} placeholder={userContext.user.contactNo}/> 
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Confirm edits" className="btn btn-primary"/>
                            </div>
                        </form>  
                    </div>
                )
            }
        }
        return <h1>Dhruv sir bond sir</h1>
    }
}