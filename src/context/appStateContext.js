import React, { createContext, useContext } from 'react';

const AppStateContext = createContext({});

function useAppState() {
  const appState = useContext(AppStateContext);
  return appState;
}

function Provider({ state, ...rest }) {
  const appState = React.useMemo(() => state, [state]);
  return <AppStateContext.Provider value={appState} {...rest} />
}

export {
  Provider,
  useAppState
}