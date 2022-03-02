import {createTheme, responsiveFontSizes} from '@material-ui/core/styles';
import Image from './css/background.jpg';
const theme = createTheme({
    typography: {
        h2:{
            color:'white',
        },
        h4:{
            padding:'10px 20px',
        },
    },
    palette: {
        customColor: {
            main:'#4c99cd',
        },
    }
    ,
    overrides: {
        MuiOutlinedInput:{
            root: {
                color:'white',
                '&$focused $notchedOutline': {
                    borderColor:'white',
                    "& legend": {
                        visibility: "visible"
                      },
                },
                '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
                    borderColor:'white',
                },
                marginBottom:'20px',
               
            },
            notchedOutline: {
                borderColor:'white',
                "& legend": {
                    visibility: "visible"
                  },
            },
            
        },
        MuiFormControlLabel: {
            label: {
                color:'white',
            },
        },
        MuiIconButton: {
            root:{
                color:'white',
            },
        },
        MuiAccordionSummary: {
            content: {
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
            },
        },
        MuiList: {
            root: {
                overflowY:'auto',
                overflowX:'hidden',
                '&::-webkit-scrollbar': {
                    width: '5px',
                    height: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#FFF',
                    borderRadius: '0px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#F1F1F1',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#B0B0B0',
                    borderRadius: '0px',
                },
            }
        }
        ,
        MuiListItem: {
            root: {
                display: 'flex',
                justifyContent: 'space-between',
            }
        }
        ,
        MuiListItemText: {
            root: {
                color:'white',
                overflowY:'hidden',
                overflowX:'auto',
                '&::-webkit-scrollbar': {
                    width: '5px',
                    height: '5px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#FFF',
                    borderRadius: '0px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#F1F1F1',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#B0B0B0',
                    borderRadius: '0px',
                },
               
            },
        },
        MuiDialog: {
            paper: {
                backgroundImage: `url(${Image})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                overflow:'hidden',
            },
        },
        MuiDialogContent:{
            root: {
                width: '80%',
                margin: '0px auto',
                '& form': {
                    display:'flex',
                    flexDirection:'column',
                },
            },
        },
        MuiDialogTitle: {
            root:{
                width:'60%',
                margin: '20px auto',
                borderBottom: '1px solid white',
            },
        },
    },
});

export default responsiveFontSizes(theme);