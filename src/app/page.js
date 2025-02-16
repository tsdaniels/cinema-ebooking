import Image from "next/image";
import './page.css';
import HomePageNavbar from "./HomePageNavBar";
import HeroSectionHomePage from "./HeroSectionHomePage";
import CurrentlyShowingHomePage from './CurrentlyShowingHomePage';

export default function Home() {
  return (
    <div>
      <HeroSectionHomePage />
      <CurrentlyShowingHomePage />  
    </div>
  );
}
