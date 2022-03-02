import './css/AddWork.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, ListItemSecondaryAction, Typography } from '@material-ui/core';
import { useState, useRef } from 'react';
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import firestore from './firebase_firestore';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
const DialogButton = withStyles({
    root:{
        position:'relative',
        color:'white',
        textTransform:'lowercase',
        bottom:'10px',
    },
})((props) => <Button {...props}/>);

const useStyles = makeStyles({
    root: {
        margin:'5px',
        marginTop: '20px',
        textTransform:'lowercase',
    },
    listItemText: {
        color:'white',
    }
  });

const AddWork = (props) => {
    const open = props.add;
    const setOpen = props.setAdd;
    const user = props.user;
    const [work, setWork] = useState('');
    const [subWork, setSubwork] = useState('');
    const [subWorks, setSubWorks] = useState([]);
    const subworkRef = useRef();
    const [deadline,setDeadline] = useState('');
    
    const handleSubWorks = () => {
        if(subworkRef.current) subworkRef.current.focus();
        if(subWork !== ''){
            setSubWorks( prevState => [ ...prevState, {work: subWork, isChecked: false}]);
            if(subworkRef.current) subworkRef.current.focus();
            setSubwork('');
        } 
    }
    
    const handleSubworksDelete = (index) => {
        const newSubWorks = subWorks.filter((value,currentIndex)=>{
            if(index === currentIndex) {
                return false;
            }else{
                return true;
            }
        });
        setSubWorks(newSubWorks);
    }

    const handleAddingWork = () => {
        if(work !== '' && deadline !== ''){
            addDoc(collection(firestore, user.uid), {
                work: work,
                subWorks: subWorks,
                deadline: Timestamp.fromDate(new Date(deadline)),
            });
            setOpen(false);
        }

    }
    const classes = useStyles();
    return (
        <Dialog  open={open} onClose={()=>setOpen(false)} maxWidth='sm' fullWidth>
            <div className='dialog-content'>
            <DialogTitle>
                <Typography style={{
                    textAlign:'center',
                    color:'white',}}>Create Work</Typography>
            </DialogTitle>
            <DialogContent>
                <form action="" noValidate autoComplete="off">
                    <OutlinedInput id='nameSurname' autoFocus value={work} onChange={(e)=>setWork(e.target.value)} type='text' placeholder='work name'/>
                   <OutlinedInput id ='deadline'
                    value={deadline}
                    onChange={(e)=>setDeadline(e.target.value)}
                    type='date'
                    label='Deadline'
                    notched={true}
                    />
                    <OutlinedInput id='subwork' inputRef={subworkRef} value={subWork} onChange={(e)=>setSubwork(e.target.value)} type='text' placeholder='objective'/>
                    <DialogButton type='submit' className={classes.root} disableRipple onClick={(ev)=>{
                        ev.preventDefault();
                        handleSubWorks();}} >add objective</DialogButton>
                    <List style={{width:'100%',maxHeight:'150px',overflow: 'auto',}}>
                        {
                            subWorks.map((subwork, index)=>(
                                <ListItem style={{backgroundColor:'rgba(255,255,255,0.2)'}} key={index}>
                                    <ListItemText primary={subwork.work} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge='end' onClick={()=>handleSubworksDelete(index)} >
                                            <CloseIcon fontSize="small" style={{color:'white'}}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        }
                    </List>
                </form>
            </DialogContent>
            <DialogActions >
                <DialogButton  onClick={handleAddingWork} color="primary">
                    Add
                </DialogButton>
                <DialogButton onClick={()=>setOpen(false)} color="primary">
                    Cancel
                </DialogButton>
            </DialogActions>
            </div>
            
        </Dialog>
    );
};
 
export default AddWork;