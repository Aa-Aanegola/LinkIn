import React, {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import Box from '@material-ui/core/Box';

const Home = () => {
    const {userContext, setUserContext} = useContext(UserContext);

    console.log(userContext);
    return (
        userContext.user ? userContext.user.type === 'Applicant' 
                    ? <div>
                        <Box component="span" display="block">Currently logged in as : {userContext.user.name} </Box>
                        <Box component="span" display="block">Type of user : {userContext.user.type} </Box>
                        <Box component="span" display="block">Email ID: {userContext.user.email} </Box>
                    </div>
                    : <div>Recruiter</div>
                    : <span>Please Register/Login </span>
    )
}

export default Home;