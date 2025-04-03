import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="theme-toggle-wrapper">
            <label className="theme-toggle-switch">
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                />
                <span className="theme-toggle-slider">
                    <span className="moon-icon">🌙</span>
                    <span className="sun-icon">☀️</span>
                </span>
            </label>
        </div>
    );
};

export default ThemeToggle;