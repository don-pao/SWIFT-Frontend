import React, { useState, useEffect } from 'react';
import { usePersonalInfo } from '../context/PersonalInfoContext';

function AvatarTheme({ handleReset }) {
    const { personalInfo } = usePersonalInfo();
    const defaultThemeUrl = `${process.env.PUBLIC_URL}/images/themes/theme.png`;
    const [themeUrl, setThemeUrl] = useState(defaultThemeUrl);

    // Load the theme from localStorage on mount, user-specific
    useEffect(() => {
        if (personalInfo?.userId) {
            const userSpecificThemeKey = `themeUrl_${personalInfo.userId}`;
            const savedThemeUrl = localStorage.getItem(userSpecificThemeKey) || defaultThemeUrl;
            setThemeUrl(savedThemeUrl);
        }
    }, [personalInfo]);

    const resetTheme = () => {
        if (personalInfo?.userId) {
            const userSpecificThemeKey = `themeUrl_${personalInfo.userId}`;
            setThemeUrl(defaultThemeUrl);
            localStorage.removeItem(userSpecificThemeKey);
            if (handleReset) handleReset();
        }
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
                onClick={resetTheme}
                title="Click to reset to the default theme"
            />
        </div>
    );
}

export default AvatarTheme;