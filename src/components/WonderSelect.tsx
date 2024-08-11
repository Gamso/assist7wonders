import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAddonNameFromWonder } from '../utils/wonders';

export type Props = {
  value: string;
  wonders: string[];
  selectedWonders: string[];
  variant?: 'filled' | 'standard' | 'outlined' | undefined;
  onSelect: (wonder: string) => void;
};

export default function WonderSelect(props: Props) {
  const { t } = useTranslation();

  function isValueSelected(wonder: string) {
    return props.selectedWonders.includes(wonder);
  }

  function onChange(event: SelectChangeEvent) {
    const value = event.target.value as string;
    if (!isValueSelected(value)) {
      props.onSelect(value);
    }
  }

  return (
    <FormControl
      variant={props.variant}
      sx={{
        width: 1,
      }}
    >
      <InputLabel role="label">{t('wonder')}</InputLabel>
      <Select role="select" label={t('wonder')} value={props.value} onChange={onChange} variant={'standard'}>
        {[...props.wonders].sort().map(wonder => (
          <MenuItem
            key={wonder}
            value={wonder}
            disabled={isValueSelected(wonder)}
          >
            {(() => {
              const addonName = getAddonNameFromWonder(wonder);
              if (addonName) {
                return (
                  <Badge
                    badgeContent={addonName}
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        top: 0,
                        right: 0,
                        transform: 'translate(110%, -25%)'
                      },
                    }}
                  >
                    <span>{wonder}</span>
                  </Badge>
                );
              } else {
                return <span>{wonder}</span>;
              }
            })()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
