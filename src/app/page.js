import './page.css';
import HomePageNavbar from "./components/HomePageNavBar";
import HeroSectionHomePage from "./components/HeroSectionHomePage";
import CurrentlyShowingHomePage from './components/CurrentlyShowingHomePage';
import ComingSoon from './components/ComingSoon';
import SearchMovies from "./components/SearchMovies";
import CardsTwo from './components/CardsTwo';
import HeroSectionLoggedIn from "./components/HeroSectionLoggedIn";

export default function Home() {  
  return (
    <div>
      <HeroSectionHomePage />
      <SearchMovies />
    </div>
  );
}
