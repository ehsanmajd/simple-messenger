import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import MainRoutes from "./routes/main";
import Layout from "./layout/index";
import { Provider as AppStateProvider } from "./context/appStateContext";
import { Provider as DispatchProvider } from "./context/dispatcherContext";
import { INIT_STATE, reducer } from "./stateManager/reducer";
import ErrorBoundary from "./sharedComponents/errorBoundry";
import { userSingedIn } from "./stateManager/actionCreator";
import useThunkReducer from "react-hook-thunk-reducer";

const Routes = MainRoutes();

// TODO:
function App() {
  const [state, dispatch] = useThunkReducer(reducer, INIT_STATE);
  const authenticated = state.userId !== null;

  useEffect(
    () => {
      const userId = localStorage.getItem('userId');
      const name = localStorage.getItem('username');
      dispatch(userSingedIn({
        id: userId,
        name
      }));
    },
    [dispatch]
  )

  return (
    <ErrorBoundary>
      <DispatchProvider dispatch={dispatch}>
        <AppStateProvider state={state}>
          <Router>
            <Switch>
              {Routes.map((item, index) => {
                if (item.private) {
                  return (
                    <Route
                      key={index}
                      path={item.path}
                      render={(route) => (
                        <Layout
                          component={
                            authenticated
                              ? item.component
                              : () => <p>Please login first</p>
                          }
                          route={route}
                        />
                      )}
                    />
                  );
                } else {
                  return (
                    <Route
                      key={index}
                      path={item.path}
                      render={(route) => (
                        <Layout component={item.component} route={route} />
                      )}
                    />
                  );
                }
              })}
            </Switch>
          </Router>
        </AppStateProvider>
      </DispatchProvider>
    </ErrorBoundary>
  );
}

export default App;
