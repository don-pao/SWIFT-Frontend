import React, { useState, useEffect } from 'react';

function AvatarTheme() {
    const [themeUrl, setThemeUrl] = useState(`${process.env.PUBLIC_URL}/images/themes/theme.png`);

    useEffect(() => {
        // Check localStorage for saved theme
        const savedThemeUrl = localStorage.getItem("themeUrl");
        if (savedThemeUrl) {
            setThemeUrl(savedThemeUrl);
        }
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img
                src={themeUrl}
                alt="Current Theme"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
        </div>
    );
}

export default AvatarTheme;
