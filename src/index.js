import React from "react"
import ReactDOM from "react-dom"

import Banner from "./components/Banner.js"
// import CellBackground from "./components/CellBackground.js"
import Background from "./components/DynamicBackground.js"

import "./index.css"

ReactDOM.render(
  <React.StrictMode>
    <header className="header">
      <Background />
      <Banner />
    </header>
  </React.StrictMode>,
  document.getElementById( `content` )
)
