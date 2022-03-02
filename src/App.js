import {useState, createContext, useEffect} from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import auth from './firebase_auth';
import './css/App.css';
import Sign from './Sign';
import MainPage from './MainPage';
import theme from './theme';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Loading from './Loading';
import PageNotFound from './PageNotFound';
export const StateContext = createContext();

function App() {
  const [user, setUser] = useState(()=>undefined);
  useEffect(()=>{
    const unsub = auth.onAuthStateChanged((user) => {
      if(user){
          setUser(user);
      }else{
          setUser(false);
      }
    });
    return () => {
      unsub();
    }
  },[]);
  
  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
      {
        user === undefined ? <Loading /> : (
        
        <BrowserRouter>
        <StateContext.Provider value={{auth:auth, user:user}}>
          <Switch>
            <Route exact path='/'> 
            {
              () => (
                user ? (<Redirect to='/mainpage' />) : (<Sign />)
              )
            }
            </Route>

            <Route exact path='/mainpage' render={
              () => (
                user ? (<MainPage/>) : (<Redirect to='/' />)
              )
            } />
            <Route path='*' exact={true} render={() => <PageNotFound/>} />
          </Switch>
          </StateContext.Provider>
          </BrowserRouter>
        
        )
      }
      </ThemeProvider>
    </div>
  );
}

export default App;
