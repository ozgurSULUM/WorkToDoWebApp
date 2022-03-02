import './css/SignUp.css';
import {useState, useContext} from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import firestore from './firebase_firestore';
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import {CredentialsContext} from './Sign';

const SignUpButton = withStyles({
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

const SignUp = () => {
    const {email, password, setPassword, setEmail, setChoice, auth} = useContext(CredentialsContext);

    const [nameSurname, setNameSurname] = useState('');
    const [information, setInformation] = useState('');
    const handlePassword = (event) => setPassword(event.target.value);
    const handleEmail = (event) => setEmail(event.target.value);
    const handleNameSurname = (event) => setNameSurname(event.target.value);
    
    const handleSubmit = (event) =>{
        event.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((useCredential) => {
           console.log('kullanıcı oluşturuldu.');
           updateProfile(auth.currentUser, {
                displayName: nameSurname,
           }).then(()=>console.log('name updated')).catch(error => console.log(error.code));
           sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('email verification sended');
            });
            
            
            addDoc(collection(firestore, auth.currentUser.uid), {
                work:'Main work',
                subWorks:[{work:'first sub-work', isChecked: false}],
                deadline: Timestamp.fromDate(new Date(new Date().getTime() + 86400000))
              });

        })
        .catch((error) => {
            setInformation(error.code);
            if( error.code === 'auth/invalid-email'){
                setInformation('Please enter a valid email.');
            }else if (error.code === 'auth/weak-password'){
                setInformation('Weak password.');
            }else if( error.code === 'auth/email-already-in-use'){
                setInformation('This email already in use.');
            }
            handleClick(false);
            console.log(`errorcode: ${error.code}`);
            console.log(`errormessage: ${error.message}`);
        });
    };

    const [errorOpen, setErrorOpen] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false);
    const handleClick = (success) => {
        if(success) {
            setSuccessOpen(true);
        }else {
            setErrorOpen(true)
        }
      };
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setInformation('');
        setSuccessOpen(false);
        setErrorOpen(false)
    };
    
    return (
        <div className="sign-up">
            <h2>Sign Up</h2>
            <form className='sign-up-form' onSubmit={handleSubmit}>
            <div className='divider'></div>
                <FormControl fullWidth variant='outlined'>
                    <OutlinedInput id='nameSurname' value={nameSurname} onChange={handleNameSurname} type='text' placeholder='name/surname'/>
                </FormControl>
                <FormControl fullWidth variant='outlined'>
                    <OutlinedInput id='email' value={email} onChange={handleEmail} type='email' placeholder='email'/>
                </FormControl>
                <FormControl fullWidth variant='outlined'>
                    <OutlinedInput id='password' value={password} onChange={handlePassword} type='password' placeholder='password'/>
                </FormControl>
                    <button className='form-button' type='submit'>sign up</button>
                    <SignUpButton disableRipple onClick={()=> {setChoice(false)}}>sign in</SignUpButton>
            </form>
            <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={successOpen} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success" >{information}</MuiAlert>
            </Snackbar>
            <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={errorOpen} autoHideDuration={3000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error" >{information}</MuiAlert>
            </Snackbar>
        </div>
    );
}
 
export default SignUp;