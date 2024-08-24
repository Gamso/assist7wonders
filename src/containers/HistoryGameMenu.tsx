import React, { useContext, useState } from 'react';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close, History } from '@mui/icons-material';
import { CurrentGameContext, GamesContext } from './App';
import { GameParams, GameState } from '../types';
import { getGameParamsByGameState } from '../utils/games';
import Results from '../components/Results';

export default function HistoryGameMenu() {
  const gamesContext = useContext(GamesContext);
  const { currentGameParams } = useContext(CurrentGameContext);
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const { t } = useTranslation();

  function getGameParams(game: GameState): GameParams {
    return getGameParamsByGameState(game);
  }

  function handleHistoryGameDelete(gameId: number) {
    const games = gamesContext.state.filter(game => game.gameId !== gameId);
    gamesContext.dispatch({ type: 'SET_GAMES', payload: games });
  }

  function sortedGames(): GameState[] {
    let games = gamesContext.state.filter(game => game.gameId !== currentGameParams.gameId);
    return games.sort((prevGame, nextGame) => nextGame.gameId - prevGame.gameId);
  }

  function handleOpenConfirm() {
    setIsConfirmOpened(true);
  }

  function handleCloseConfirm() {
    setIsConfirmOpened(false);
  }

  return (
    <div>
      <Tooltip title={t('history') as string}>
        <IconButton onClick={handleOpenConfirm} color="inherit">
          <History />
        </IconButton>
      </Tooltip>

      <Dialog
        open={isConfirmOpened}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('history')}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseConfirm}
            aria-label="close"
            sx={{
              backgroundColor: 'lightgray',
              color: 'gray',
              padding: '4px',
          }}
          >
            <Close sx={{ fontSize: '20px' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              {sortedGames().map(game => (
                <Results
                  sx={{
                    '&:not(:first-of-type)': {
                      mt: 2,
                    },
                  }}
                  key={game.gameId}
                  players={game.players}
                  game={getGameParams(game)}
                  modified={game.modified}
                  // The current game is not allowed to be deleted
                  onDelete={
                    currentGameParams.gameId !== game.gameId
                      ? () => handleHistoryGameDelete(game.gameId)
                      : undefined
                  }
                />
              ))}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
