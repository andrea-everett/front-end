import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: ''
    }
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  onSubmitSignIn = () => {
    console.log('state', this.state)
    fetch('https://scenic-bryce-canyon-04302.herokuapp.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name
      })
    })
      .then(response => response.json())
      .then(user => {
        console.log(user, 'user in Register')
        if (user.id) {
          console.log(this.props)
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
      })
      .catch(resp => console.log('resp failed', resp))
  }
  render() {
    return (
      <article className="br2 ba dark-gray b--black-10 mv6 w-100 w-50-m w-25-1 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" forhtml="name">Name</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className='mv3'>
                <label className="db fw6 1h-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-rest ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-rest ba b--black b-transparent grow pointer f6 dib"
                type="submit"
                value="register"
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
