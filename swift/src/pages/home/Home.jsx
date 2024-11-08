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
    </div>
  );
}

export default Home;
