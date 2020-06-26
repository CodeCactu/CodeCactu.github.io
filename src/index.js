import React from "react"
import ReactDOM from "react-dom"

import Banner from "./components/Banner.js"
// import CellBackground from "./components/CellBackground.js"
// import Background from "./components/Background.js"

import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <Banner />
  </React.StrictMode>,
  document.getElementById( `content` )
)
