import React, { useState, useEffect } from 'react';

function AvatarTheme() {
    const defaultThemeUrl = `${process.env.PUBLIC_URL}/images/themes/theme.png`;
    const [themeUrl, setThemeUrl] = useState(defaultThemeUrl);

    useEffect(() => {
        // Check localStorage for saved theme
        const savedThemeUrl = localStorage.getItem("themeUrl");
        if (savedThemeUrl) {
            setThemeUrl(savedThemeUrl);
        }
    }, []);

    const handleReset = () => {
        // Remove the saved theme from localStorage
        localStorage.removeItem("themeUrl");
        // Reset the theme to the default
        setThemeUrl(defaultThemeUrl);
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
                src={themeUrl}
                alt="Current Theme"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={handleReset} // Reset on click
                title="Click to reset to the default theme"
            />
        </div>
    );
}

export default AvatarTheme;
