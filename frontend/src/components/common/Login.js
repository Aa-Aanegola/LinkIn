import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {UserContext} from '../contexts/UserContext';

export default class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            email:''
        }
    }

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
            email: this.state.email,
            password: this.state.password
        }

        console.log(newUser);

        axios.post('/api/users/login', newUser)
             .then(res => {
                if(res.status === 200){
                    console.log(res.data);
                    const {setUserContext} = this.context;
                    setUserContext({token : res.data.token, user : res.data.user});
                    localStorage.setItem('token', res.data.token);
                    alert("Successfully logged in");
                    console.log(res.data.user);
                }
                else{
                    alert("Invalid credentials");
                }
             })
             .catch(res => {alert("Login failed"); console.log(res)});
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
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text" 
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
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }
}