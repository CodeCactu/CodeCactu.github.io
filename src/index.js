import React from "react"
import ReactDOM from "react-dom"

import Banner from "./components/Banner.js"
// import CellBackground from "./components/CellBackground.js"
import Background from "./components/DynamicBackground.js"

import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Background />
    <Banner />
  </React.StrictMode>,
  document.getElementById( `content` )
)
