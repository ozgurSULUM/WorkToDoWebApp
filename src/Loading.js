import './css/Loading.css';
import Typography from '@material-ui/core/Typography';
const Loading = () => {
    return (
        <div className="loading">
           <Typography className='loading-header' variant='h2' component='h1'>Loading...</Typography>
        </div>
    );
}
 
export default Loading;