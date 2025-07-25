import { Rnd } from 'react-rnd';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TutorialOverlayProps {
  url: string;
  onClose: () => void;
}

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url; // Return original URL if not a recognizable YouTube URL
};

export default function TutorialOverlay({ url, onClose }: TutorialOverlayProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <Rnd
      default={{ x: 40, y: 40, width: 480, height: 270 }}
      bounds="window"
      minWidth={320}
      minHeight={180}
      maxWidth={800}
      maxHeight={600}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      dragHandleClassName="drag-handle"
      style={{ zIndex: 9999 }}
    >
      <Box 
        sx={{ 
          height: '100%', 
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag Handle Header */}
        <Box
          className="drag-handle"
          sx={{
            height: '40px',
            background: 'linear-gradient(90deg, #FF7F32, #FFA07A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            cursor: 'move',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 6, 
              height: 6, 
              bgcolor: 'rgba(255,255,255,0.8)', 
              borderRadius: '50%' 
            }} />
            <Box sx={{ 
              width: 6, 
              height: 6, 
              bgcolor: 'rgba(255,255,255,0.8)', 
              borderRadius: '50%' 
            }} />
            <Box sx={{ 
              width: 6, 
              height: 6, 
              bgcolor: 'rgba(255,255,255,0.8)', 
              borderRadius: '50%' 
            }} />
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              padding: '4px',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Video Content */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Tutorial Video"
            style={{ 
              borderRadius: '0 0 8px 8px',
              display: 'block'
            }}
          />
        </Box>
      </Box>
    </Rnd>
  );
} 