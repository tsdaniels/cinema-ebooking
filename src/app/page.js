import './page.css';
import HomePageNavbar from "./HomePageNavBar";
import HeroSectionHomePage from "./HeroSectionHomePage";
import CurrentlyShowingHomePage from './CurrentlyShowingHomePage';
import ComingSoon from './ComingSoon';
import SearchMovies from "./SearchMovies";
import CardsTwo from './CardsTwo';
import HeroSectionLoggedIn from "../../HeroSectionLoggedIn";

export default function Home() {  
  return (
    <div>
      <HeroSectionHomePage />
      <SearchMovies />
      <ComingSoon />
    </div>
  );
}
