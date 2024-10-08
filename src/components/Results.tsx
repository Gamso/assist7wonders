import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { AccessTime, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GameParams, Player, PlayerScore } from '../types';
import { getNeighborScores, getPlayerScoreByGame, getTotal } from '../utils/score';
import { SxProps, Theme } from '@mui/material/styles';
import theme from '../config/theme';

import score_militaryconflicts from '../img/score/base/score_militaryconflicts.png';
import score_treasury from '../img/score/base/score_treasury.png';
import score_wonder from '../img/score/base/score_wonder.png';
import score_civilian from '../img/score/base/score_civilian.png';
import score_commerce from '../img/score/base/score_commerce.png';
import score_guild from '../img/score/base/score_guild.png';
import score_science from '../img/score/base/score_science.png';
import score_leader from '../img/score/leaders/score_leader.png';
import score_debt from '../img/score/cities/score_debt.png';
import score_blackcards from '../img/score/cities/score_blackcards.png';
import score_navalconflicts from '../img/score/armada/score_navalconflicts.png';
import score_island from '../img/score/armada/score_island.png';
import score_victorypoints from '../img/score/armada/score_victorypoints.png';
import score_edifice from '../img/score/edifice/score_edifice.png';
const SCORES_ICONS: {[key: string]: any} = {
  'military': score_militaryconflicts,
  'treasury': score_treasury,
  'wonders': score_wonder,
  'civilian': score_civilian,
  'commerce': score_commerce,
  'guild': score_guild,
  'science': score_science,
  'leaders': score_leader,
  'debt': score_debt,
  'cities': score_blackcards,
  'naval': score_navalconflicts,
  'islands': score_island,
  'dockyard': score_victorypoints,
  'edifices': score_edifice,
};

type Props = {
  sx?: SxProps<Theme>;
  players: Player[];
  game: GameParams;
  modified: number;
  onDelete?: () => void;
} & React.HTMLAttributes<HTMLElement>;

export default function Results(props: Props) {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const { t } = useTranslation();

  props.players.forEach((player, playerIndex) => {
    player.score['total'] = getTotal(
      getPlayerScoreByGame(player.score, props.game.scores),
      getNeighborScores(props.players, playerIndex)
    );
  });

  props.players.sort((playerA, playerB) => {
    return (playerB.score?.['total'] || 0) - (playerA.score?.['total'] || 0);
  });

  props.players.map((player, playerIndex) => {
    if( playerIndex === 0 || player.score['total'] === props.players[0].score['total'] ) {
      player.score['ranking'] = 1
      return true;
    }

    player.score['ranking'] = props.players[playerIndex-1]!.score['ranking']!
    if( player.score['total'] !== props.players[playerIndex-1].score['total'] ) {
      player.score['ranking'] += 1;
    }

    return true;
  })

  function renderPlayerScores(player: Player, playerIndex: number) {
    return props.game.scores.map(score => {
      const playerScore = getPlayerScoreByGame(player.score, props.game.scores);
      return (
        <TableCell
          key={score.id}
          sx={{
            color: theme => theme.palette.primary.contrastText,
            py: 0,
            px: 1,
            textAlign: 'center',
            backgroundColor: score.color,
          }}
        >
          {score.sum
            ? score.sum(playerScore, getNeighborScores(props.players, playerIndex)).result
            : playerScore[score.id as keyof PlayerScore]}
        </TableCell>
      );
    });
  }

  function getGameDate(ms: number): string {
    const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    const date = new Date(ms);
    const dateString = date.toLocaleString(userLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return dateString;
  }

  function toggleDialog(show: boolean): void {
    setIsDialogOpened(show);
  }

  function handleDeleteConfirm(): void {
    props.onDelete?.();
  }

  return (
    <Box sx={props.sx}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '3em',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
            color: theme => theme.palette.text.secondary,
          }}
        >
          <AccessTime fontSize="small" />
          <Typography variant="body2">{getGameDate(props.modified)}</Typography>
        </Box>
        {props.onDelete && (
          <Tooltip title={t('deleteGame') || ''}>
            <IconButton aria-label="delete" onClick={() => toggleDialog(true)}>
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: theme => theme.palette.background.default }}>
            <TableRow sx={{ fontWeight: 'bold' }}>
              <TableCell />
              <TableCell>{t('player')}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                Σ
              </TableCell>
              <TableCell
                sx={{ textAlign: 'center', padding: '0', verticalAlign: 'bottom' }}
                colSpan={props.game.scores.length}
              >
                <div>
                  {t('scores')}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '24px', padding: '0'}}>
                    {props.game.scores.map((score, index) => (
                      <div key={index} style={{ flex: '1', padding: '0', height: '100%' }}>
                        <img
                          src={SCORES_ICONS[score.id]}
                          alt={score.id}
                          style={{ width: '100%', height: '24px', display: 'block' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.players
              .map((player, playerIndex) => (
                  <TableRow key={playerIndex}>
                    <TableCell
                      sx={
                        player.score['ranking'] === 1 ? {
                          fontSize: '1.5em',
                          lineHeight: 0,
                          pr: 0,
                        } : {
                          fontSize: '1em',
                          lineHeight: 0,
                          pr: 0,
                          pl: 3,
                          color: theme.palette.text.secondary
                        }
                      }
                    >
                      {player.score['ranking'] === 1 ? '🏆' : player.score['ranking'] + '°'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{player.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {player.wonder}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {player.score['total']}
                    </TableCell>
                    {renderPlayerScores(player, playerIndex)}
                  </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle>
          <Typography variant="h6"> {t('deleteGame')}</Typography>
        </DialogTitle>
        <DialogContent>{t('deleteGameDescription')}</DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            {t('no')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
