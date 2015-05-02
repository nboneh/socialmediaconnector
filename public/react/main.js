var MainPage = React.createClass({
    
    getInitialState: function() {
        return { session:{},
        outbox:null
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: "session.json",
            dataType: 'json',
            success: function(data) {
                this.setState({session: data, outbox: this.state.outbox});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("Session request failed", status, err.toString());
            }.bind(this)
        });
    },

    outboxClick: function(){
        this.setState({session: this.state.session, outbox: true});
    },

    inboxClick: function(){
        this.setState({session: this.state.session, outbox: false});
    },

    render: function() {
        
        if(this.state.session.user == undefined) {
            return (
                <div className="loginScreen">
                     <LoginNavBar />
                    <RegisterBox />
                </div>
            );
        } else {
             if(this.state.outbox){
                return(
                    <div className="mainPage">
                        <NavBar user={this.state.session.user} outboxClick={this.outboxClick} inboxClick={this.inboxClick}/>
                        <div className="row">
                            <p> OUTBOX MAN </p>
                        </div>
                    </div>
                )
             } else {
            return (
                <div className="mainPage">
                    <NavBar user={this.state.session.user} outboxClick={this.outboxClick} inboxClick={this.inboxClick}/>
                    <div className="row">
                        <PostItForm />
                        <Inbox />
                    </div>
                </div>
                        
            );
        }
         }
    }
});

var LoginNavBar  = React.createClass ({
     render: function() {
          return (

                    <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Fly Or Die</a>
                        </div>

                        <div className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                               <li> <a><LoginBox /></a></li>
                            </ul>
                        </div>

                    </div>
                    </nav>
            );
}
});

var NavBar =  React.createClass ({
    outboxClick: function(){
        this.props.outboxClick();
    },

    inboxClick:function(){
           this.props.inboxClick();
    },

    render: function() {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">

                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">{this.props.user}</a>
                        </div>

                        <div className="navbar-collapse collapse">
                            
                            <ul className="nav navbar-nav navbar-right">  
                                <li><a href="#" onClick={this.inboxClick}>Inbox</a></li>
                                <li><a href="#" onClick={this.outboxClick}>Outbox</a> </li>
                                <li><LogoutButton /></li>
                            </ul>

                        </div>
                </div>
            </nav>

        );
     }
 });


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
    
    checkPass: function () {

    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('confirmpassword');
    var butt =  document.getElementById("button");
    var confirm = document.getElementById("confirm");

    if(pass1.value == pass2.value){
        confirm.className= "has-success";
        butt.disabled=false;

    } else {
        confirm.className= "has-error";
        butt.disabled=true;
    }
},

    render: function() {
        return (
                <div className="container">    
                <div className="jumbotron col-md-offset-3 col-md-4">
                <div className="registerBox">
                    <h4 className="col-md-3 col-md-offset-4">Signup!</h4>

                    <form role="form" data-toggle="validator" method="post" action="/register">
                            
                        <div className="row">
                            <div className="form-group">
                                <input type="text" pattern=".{3,}" className="form-control" name="userName" id="userName" ref="userName" placeholder="Username" required />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group">
                                
                                <div className="form-group">
                                    <input type="password" pattern=".{6,}" className="form-control" name="password" id="password" ref="password" data-minlength="6" placeholder="Password" required />
                                </div>


                                <div id="confirm" className="form-group">
                                    <input type="password" pattern=".{6,}"  onKeyUp={this.checkPass} className="form-control" name="confirmpassword"  ref="confirmpassword" id="confirmpassword" data-minlength="6"   placeholder="Confirm" required />
                                </div>

                        
                            </div>
                        </div>


                        <div className="form-group">
                            <button id="button" disabled type="submit" className="btn btn-primary col-md-12" value="Register!">Signup</button>
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

// logoutbutton -- module export this
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



// inbox -- module export this
var Inbox = React.createClass ({displayName: 'Inbox',
     getInitialState: function() {
        return {
            inbox:[]
        };
    },

    componentDidMount: function() {
        $.ajax({
            url: "inbox.json",
            dataType: 'json',
            success: function(data) {
                this.setState({inbox: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("Inbox request failed", status, err.toString());
            }.bind(this)
        });
    },
     render: function() {
         return (
            <div className="inbox">
                <InboxList data={this.state.inbox}/>
            </div>
        )
     }


});

var InboxList = React.createClass({
       render: function() {
        var inboxMessages = this.props.data.map(function (message){
         return (
            <InboxMessage content= {message.content} times_passed={message.times_passed} creator={message.user} received={message.time_created}>
            </InboxMessage>
        );
     });
         return (
            <div className= "inboxMessages">
                {inboxMessages}
            </div>
        )
     }
});

var InboxMessage = React.createClass({

    fly: function() {
        $.ajax({
            url: '/fly',
            type: 'PUT',
            success: function(result) {
                 window.location = '/';
            }
        });
    },


  render: function() {
    return (
      <div className="message">
        <h2 className="container content">
            <table className="table table-responsive">
                    <th>Inbox</th>
                    <th>Created By</th>
                    <th>Count</th>
                    <th>Recieved On</th>
                    <th></th>
                    
                <tr>
                    <td>{this.props.content}</td>
                    <td>{this.props.creator}</td>
                    <td>{this.props.times_passed}</td>
                    <td>{this.props.recieved}</td>
                    <td><button type="button" className="btn btn-primary" onClick={this.fly}>FLY!</button></td>
                    
                </tr>
            </table>
        </h2>
      </div>
    );
  }
});



React.render(
    <MainPage />,
    document.getElementById('content')
);
