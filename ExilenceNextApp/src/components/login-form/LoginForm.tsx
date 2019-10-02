import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface LoginFormProps {
  handleLogin: Function;
  password: any;
  username: any;
}

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {

  return (
    <Grid container
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item sm={9} md={6} lg={3}>
        <Paper className="paper">
          <Box p={2}>
            <Typography variant="h5" className="form-title" gutterBottom>
              Login to your account
            </Typography>
            <form onSubmit={(event) => props.handleLogin(event)} className="container" noValidate autoComplete="off">
              <Grid container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    id="user-name"
                    label="Username"
                    className="full-width"
                    margin="normal"
                    {...props.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    type="password"
                    label="Password"
                    className="full-width"
                    margin="normal"
                    {...props.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" className="full-width">
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginForm;
