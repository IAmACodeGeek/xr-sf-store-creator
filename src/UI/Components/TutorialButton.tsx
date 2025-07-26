import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface TutorialButtonProps {
  onClick: () => void;
}

export default function TutorialButton({ onClick }: TutorialButtonProps) {
  return (
    <Tooltip title="Watch Tutorial" placement="bottom">
      <IconButton
        onClick={onClick}
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#FF7F32',
            transform: 'scale(1.1)',
          },
        }}
      >
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  );
} 