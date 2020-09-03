import { useState, useRef, useCallback } from "react";

export function useMyReducer(reducer, initState) {
  const [globaState, setGlobalState] = useState(initState);
  const state = useRef(initState);

  const getState = useCallback(
    () => state.current,
    [state]
  )

  const dispatch = useCallback(
    action => {
      if (typeof action === 'function') {
        action(dispatch, getState)
      }
      else {
        state.current = reducer(globaState, action);
        setGlobalState(state.current)
      }
    },
    [state, globaState]
  )

  return [globaState, dispatch];
}