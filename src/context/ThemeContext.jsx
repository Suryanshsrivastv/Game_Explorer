import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
 
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        
        if (!savedTheme) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return savedTheme; 
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const toggleTheme = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setTheme(prevTheme => {
                const newTheme = prevTheme === 'light' ? 'dark' : 'light';
                return newTheme;
            });
            setTimeout(() => setIsTransitioning(false), 500);
        }, 50);
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.setAttribute('data-theme', theme);
        // Add transition class to body when theme changes
        if (isTransitioning) {
            document.body.classList.add('theme-transition');
        } else {
            document.body.classList.remove('theme-transition');
        }
    }, [theme, isTransitioning]);

    // Check for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
            {children}
        </ThemeContext.Provider>
    );
};