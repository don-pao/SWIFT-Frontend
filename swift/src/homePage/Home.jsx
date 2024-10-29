import ResponsiveAppBar from './Appbar';
import Body from './Body';
import AvatarTheme from './Theme';

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
