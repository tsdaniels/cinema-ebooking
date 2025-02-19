import Image from "next/image";
import './page.css';
import HomePageNavbar from "./HomePageNavBar";
import HeroSectionHomePage from "./HeroSectionHomePage";
import CurrentlyShowingHomePage from './CurrentlyShowingHomePage';
import ComingSoon from './ComingSoon';
import Cards from './Cards';
import CardsTwo from './CardsTwo';

export default function Home() {
  return (
    <div>
      <HeroSectionHomePage/>
      <CurrentlyShowingHomePage/>
      <ComingSoon/>
    </div>
  );
}
