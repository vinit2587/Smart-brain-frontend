import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import { Component } from 'react/cjs/react.production.min';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
//import {tsParticles} from "tsparticles";

//const particlesOptions = tsParticles.load("tsparticles", {
  
//})

const app = new Clarifai.App({
  apiKey: 'cbfac01d044e448e92f659a3b24cd12b'
 });

function App() {
  return (
    <div className="App">
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} ImageUrl={this.state.ImageUrl} />
      </div>
    );
  }

export default App;
