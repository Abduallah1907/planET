import TopBarLinks from './TopBarLinks';
import SearchBar from './SearchBar';
import HeroSection from './Hero'
import Services from './Services'
import Destinations from './Destinations'
import TopBar from '../../components/TopBar/TopBar';

const MainPage: React.FC = () => {
    return (
      <>
        <div>
          
          <TopBarLinks />
        </div>
        <div className="search-bar-main">
          <SearchBar />
        </div>
        <div>
          <HeroSection />
        </div>
        <div>
          <Services />
        </div>
        <div>
          <Destinations />
        </div>
  
      </>
    );
  }

export default MainPage;