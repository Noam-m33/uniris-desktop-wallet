import './css/app.scss';

import {
  HashRouter,
  Route,
} from "react-router-dom";
import { createBrowserHistory } from 'history';
 
import Home from './home'
import Wallet from './wallet'

localStorage.setItem("node_endpoint", "http://localhost:4000")

const history = createBrowserHistory();

function App() {
  return (
      <HashRouter history={history}>
          <Route exact path={"/"} component={Home} />
          <Route path={"/wallet"} component={Wallet} />
      </HashRouter>
  );
}

export default App;
