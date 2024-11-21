import TopBarLinks from './TopBarLinks';
import SearchBar from './SearchBar';
import HeroSection from './Hero'
import Services from './Services'
import Destinations from './Destinations'
import './searchbar.css'

const MainPage: React.FC = () => {
    return (
      <>
        {/* <div className="search-bar-main">
          <SearchBar />
        </div> */}
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