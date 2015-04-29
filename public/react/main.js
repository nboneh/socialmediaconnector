
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

    render: function() {
        
        if(this.state.session.user == undefined) {
            return (
                <div className="loginScreen">
                    <nav className="navbar navbar-default">
                            <div className="container-fluid">
                                <LoginBox />
                            </div>
                    </nav>

                    <RegisterBox />
                
                </div>
            );
        } else {
            return (
                <div className="mainPage">

                    <nav className="navbar navbar-default">
                        <div className="container-fluid">

                                <div className="navbar-header">
                                    <a className="navbar-brand" href="#">{this.state.session.user}</a>
                                </div>

                                <div className="navbar-right">
                                     <LogoutButton />
                                </div>

                        </div>
                    </nav>

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

                    <form className="onLoginSubmit" method="post" action="/login">
                    <div className="loginForm">
                            
                           
                            <div className="form-group col-md-3">
                                <input type="text" className="form-control" name="userName" id="userName" ref="userName" placeholder="Username" required/>
                            </div>                        

                            <div className="form-group col-md-3">
                                <input type="password" className="form-control" name="password" ref="password" placeholder="Password" required />
                            </div>

                            <div className="form-group col-md-3">
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
                <div className="registerBox">
                    <h4>Dont have an account? Create one now.</h4>

                    <form role="form" data-toggle="validator" method="post" action="/register">
                            
                        <div className="row">
                            <div className="form-group col-md-4">
                                <input type="text" className="form-control" name="userName" id="userName" ref="userName" placeholder="Username" required />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-4">
                                
                                <div className="form-group">
                                    <input type="password" className="form-control" name="password" id="password" ref="password" data-minlength="6" placeholder="Password" required />
                                    <span className="help-block"></span>
                                </div>


                                <div className="form-group">
                                    <input type="password" className="form-control" name="re-password" id="re-password" data-match="password" data-match-error="Whoops, these don't match" placeholder="Confirm" required />
                                    <div className="help-block with-errors"></div>
                                </div>

                        
                            </div>
                        </div>


                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" value="Register!">Register</button>
                        </div>


                    </form>
            
                </div>

    );
    }
});


var PostItForm =React.createClass({
    
    render: function() {
        return (
            <div className="messageBox">

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
            <a className="navbar-text glyphicon glyphicon-log-out" onClick={this.logout}></a>
        );
    }

});


React.render(
    <MainPage />,
    document.getElementById('content')
);
