import React, { useContext } from 'react';
import { GamesContext, CurrentGameContext } from './App';
import { GameParams, GameState } from '../types';
import Results from '../components/Results';
import { getGameParamsByGameState } from '../utils/games';

export default function Total() {
  const gamesContext = useContext(GamesContext);
  const { currentGameParams } = useContext(CurrentGameContext);

  function getGameParams(game: GameState): GameParams {
    return getGameParamsByGameState(game);
  }

  const currentGame = gamesContext.state.find(
    game => game.gameId === currentGameParams.gameId
  ) as GameState;

  return (
    <div>
      {currentGame && (
        <Results
          sx={{
            '&:not(:first-of-type)': {
              mt: 2,
            },
          }}
          key={currentGame.gameId}
          players={currentGame.players}
          game={getGameParams(currentGame)}
          modified={currentGame.modified}
          // The current game is not allowed to be deleted
          onDelete={undefined}
        />
      )}
    </div>
  );
}
