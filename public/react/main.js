
var MainPage = React.createClass({
    
    getInitialState: function() {
        return {
            session:{}
        };
    },

    componentDidMount: function() {
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

    getErrorMessage: function(){
        var idx = document.URL.indexOf('=');
        if(idx > 0){
            var message = document.URL.substring(idx+1).replace(/%20/g," ");
            return message;
        }
        else
            return "";
    },

    render: function() {
        
        if(this.state.session.user == undefined) {
            return (
                <div className="loginScreen">

                    
                    <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Fly Or Die</a>
                            <p className='error-message'><code> {this.getErrorMessage()}</code> </p>
                        </div>

                        <div className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                               <li> <a><LoginBox /></a></li>
                            </ul>
                        </div>

                    </div>
                    </nav>

                <div className="container">

                        <RegisterBox />
                </div>
                

                </div>
            );
        } else {
            return (
                <div className="mainPage">

                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="container">


                                <div className="navbar-header">
                                    <a className="navbar-brand" href="#">{this.state.session.user}</a>
                                </div>

                                <div className="navbar-collapse collapse">
                                    <ul className="nav navbar-nav navbar-right">
                                        
                                        <li><a href="#">Inbox</a></li>
                                        <li><a href="#">Outbox</a></li>
                                        <li><LogoutButton /></li>
                                    </ul>
                                </div>

                        </div>
                    </nav>

                <div className="row">
                    <PostItForm />
                </div>
                        
                </div>
            );
        }
    }
})


var LoginBox = React.createClass({

    render: function() {
        return (
            <div className="loginBox">
                    <form className="onLoginSubmit" method="post" action="/login">
                    <div className="loginForm">
                            
                            <div className="form-group col-md-5">
                                <input type="text" className="form-control" name="userName" id="userName" ref="userName" placeholder="Username" required/>
                            </div>                        

                            <div className="form-group col-md-5">
                                <input type="password" className="form-control" name="password" ref="password" placeholder="Password" required />
                            </div>

                            <div className="form-group col-md-1">
                                <button type="submit" className="btn btn-primary" value="Login!">Login</button>
                            </div>
                     
                    </div>
                    </form>
            </div>
        );
    }
});

var RegisterBox =  React.createClass({

    render: function() {
        return (


                <div className="container">    
                <div className="jumbotron col-md-offset-3 col-md-6">
                <div className="registerBox">
                    <h4>Dont have an account? Create one now.</h4>

                    <form role="form" data-toggle="validator" method="post" action="/register">
                            
                        <div className="row">
                            <div className="form-group">
                                <input type="text" pattern=".{3,}" required title="3 characters minimum" className="form-control" name="userName" id="userName" ref="userName" placeholder="Username" required />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group">
                                
                                <div className="form-group">
                                    <input type="password" pattern=".{6,}" required title="6 characters minimum" className="form-control" name="password" id="password" ref="password" data-minlength="6" placeholder="Password" required />
                                    <span className="help-block"></span>
                                </div>


                                <div className="form-group">
                                    <input type="password" pattern=".{6,}" required title="6 characters minimum" className="form-control"  name="confirmpassword"  ref="confirmpassword" id="confirmpassword" data-minlength="6"   placeholder="Confirm" required />
                                    <div className="help-block with-errors"></div>
                                </div>

                        
                            </div>
                        </div>


                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" value="Register!">Register</button>
                        </div>


                    </form>
            
                </div>
                </div>
                </div>

    );
    }
});


var PostItForm = React.createClass({
    
    render: function() {
        return (
            <div className="messageBox">
            <div className="container">

                <form method="post" action="/message">


                <div className="row">
                    <div className="form-group col-md-12">

                    <textarea className="form-control" rows="2" name="message" ref="message" placeholder="Send something to a stranger..."></textarea>

                    </div>

                </div>
                    
                <div className="form-group">
                    <button type="submit" className="btn btn-primary col-md-3" value="Fly">FLY</button>
                </div>

                </form>

            </div>
            </div>
        );
    }
});

var LogoutButton = React.createClass({

    logout: function() {
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
            <a className="glyphicon glyphicon-log-out" onClick={this.logout}></a>
        );
    }

});


React.render(
    <MainPage />,
    document.getElementById('content')
);
