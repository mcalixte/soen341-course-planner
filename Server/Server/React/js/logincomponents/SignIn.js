import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import blue from '@material-ui/core/colors/blue';
import Authenticator from '../firebase/Authenticator';
import { Redirect, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import './Login.css';
import { blue500 } from 'material-ui/styles/colors';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  controller: {
    marginTop: theme.spacing.unit * 3,
    width: '50%',
  },
  
});

function SignIn(props) {
  const { classes } = props;
  const history = createBrowserHistory({forceRefresh:true});
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Button
            type="submit"
            variant="contained"
            color= 'primary'
            className={classes.controller}
      >
            Login
          </Button>
          <Link to={'/SignUp'}>
          <Button
            type="submit"
            variant="contained"
            color= 'primary'
            className={classes.controller}
          >
            Register
          </Button>
          </Link>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="StudentId">Student ID</InputLabel>
            <Input id="idnumber" name="idnumber" autoFocus autoComplete="idnumber" value={props.state.idnumber} onChange={props.handleChange.bind(this)}/>
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" value={props.state.password} onChange={props.handleChange.bind(this)}/>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </main>
  );
  
  function login(e) {
    e.preventDefault();
    var idnumber=props.state.idnumber;
    Authenticator.database().ref('users').orderByChild('idnumber').equalTo(idnumber).on("value", function(snapshot) {
    if(snapshot.val() != null)
    {
    var key = Object.keys(snapshot.val())[0];
    var email = snapshot.val()[key].email;
    var fname = snapshot.val()[key].fname;
    var lname = snapshot.val()[key].lname;
    var program = snapshot.val()[key].program;
    props.changeEmail(email);
    props.changeFname(fname);
    props.changeLname(lname);
    props.changeProgram(program);
    Authenticator.auth().signInWithEmailAndPassword(email, props.state.password).then((user)=>{
    }).then(()=>{
      history.push('/Main');
     })
    }
    });
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);