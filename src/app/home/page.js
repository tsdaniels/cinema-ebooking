import LoggedinHome from '../components/LoggedinHome';
import ComingSoon from '../components/ComingSoon';
import SearchMovies from "../components/SearchMovies";

export default function Home() {  
  return (
    <div>
      <LoggedinHome />
      <SearchMovies />
    </div>
  );
}