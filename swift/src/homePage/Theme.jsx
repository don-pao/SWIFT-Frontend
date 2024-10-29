import React from 'react';

function AvatarTheme() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <img
        src='./themes/theme.png'
        alt="Wide view"
        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} // Adjust the height as needed
      />
    </div>
  );
}

export default AvatarTheme;
