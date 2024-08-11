import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AppBar, Tabs, Tab, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ROUTES from '../config/routes';
import { Route } from '../types';
import { CurrentGameContext } from './App';

export default function Navigation() {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  const history = useHistory();
  const { currentGameParams, currentGamePlayers } = useContext(CurrentGameContext);
  const { t } = useTranslation();

  const tabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToSelectedTab = () => {
      if (tabsRef.current === null) {
        return;
      }

      const scrollContainer = tabsRef.current;
      const selectedTab = scrollContainer.querySelector<HTMLElement>(
        `button.Mui-selected`
      );

      if (selectedTab) {
        setTimeout(() => {
          selectedTab.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }, 500);
      }
    };

    requestAnimationFrame(scrollToSelectedTab);
  }, [location.pathname]);

  function handleTabChange(_event: React.SyntheticEvent, newValue: string) {
    history.push(newValue);
  }

  function renderTabs(routes: Route[]): Array<React.ReactNode> {
    return routes.map(route => {
      if (route.routes) {
        return renderTabs(route.routes);
      } else {
        const error =
          route.error && route.error({ game: currentGameParams, players: currentGamePlayers });
        return error ? null : (
          <Tab
            key={route.id}
            sx={{
              opacity: 1,
              lineHeight: 1.4,
              color: theme => theme.palette.primary.contrastText,
              textShadow: theme => `1px 1px 2px ${theme.palette.text.secondary}`,
              py: 0,
              '&.Mui-selected': {
                color: theme => theme.palette.primary.contrastText,
              },
              backgroundColor: route.color,
            }}
            label={t(route.id)}
            value={route.path}
          />
        );
      }
    });
  }

  return (
    <AppBar
      component="nav"
      sx={{
        position: 'static',
        width: { xs: 'auto', sm: '9em' },
        backgroundColor: theme => theme.palette.background.appBar,
      }}
      elevation={4}
    >
      <Tabs
        ref={tabsRef}
        orientation={bigScreen ? 'vertical' : 'horizontal'}
        sx={{
          height: '100%',
          '& .MuiTabs-indicator': {
            backgroundColor: theme => theme.palette.background.paper,
          },
        }}
        value={location.pathname}
        onChange={handleTabChange}
        variant={bigScreen ? 'standard' : 'scrollable'}
        scrollButtons="auto"
      >
        {renderTabs(ROUTES)}
      </Tabs>
    </AppBar>
  );
}
