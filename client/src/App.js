import "./Css/app.scss";
import Shoes from "./Components/Shoes";
import {Route, Routes} from "react-router-dom";
import NotFound from "./Components/NotFound";
import NavBar from "./Components/NavBar";
import LandingPage from "./Components/LandingPage";
function App() {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={[<NavBar key={"nav"} />, <LandingPage key={"landing"} />]}
      />
      <Route
        exact
        path="/home"
        element={[<NavBar key={"nav"} />, <Shoes key={"shoes"} />]}
      />
      
      <Route path="home/:id" element={[<NavBar key={"nav"} />,<Details key={"details"}/>]}/>
      
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  );
}

export default App;
