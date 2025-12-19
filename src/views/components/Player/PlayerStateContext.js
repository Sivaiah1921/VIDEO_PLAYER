// PlayerStateContext.js
import { createContext, useContext } from 'react';

const PlayerStateContext = createContext();

export const usePlayerState = () => {
  return useContext( PlayerStateContext );
};

export const PlayerStateProvider = ( { children, value } ) => {
  return (
    <PlayerStateContext.Provider value={ value }>
      { children }
    </PlayerStateContext.Provider>
  );
};
