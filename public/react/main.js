// var data = [
//   {author: "Pete Hunt", text: "This is one comment"},
//   {author: "Jordan Walke", text: "This is *another* comment"}
// ];

var LoginScreen = React.createClass({

  
  handleLoginSubmit: function(form) {
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="loginBox">
        <h1>Login</h1>
          <form className="onLoginSubmit" onSubmit={this.handleLoginSubmit}>
      <div className="row form">
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

React.render(
  <LoginScreen />,
  document.getElementById('content')
);
