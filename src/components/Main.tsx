import React, { Component } from 'react';
import 'Styles/Main.scss';
import Destinations from 'Components/Destinations';


export default class Main extends Component {

  constructor(props: {}) {
    super(props)
  }

  render() {
    return (
      <div className="main-container">
        <Destinations />
      </div>
    )
  }
}
