import React from 'react';

function AvatarTheme({ themeUrl, handleReset }) {
    const defaultThemeUrl = `${process.env.PUBLIC_URL}/images/themes/theme.png`;

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
                src={themeUrl || defaultThemeUrl}
                alt="Current Theme"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={handleReset} // Reset on click
                title="Click to reset to the default theme"
            />
        </div>
    );
}

export default AvatarTheme;
