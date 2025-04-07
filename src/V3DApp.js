import React from "react";

import { createApp } from "./v3dApp/app";
import "./v3dApp/app.css";

class V3DApp extends React.Component {
  #app = null;
  #PL = null;

  #uuid = window.crypto.randomUUID();
  #containerId = `v3d-container-${this.#uuid}`;
  #fsButtonId = `fullscreen-button-${this.#uuid}`;
  #sceneURL = "v3dApp/bmw_m8_web.gltf";

  async loadApp() {
    ({ app: this.#app, PL: this.#PL } = await createApp({
      containerId: this.#containerId,
      fsButtonId: this.#fsButtonId,
      sceneURL: this.#sceneURL,
    }));
  }

  disposeApp() {
    this.#app?.dispose();
    this.#app = null;

    // dispose Puzzles' visual logic
    this.#PL?.dispose();
    this.#PL = null;
  }

  reloadApp() {
    this.disposeApp();
    this.loadApp();
  }

  componentDidMount() {
    this.loadApp();
  }

  componentWillUnmount() {
    this.disposeApp();
  }

  render() {
    return (
      <div
        style={{ position: "absolute", height: "100vh", width: "100%" }}
        id={this.#containerId}
      ></div>
    );
  }
}

export default V3DApp;
