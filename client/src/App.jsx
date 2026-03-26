import {useState} from "react";
import Routers from "./Routers";
import Header from "./components/Header/index";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routers />
    </>
  );
}
export default App;

