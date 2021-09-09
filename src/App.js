/*
 * @Author: yehuozhili
 * @Date: 2021-09-09 14:01:30
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-09-09 14:35:06
 * @FilePath: \carousel\src\App.js
 */
import "./App.css";
import { Carousel } from "./Carousel";

function App() {
  return (
    <div>
      <Carousel>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Carousel>
    </div>
  );
}

export default App;
