import './css/SignIn.css';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import {signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {CredentialsContext} from './Sign';

const GreenCheckbox = withStyles({
    root: {
      color: 'white',
      '&$checked': {
        color: 'white',
      },
    },
    
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

const SignInButton = withStyles({
    root:{
        '&:hover':{
            backgroundColor:'rgba(0,0,0,0)',
            color:'#22577a',
            
        },
        color:'white',
        transition:'0.4s',
        textTransform:'lowercase',
    },
})((props) => <Button {...props}/>);


const SignIn = (props) => {
    const {email, password, setPassword, setEmail, setChoice, auth} = useContext(CredentialsContext);

    const [remember, setRemember] = useState(true);
    const [open, setOpen] = useState(false);
    const [information, setInformation] = useState('');
    const [severity, setSeverity] = useState('warning');

    const handlePassword = (event) => setPassword(event.target.value);
    const handleEmail = (event) => setEmail(event.target.value);

    useEffect(() => {
        setEmail(localStorage.getItem('email') || '');
    },[]);

    const handleSubmit = (event) =>{
        event.preventDefault();
        if(email === ''){
            setInformation('Email alanını doldurun.');
            setSeverity('warning');
            setOpen(true);
            return;
        }else if (password === ''){
            setInformation('Password alanını doldurun.');
            setSeverity('warning');
            setOpen(true);
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('logged in!');
            if(remember) localStorage.setItem('email',email);
            else localStorage.removeItem('email');
        }).catch((error) => {
            setSeverity('error');
            if(error.code === 'auth/user-not-found'){
                setInformation('User not found.');
                setOpen(true);
                return;
            }else if(error.code === 'auth/wrong-password'){
                setInformation('Email or password is wrong');
                setOpen(true);
                return;
            }else if (error.code === 'auth/too-many-requests'){
                setInformation('Too many request');
                setOpen(true);
                return;
            }else {
                setInformation(error.code);
                setOpen(true);
            }
        });
        
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setInformation('');
        setOpen(false);
    };
    return (
        <div className="sign-in">
            <h2>Sign In</h2>
            <form className='sign-in-form' onSubmit={handleSubmit}>
            <div className='divider'></div>
                <FormControl fullWidth variant='outlined'>
                    <OutlinedInput id='email' value={email} onChange={handleEmail} type='email' placeholder='email'/>
                </FormControl>
                <FormControl fullWidth variant='outlined'>
                    <OutlinedInput id='password' value={password} onChange={handlePassword} type='password' placeholder='password'/>
                </FormControl>
                <FormControlLabel 
                label='Remember Me' 
                control={<GreenCheckbox checked={remember} onChange={()=>setRemember(!remember)} name="remember" />}/>
                <button className='form-button' type='submit'>sign in</button>
                <SignInButton disableRipple onClick={()=> {setChoice(true)}}>sign up</SignInButton>
            </form>
            <Snackbar anchorOrigin={{ vertical:'top', horizontal:'left' }} open={open} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity} >{information}</MuiAlert>
            </Snackbar>
        </div>
    );
}
 
export default SignIn;