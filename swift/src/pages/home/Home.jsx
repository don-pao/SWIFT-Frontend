import { Button } from '@mui/material';
import ResponsiveAppBar from '../../component/Appbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AvatarTheme from '../../component/Theme';
import Body from './Body';

function Home() {
    const navigate = useNavigate();
    
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <AvatarTheme/>
      <Body/>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/test')} // Redirect to /test on click
      >
        Go to Test Page
      </Button>
    </div>
  );
}

export default Home;
