import React, { Component } from 'react';
import 'Styles/Main.scss';
import Header from 'Components/Header';
import Destinations from 'Components/Destinations';


export default class Main extends Component {

  constructor(props: {}) {
    super(props)
  }

  render() {
    return (
      <div className="main-container">
        <Header />
        <Destinations />
      </div>
    )
  }
}
