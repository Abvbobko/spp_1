import './auth.css';
var React = require('react');
//var sc = require('../server_connector.jsx').sc;
 
class BackLink extends React.Component {
    render() {
        return (
            <div className="back-link">                                   
                <a href="/" className="auth-btn">
                    Back
                </a>                                    
            </div>
        );
    }
}


class LoginField extends React.Component {
    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor="login">Login:</label><br/>
                <input type="text" id="login" name="login" required maxLength="127" className="enter-field auth-enter-field" />
            </div>
        );
    }   
}

class PasswordField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="task-item task-text-input task-form-item">
                <label htmlFor={this.props.name}>{this.props.labelText + ":"}</label><br/>
                <input type="password" id={this.props.name} name={this.props.name} required className="enter-field auth-enter-field" />
            </div>
        );
    } 
}

export class RegistrationForm extends React.Component {
    render() {
        return (            
            <div>
                <BackLink />
            <div className="auth-page">
                
                <div className="task-form auth-form"> 
                    <form className="login-form">
                        <LoginField />
                        <PasswordField name={"password"} labelText={"Password"}/>
                        <PasswordField name={"repeat_password"} labelText={"Repeat password"}/>
                        <input type="submit" value="Sign up" className="task-item task-form-item button auth-btn auth-enter-field" />
                    </form>
                </div>
            </div> </div>
        );
    }
}
