import React, { useState, useEffect } from 'react';

function AvatarTheme({ handleReset }) {
    const defaultThemeUrl = `${process.env.PUBLIC_URL}/images/themes/theme.png`;
    const [themeUrl, setThemeUrl] = useState(defaultThemeUrl);

    // Load the theme from localStorage on mount
    useEffect(() => {
        const savedThemeUrl = localStorage.getItem('themeUrl') || defaultThemeUrl;
        setThemeUrl(savedThemeUrl);
    }, []);

    const resetTheme = () => {
        setThemeUrl(defaultThemeUrl);
        localStorage.removeItem('themeUrl');
        if (handleReset) handleReset(); // Notify parent component if necessary
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
                src={themeUrl}
                alt="Current Theme"
                style={{
                    width: '100%',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                }}
                onClick={resetTheme} // Reset on click
                title="Click to reset to the default theme"
            />
        </div>
    );
}

export default AvatarTheme;
