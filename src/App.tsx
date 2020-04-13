import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducers/Index";

import "./App.css";
import Game from "./pages/game/Game";

export const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <Game />
        </header>
      </div>
    </Provider>
  );
}

export default App;
