import React, { Component } from 'react';
import Particles from 'react-tsparticles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const url = "https://samples.clarifai.com/metro-north.jpg";


const particlesOptions = {
  fpsLimit: 60,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

  const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      password: '',
      entries: 0,
      joined: ''
    }
}

  class App extends Component {
    constructor () {
      super();
      this.state = initialState;
  }

  setUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
}

calculateFaceLocation = (data) => {
  const clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0]
   .region_info.bounding_box;
   console.log(clarifaiFace)
  const image = document.getElementById("inputimage");
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - clarifaiFace.right_col * width,
    bottomRow: height - clarifaiFace.bottom_row * height,
  };
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onEnter = (event) => {
  if (event.key === 'Enter') {
    this.onButtonSubmit();
  }
}

onButtonSubmit = () => {
  console.log(this.state.input, "input")
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "sdpibbilqljk",
      "app_id": "smart"
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": url
          }
        }
      }
    ]
  });

  console.log('raw', JSON.parse(raw))
  fetch(
     "https://api.clarifai.com/v2/models/45fb9a671625463fa646c3523a3087d5/outputs",
     {
       method: "POST",
       headers: {
         Accept: "application/json",
         Authorization: "Key 48f2e48bf17944c79985107a2e101aa2",
       },
       body: raw,
     }
   )
   .then((response) => {
     console.log('hi', response)
    if (response){
      fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(resp => console.log('resp', resp))
      // .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}));
       });
     }
    this.displayFaceBox(this.calculateFaceLocation(response));
  })
  .catch((error) => console.log('error', error));
    // .then((response) => response.text())
    // .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
    // .catch((error) => console.log("error", error));
};
   

  // onButtonSubmit = () => {

  //   this.setState({imageUrl: this.state.input});
  //       fetch('http://localhost:3000/imageurl', {
  //         method: 'post',
  //         headers: {'Content-Type' : 'application/json'},
  //         body: JSON.stringify({
  //           input: this.state.input
  //         })
  //   })
  //       .then(response => response.json())
  //       .then(response => {
  //           console.log('response', response);
  //           if (response) {
  //             fetch('http://localhost:3000/image', {
  //               method: 'put',
  //               headers: {'Content-Type': "application/json"},
  //               body: JSON.stringify({
  //                 id: this.state.user.id
  //               })
  //       })
  //       .then(response => response.json())
  //       .then(count => {
  //         return this.setState(Object.assign(this.state.user, { entries: count}))
  //        })
  //       .catch(console.log)
  //     }
  //     this.displayFaceBox(this.calculateFaceLocation(response))
  //   })
  //   // .catch(err => console.log(err));
  // }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn:true});
    }
    this.setState({route});
  }
  
  render () {
    const { name, entries } = this.state.user; 
    return (
        <div className="App">
        <Particles className="particles" params= {particlesOptions} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          { this.state.route === 'home'
          ? 
              <div>
              <Logo />
              <Rank name={name} 
              entries={entries} 
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
            <FaceRecognition box={this.state.box} imageUrl={this.state.input} />
          </div>
          : (
           this.state.route === 'signin'
            ? <Signin loadUser={this.setUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.setUser} onRouteChange={this.onRouteChange}/>
          ) 
        }
    </div>
   );
  }
}
export default App;
