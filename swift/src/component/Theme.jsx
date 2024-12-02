import React, { useState, useEffect } from 'react';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import { useTheme } from '../context/ThemeContext';

function AvatarTheme({ handleReset }) {
    const { personalInfo } = usePersonalInfo();
    const { theme } = useTheme();
    const defaultThemeUrl = `${process.env.PUBLIC_URL}/images/themes/theme.png`;
    const [themeUrl, setThemeUrl] = useState(defaultThemeUrl);

    useEffect(() => {
        if (personalInfo?.userId) {
            const userSpecificThemeKey = `themeUrl_${personalInfo.userId}`;
            const savedThemeUrl = localStorage.getItem(userSpecificThemeKey) || defaultThemeUrl;
            setThemeUrl(savedThemeUrl);
            // Save the theme URL and colors in local storage
            localStorage.setItem(userSpecificThemeKey, savedThemeUrl);
            localStorage.setItem(`appBarBgColor_${personalInfo.userId}`, theme.appBarBackground);
            localStorage.setItem(`pageBgColor_${personalInfo.userId}`, theme.pageBackground);
        }

        // Apply the theme colors on mount
        const appBarElement = document.getElementById('app-bar');
        if (appBarElement) {
            appBarElement.style.backgroundColor = theme.appBarBackground;
        }
        document.body.style.backgroundColor = theme.pageBackground;
    }, [personalInfo, theme]);

    const resetTheme = () => {
        if (personalInfo?.userId) {
            const userSpecificThemeKey = `themeUrl_${personalInfo.userId}`;
            setThemeUrl(defaultThemeUrl);
            localStorage.removeItem(userSpecificThemeKey); // Remove the theme URL on reset
            localStorage.removeItem(`appBarBgColor_${personalInfo.userId}`); // Remove app bar color
            localStorage.removeItem(`pageBgColor_${personalInfo.userId}`); // Remove page background color
            document.body.style.backgroundColor = '#ffffff'; // Reset to default white
            const appBarElement = document.getElementById('app-bar');
            if (appBarElement) {
                appBarElement.style.backgroundColor = '#3f51b5'; // Reset to Material-UI default
            }
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
