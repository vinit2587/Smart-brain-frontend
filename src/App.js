import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import { Component } from 'react/cjs/react.production.min';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
//import {tsParticles} from "tsparticles";

//const particlesOptions = tsParticles.load("tsparticles", {
  
//})

const app = new Clarifai.App({
  apiKey: 'cbfac01d044e448e92f659a3b24cd12b'
 });

const InitialState = {
  input: '',
      ImageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      InitialState
    }
  }

  LoadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

 // componentDidMount(){
   // fetch('http://localhost:3000/')
     //.then(response => response.json())
     //.then(console.log)
  //}

  calculateFaceLocation = (data) => {
   const clarifaiFace =  data.response.outputs[0].data.regions[0].region_info.bounding_box;
   const Image = document.getElementById('inputimage');
   const width = Number(Image.width);
   const height = Number(Image.height);
   return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ImageUrl: this.state.input})
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
        response => {
          if(response) {
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id,
                      })
                  })
                    .then(response => response.json())
                    .then(count => {
                      this.setState(Object.assign(this.state.user, {entries: count}))
            })
          this.displayFaceBox(this.calculateFaceLocation(response))
         }})
        .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({InitialState})
    } else if (route === 'home'){
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }
  
  render(){
    return (
      <div className="App">
        <Navigation isSignedin={this.state.isSignedin} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} ImageUrl={this.state.ImageUrl} />
           </div>
          :(
            this.state.route === 'signin'
            ?<Signin LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/>
            :<Register LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/>
          )}
          
      </div>
    );
  }
}

export default App;
