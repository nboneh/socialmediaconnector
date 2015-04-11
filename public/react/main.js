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
      <div id="middlediv">
        <div class = "row">
          <div class = "col-md-4 col-md-offset-7">
            <div class = "panel panel-default">
              <div class = "panel-heading"> <strong class="">Login</strong>
              </div>
              <div class = "panel-body">
                <form class = "form-horizontal" role = "form">
                  <div class = "form-group">
                    <label for = "inputUsername" class = "col-sm-3 control-label">Username</label>
                    <div class = "col-sm-9">
                      <input type = "username" class = "form-control" id = "inputUsername" placeholder = "Username" required = ""></input>
                    </div>
                  </div>
                  <div class = "form-group">
                    <label for = "inputPassword" class = "col-sm-3 control-label">Password</label>
                    <div class = "col-sm-9">
                      <input type = "password" class = "form-control" id = "inputPassword" placeholder = "Password" required = ""></input>
                    </div>
                  </div>
                  <div class = "form-group-last">
                    <div class = "col-sm-offset-3 col-sm-9">
                      <button type = "submit" class = "btn btn-success btn-sm">Login</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
        
    );
  }
});

React.render(
  <LoginScreen />,
  document.getElementById('content')
);
