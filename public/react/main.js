// var data = [
//   {author: "Pete Hunt", text: "This is one comment"},
//   {author: "Jordan Walke", text: "This is *another* comment"}
// ];


var MainPage = React.createClass({

    render: function() {
      return(
           <div className="loginScreen">
    <LoginBox />
    <RegisterBox />
    </div>
    );
  }
});
var LoginBox = React.createClass({
  render: function() {
    return (
      <div className="loginBox">
        <h1>Login</h1>
          <form className="onLoginSubmit" method="post" action="/login">
      <div className="loginForm">
          User Name: 
            <input type="text" name="userName" ref="userName" required/>
            Password: 
            <input type="password" name="password" ref="password" required/>

      </div>
          

        <input type="submit" value="Login!" />
      
      </form>
      </div>
    );
  }
});

var RegisterBox =  React.createClass({
  render: function() {
    return (
      <div className="registerBox">
        <h1>Register</h1>
          <form className="onRegisterSubmit" method="post" action="/register">
      <div className="registerForm">
            User Name: 
            <input type="text" name="userName" ref="userName" required/>
            Password: 
            <input type="password" name="password" pattern=".{6,}" onchange="form.re-password.pattern = this.value;" ref="password" required/>
            Confirm Password: 
           <input type="password" pattern=".{6,}" name="re-password" required/>

      </div>
        <input type="submit" value="Register!" />
      
      </form>
      </div>
    );
  }
});


React.render(
  <MainPage />,
  document.getElementById('content')
);
