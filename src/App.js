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
import store from './redux/store';
import { Provider, connect, useDispatch, useSelector } from 'react-redux'

const Routes = MainRoutes();

// TODO:
export default function App() {
  // const [state, dispatch] = useThunkReducer(reducer, INIT_STATE);
  const state = useSelector(state => state);
  const dispatch = useDispatch();
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



// function List() {
//   const dispatch = useDispatch()
//   const data = useSelector(state => state.todo.todoList);

//   return (
//     <ul>
//       {data.map(item =>
//         <li
//           key={item.id}
//           onClick={() => dispatch({ type: 'CLICK', payload: item.id })}
//         >{item.name}---{item.done ? 'true' : 'false'}</li>)}
//     </ul>
//   );
// }

// // const ConnectedList = connect(state => {
// //   return {
// //     data: state.todo.todoList
// //   }
// // })(List)

// function App(props) {
//   console.log(props)
//   return <List />
// }

// // const App2 = connect(state => {
// //   return {
// //     data: state.todoList
// //   }
// // })(App)

// export default function AppWrapper() {
//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   )
// }
