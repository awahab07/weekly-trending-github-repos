import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import RepositoryContainer from '../features/repository/components/RepositoryContainer';
import { BoxGrid } from '../shared/BoxComponents';
import { appTheme, useAppStyles } from './theme';

const App: React.FunctionComponent = (): React.ReactElement => {
  const classes = useAppStyles();

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline>
        <Router>
          <BoxGrid container classes={{ root: classes.rootWrapper }} justify={'center'}>
            <BoxGrid className={classes.contentWrapper}>
              <Switch>
                <Route path="/repositories">
                  <RepositoryContainer />
                </Route>
                <Redirect exact={true} from="/" to="/repositories" />
              </Switch>
            </BoxGrid>
          </BoxGrid>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
