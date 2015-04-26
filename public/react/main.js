// var data = [
//   {author: "Pete Hunt", text: "This is one comment"},
//   {author: "Jordan Walke", text: "This is *another* comment"}
// ];


var MainPage = React.createClass({

   getInitialState: function(){
    return {session:{}};
  },

  componentDidMount: function(){
    $.ajax({
      url: "session.json",
      dataType: 'json',
      success: function(data) {
        this.setState({session: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("Session request failed", status, err.toString());

      }.bind(this)
    });
  },

    render: function() {
      if(this.state.session.user == undefined){
      return(
           <div className="loginScreen">
    <LoginBox />
    <RegisterBox />
    </div>
    );
  } else {
    return(
  <div className="mainPage">
  <h1> {this.state.session.user} </h1>
  <LogoutButton />
  <PostItForm />
  </div>
  );
  }
  } 
  })

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

var PostItForm =React.createClass({
    render: function() {
      return (
    <div className="messageBox" method="post" action="/message">
  <form>
  <textarea rows="4" cols="50" name="twig" pattern=".{5,255}" ref="textarea"></textarea>
   <input type="submit" value="Submit!" />
      
    </form>
    </div>
    );
  }
});

var LogoutButton = React.createClass({
  logout: function(){
    $.ajax({
    url: '/logout',
    type: 'DELETE',
    success: function(result) {
         window.location = '/';
    }
  });
  },

   render: function() {
      return (
            <div className="logoutButton">
                  <button onClick={this.logout}>Logout!</button>
         </div>
    );
  }
});



React.render(
  <MainPage />,
  document.getElementById('content')
);
