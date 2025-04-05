import React, { useState, useContext, useEffect, useRef } from 'react';
import { Navbar, Container, Form, FormControl, Button, Nav, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../ThemeToggle';
import Sidebar from '../Sidebar';
import './Header.css';
import '../../styles/sidebar-slide.css';

const Header = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const bookmarks = useSelector((state) => state.bookmarks.items);
    const { isSignedIn, user } = useAuth();
    const progressBarRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (onSearch) {
            if (value.trim() || searchTerm.trim()) {
                onSearch(value);
            }
        }
    };

    const toggleSidebar = () => {
        const newSidebarState = !showSidebar;
        setShowSidebar(newSidebarState);
        if (newSidebarState) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    };

    useEffect(() => {
        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, []);

    const { theme } = useContext(ThemeContext);

    return (
        <>
            <Navbar bg={theme === 'dark' ? 'dark' : 'dark'} variant="dark" expand="lg" className="header">
                <Container fluid>
                    <Button
                        variant="outline-light"
                        className="me-2 filter-menu-btn"
                        onClick={toggleSidebar}
                        aria-label="Filter Menu"
                    >
                        <i className="bi bi-list"></i>
                    </Button>

                    <Navbar.Brand as={Link} to="/" className="brand-animation">
                        <img
                            src="/favicon.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top me-2 logo-spin"
                            alt="TanVic Games Logo"
                        />
                        TanVic Games
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Form className="d-flex mx-auto search-form" onSubmit={handleSearch}>
                            <FormControl
                                type="search"
                                placeholder="Search games..."
                                className="me-2 search-input"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleInputChange}
                            />
                            <Button variant="outline-success" type="submit" className="search-button">Search</Button>
                            <ThemeToggle />
                        </Form>
                        <Nav className="align-items-center">
                            <Nav.Link as={Link} to="/library" className="d-flex align-items-center nav-link-animated">
                                <i className="bi bi-bookmark-heart me-1"></i>
                                Library
                                {bookmarks.length > 0 && (
                                    <span className="badge bg-primary ms-1 badge-animated">{bookmarks.length}</span>
                                )}
                            </Nav.Link>
                            {isSignedIn ? (
                                <Nav.Link as={Link} to="/profile" className="nav-link-animated">
                                    {user.firstName || 'Profile'}
                                </Nav.Link>
                            ) : (
                                <Nav.Link as={Link} to="/sign-in" className="nav-link-animated">Sign In</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="scroll-progress-container">
                <div
                    ref={progressBarRef}
                    className="scroll-progress-bar"
                    style={{ width: `${scrollProgress}%` }}
                ></div>
            </div>

            <Offcanvas show={showSidebar} onHide={toggleSidebar} placement="start" className="filter-sidebar">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Sidebar onFilterChange={onFilterChange} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Header;