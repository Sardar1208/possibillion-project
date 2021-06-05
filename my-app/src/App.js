import logo from "./logo.svg";
import LandingPage from "./Pages/LandingPage";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BrowsePage from "./Pages/BrowsePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={BrowsePage} />
        <Route path="/upload" component={LandingPage} />
      </Switch>
    </Router>
  );
}

export default App;
