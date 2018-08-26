import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const EMAIL = 'email';
const PASSWORD = 'password';

const styles = {
    content: {
      width: 800,
      margin: '0 auto'
    }
};

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            [EMAIL]: '',
            [PASSWORD]: '',
        };
    }

    handleChange(type) {
        return (event) => {
            this.setState({ [type]: event.target.value });
        }
    };

    clear() {
        this.setState({ 
            [EMAIL]: '',
            [PASSWORD]: ''
        });
    }

    submit() {
        const auth = {
            [EMAIL]: this.state[EMAIL],
            [PASSWORD]: this.state[PASSWORD],
        };

        this.props.login(auth);
    }

    render() {
        const { classes, forgotPassword } = this.props;

        return (
            <div className={classes.content}>
                <Card>
                    <CardContent>
                    <FormLabel>Login</FormLabel>
                        <FormControl fullWidth margin="dense">
                            <FormGroup>
                                <TextField
                                    id="username-input"
                                    label="Email Address"
                                    type="email"
                                    value={this.state[EMAIL]}
                                    onChange={this.handleChange(EMAIL)} />
                            </FormGroup>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <FormGroup>
                                <TextField
                                    id="password-input"
                                    label="Password"
                                    type="password"
                                    value={this.state[PASSWORD]}
                                    onChange={this.handleChange(PASSWORD)} />
                            </FormGroup>
                        </FormControl>
                        <Button variant="raised" color="primary" onClick={() => this.submit()}>
                            Submit
                        </Button>
                        <Button color="primary" onClick={() => this.clear()}>
                            Clear
                        </Button>


                    </CardContent>
                </Card>
                <Button component={Link} to='/forgot'>
                    Forgot Password
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(Login);