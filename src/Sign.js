import './css/Sign.css';
import { useState, useContext, createContext} from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import {StateContext} from './App';

export const CredentialsContext = createContext();

const Sign = () => {
    const context = useContext(StateContext);
    const auth = context.auth;
    const [choice, setChoice] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   
    return (   
    <div className="sign">
        <div className='sign-left'>
            <CredentialsContext.Provider value={{email: email,
                            password: password ,
                            setPassword: setPassword,
                            setEmail: setEmail ,
                            setChoice: setChoice,
                            auth: auth}}>
            {choice && <SignUp />}
            {!choice && <SignIn />}
            </CredentialsContext.Provider>
        </div>
        <div className='waves'>
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
            <div className="wave wave4"></div>
        </div>
        <div className='sign-right'>
            
            <div className="sign-right-content">
                <h1 className='sign-logo'>WorkToDo</h1>
                <ul className='sign-description'>
                    <li>Sign up or Sign in for free.</li>
                    <li>Add your work and objectives to do.</li>
                    <li>Mark your done objectives and finish your work.</li>
                </ul>
            </div>
        </div>
        
    </div> 
    );
}
 
export default Sign;