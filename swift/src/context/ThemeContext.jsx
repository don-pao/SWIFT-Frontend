import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePersonalInfo } from './PersonalInfoContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { personalInfo } = usePersonalInfo();

    const colorPalettes = {
        'theme.png': { pageBackground: '#f5f5f5', appBarBackground: '#432874' },
        '2.png': { pageBackground: '#f6dea9', appBarBackground: '#214f4b' },
        '3.png': { pageBackground: '#c3dcf5', appBarBackground: '#116449' },
        '4.png': { pageBackground: '#f8bac0', appBarBackground: '#a16d2b' },
        '5.png': { pageBackground: '#ebd7f6', appBarBackground: '#ae7748' },
    };

    // Default theme
    const getDefaultTheme = () => colorPalettes['theme.png'];

    // Initial theme state (if personalInfo is available, use the stored theme)
    const [theme, setTheme] = useState(() => {
        if (personalInfo?.userId) {
            const savedTheme = localStorage.getItem(`theme_${personalInfo.userId}`);
            return savedTheme ? JSON.parse(savedTheme) : getDefaultTheme();
        }
        return getDefaultTheme();
    });

    // Use effect to set the theme when personalInfo changes
    useEffect(() => {
        if (personalInfo?.userId) {
            const storedThemes = JSON.parse(localStorage.getItem('themes')) || {};
            const savedTheme = storedThemes[personalInfo.userId];
            if (savedTheme && colorPalettes[savedTheme]) {
                setTheme(colorPalettes[savedTheme]);
            }
        }
    }, [personalInfo]);

    // Update theme and store it in localStorage
    const updateTheme = (themeName) => {
        if (colorPalettes[themeName]) {
            const newTheme = colorPalettes[themeName];
            setTheme(newTheme);

            // Save the theme name and color properties in localStorage
            if (personalInfo?.userId) {
                const storedThemes = JSON.parse(localStorage.getItem('themes')) || {};
                storedThemes[personalInfo.userId] = themeName;
                localStorage.setItem('themes', JSON.stringify(storedThemes));
                localStorage.setItem(`theme_${personalInfo.userId}`, JSON.stringify(newTheme));
                localStorage.setItem(`appBarBgColor_${personalInfo.userId}`, newTheme.appBarBackground);
                localStorage.setItem(`pageBgColor_${personalInfo.userId}`, newTheme.pageBackground);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
