import Banner from "../components/Banner.jsx";
import Header from "../components/Header.jsx";
import SpecialityMenu from "../components/SpecialityMenu.jsx";
import TopDoctor from "../components/TopDoctor.jsx";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctor />
      <Banner />
    </div>
  );
};

export default Home;
