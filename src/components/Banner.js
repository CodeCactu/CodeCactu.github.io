import React from 'react'

import logo from "../svg/Banner-logo.svg"
import grass from "../svg/Banner-grass.svg"
import floating_face from "../svg/Banner-floating_face.svg"
import noSign from "../svg/Banner-no_sign.svg"

import "./Banner.css"

export default () =>
  <section className="banner">
    <div className="banner-logo-wrapper">
      <img className="banner-signet" src={logo} alt="Cactu signet" />

      <img className="banner-floating_face is-1" src={floating_face} alt="Floating face" />
      <img className="banner-floating_face is-2" src={floating_face} alt="Floating face" />

      <img className="banner-grass is-1" src={grass} alt="Grass" />
      <img className="banner-grass is-2" src={grass} alt="Grass" />
      <img className="banner-grass is-3" src={grass} alt="Grass" />

      <img className="banner-no_sign" src={noSign} alt="No sign" />

      <span className="banner-logotype">cacTu</span>
    </div>
  </section>