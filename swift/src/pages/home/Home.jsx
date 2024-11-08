import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import Body from './Body';


function Home() {
    
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <AvatarTheme/>
      <Body/>
    </div>
  );
}

export default Home;
