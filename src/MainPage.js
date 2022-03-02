import './css/MainPage.css';
import {useState, useEffect, useContext} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { doc,collection, onSnapshot, query, updateDoc, deleteDoc} from "firebase/firestore";
import firestore from './firebase_firestore';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import AddWork from './AddWork';
import {StateContext} from './App';


const GreenCheckbox = withStyles({
    root: {
      color: 'white',
      '&$checked': {
        color: 'white',
      },
    },
    
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    deadline: {
        fontSize: '0.6rem',
        
        marginRight:theme.spacing(2),
    }
  }));

const MainPage = () => {
    const {auth, user} = useContext(StateContext);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [add, setAdd] = useState(false);
    const [allWorks, setAllWorks] = useState([]);
    const [scrolling, setScrolling] = useState(true);
    const [finished, setFinished] = useState([]);
    const [workStateNumbers, setWorkStateNumbers] = useState({greenState: null, orangeState:null, redState:null});
    const [subworkStateNumbers, setSubworkStateNumbers] = useState({greenState:null,orangeState:null});
    
    useEffect(()=> {
        const contentPanel = document.getElementById('main-page-content');
        contentPanel.addEventListener('scroll', () => {
            const sticky = document.getElementById('main-page-head');
            const scroll = contentPanel.scrollTop;
            if(scroll >= sticky.offsetHeight) {
                sticky.classList.add('fixed');
                setScrolling(false);
            }
            else {
                sticky.classList.remove('fixed');
                setScrolling(true);
            }
        });   
    },[]);
    useEffect(()=>{
        const currentDate = new Date();
        const newWorkState = {
            greenState:0,
            orangeState:0,
            redState:0,
        };
        finished.forEach((isFinished,index)=>{
            if(isFinished){
                newWorkState.greenState++;
            }
            else if(allWorks[index].deadline < currentDate) {
                newWorkState.redState++;
            }
            else{
                newWorkState.orangeState++;
            }
            
        });
        setWorkStateNumbers(newWorkState);
    },[finished]);
    useEffect(()=>{
        const newWorkState = {
            greenState:[],
            orangeState:[],
        };
        allWorks.forEach((work,index) => {
            const countObject = {
                greenSubwork:0,
                orangeSubwork:0,
            };
            
            work.subWorks.forEach((subwork)=>{
                if(subwork.isChecked){
                    countObject.greenSubwork++;
                }else{
                    countObject.orangeSubwork++;
                }
            });
            newWorkState.greenState[index]= countObject.greenSubwork;
            newWorkState.orangeState[index] = countObject.orangeSubwork;
        });
        setSubworkStateNumbers(newWorkState);
    },[allWorks])

    useEffect(()=> {
        if(!user.emailVerified){
            setOpen(true);
        }

        if(user.uid){
            const q = query(collection(firestore, user.uid));
            const unsub = onSnapshot(q, (querySnapshot) => {
                const works = [];
                querySnapshot.forEach((doc) => {
                    const workDate = new Date(doc.data().deadline.seconds * 1000);
                    works.push({subWorks:doc.data().subWorks, work:doc.data().work, id:doc.id,deadline:workDate});
                });
                
                setAllWorks(works);
                const finishedArray = works.map((work)=>{
                    const filteredArray = work.subWorks.filter((subwork) => !subwork.isChecked);
                    if(filteredArray.length > 0){
                        return false;
                    }else{
                        return true;
                    }
                });
                setFinished(finishedArray);
                
                
            });
    
            return () => {
                unsub();
                
             }
        }
    },[user]);
    
    const signOut = () => {
        auth.signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const isFinished = (index) => {
        
        if(finished[index]){
            return 'rgba(51, 153, 51,0.4)';
        }
        else if(allWorks[index].deadline < new Date()) {
            return 'rgba(255, 80, 80, 0.7)';
        }
        else {
            return 'rgba(255, 153, 51,0.4)';
        }
    }

    const handleCheck = (index, itemID, subworks) => {
        
        subworks[index].isChecked = !(subworks[index].isChecked);
        const workRef = doc(firestore, user.uid, itemID);
        updateDoc(workRef, {
            subWorks: subworks,
        });
        
    };

    const handleDelete = (itemID, index) => {
        if(finished[index]){
            
        }
        deleteDoc(doc(firestore, user.uid, itemID)).then(()=>console.log('document deleted.')).catch((err)=>console.log(err));
    };
    
    const getMonthFromNumber = (monthNumber) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[monthNumber];
    }
    return ( 
        <div className="main-page">
            <div id='main-page-content' className="main-page-content">
                <div id='main-page-head' className='main-page-head'>
                    {scrolling && <Typography variant='h4' component='h4' >WorkToDo</Typography>}
                    <div className="page-head-button-container">
                        <Tooltip title='add work' arrow>
                            <IconButton disableRipple onClick={()=>setAdd(true)} ><AddIcon/></IconButton>
                        </Tooltip>
                        <Tooltip title='sign out' arrow>
                            <IconButton disableRipple onClick={signOut}><ExitToAppIcon/></IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className='main-page-data'>
                    <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={open} autoHideDuration={3000} onClose={handleClose}>
                        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="info" >Email is not verified.</MuiAlert>
                    </Snackbar>
                    <div className='work-list-container'>
                        <div className='work-list-container-header'>
                        <Typography  variant='h5' component='h2' >Works</Typography>
                        <div className="work-data">
                            <Tooltip title="deadline reached works">
                            <div className="color-block red">{workStateNumbers.redState}</div>
                            </Tooltip>
                            <Tooltip title="finished works">
                            <div className="color-block green">{workStateNumbers.greenState}</div>
                            </Tooltip>
                            <Tooltip title="unfinished works">
                            <div className="color-block orange">{workStateNumbers.orangeState}</div>
                            </Tooltip>
                        </div>
                        </div>
                        {
                            allWorks.map((item,index1) => ( 
                                <Accordion style={{backgroundColor: isFinished(index1),color:'white',transition: 'background-color 0.4s'}} key={index1}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    >
                                        <div style={{display:'flex',justifyContent:'space-between', alignItems:'center', width:'100%'}}>
                                            <Typography className={classes.heading}>{item.work}</Typography>
                                            <div className="work-data">
                                            <Typography className={classes.deadline}>{item.deadline.getDate()+' '+getMonthFromNumber(item.deadline.getMonth())+' '+item.deadline.getFullYear()}</Typography>
                                                <Tooltip title="finished objectives">
                                                <div className="color-block green">{subworkStateNumbers.greenState[index1]}</div>
                                                </Tooltip>
                                                <Tooltip title="unfinished objectives">
                                                <div className="color-block orange">{subworkStateNumbers.orangeState[index1]}</div>
                                                </Tooltip>
                                                <IconButton onClick={()=>handleDelete(item.id, index1)}>
                                                    <DeleteIcon fontSize='small'/>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <List style={{width:'100%'}}>

                                        {item.subWorks.map((subWork,index, subWorks) => (
                                                <ListItem style={{backgroundColor: !finished[index1]  && subWork.isChecked && 'rgba(51, 153, 51,0.4)'}} disableRipple disabled={subWork.isChecked} key={index} role={undefined} dense button onClick={() => handleCheck(index, item.id, subWorks)}>
                                                    <ListItemIcon>
                                                        <GreenCheckbox 
                                                          checked={subWork.isChecked}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={subWork.work} />
                                                </ListItem>
                                        ))}
                                    </List>
                                    </AccordionDetails>
                                </Accordion>
                                
                            ))
                        }
                    </div>
                </div>
                {add && <AddWork add={add} setAdd={setAdd} allWorks={allWorks} setAllWorks={setAllWorks} user={user} />}
            </div>
        </div>
    );
}
 
export default MainPage;