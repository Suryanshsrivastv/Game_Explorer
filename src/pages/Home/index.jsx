import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import GameCard from '../../components/GameCard';
import Pagination from '../../components/Pagination';
import { fetchGames } from '../../redux/slices/gamesSlice';
import { setAllFilters } from '../../redux/slices/filtersSlice';
import './Home.css';

const Home = () => {
    const dispatch = useDispatch();
    const { games, status, error, totalPages } = useSelector((state) => state.games);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const filters = useSelector((state) => state.filters);

    // Fetch games when component mounts or when filters/search/page changes
    useEffect(() => {
        const params = {
            page: currentPage,
            search: searchTerm,
            ordering: filters.popularity || '-added',
        };

        // Add genres filter if categories are selected
        if (filters.categories.length > 0) {
            params.genres = filters.categories.join(',');
        }

        // Add tags filter if tags are selected
        if (filters.tags.length > 0) {
            params.tags = filters.tags.join(',');
        }

        // Add year filter if a release year is selected
        if (filters.releaseYear) {
            const year = parseInt(filters.releaseYear);
            params.dates = `${year}-01-01,${year}-12-31`;
        }

        dispatch(fetchGames(params));
    }, [dispatch, currentPage, searchTerm, filters]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleFilterChange = (newFilters) => {
        dispatch(setAllFilters(newFilters));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="home-page">
            <Header onSearch={handleSearch} onFilterChange={handleFilterChange} />

            <Container fluid className="mt-4 mb-5 content-container">
                <Row>
                    {/* Sidebar moved to Header component as offcanvas */}

                    <Col>
                        {status === 'loading' && (
                            <div className="loading-container">
                                <div className="game-loading">
                                    <div className="game-loading-cube">
                                        <div className="game-loading-face"><i className="fas fa-gamepad"></i></div>
                                        <div className="game-loading-face"><i className="fas fa-dice"></i></div>
                                        <div className="game-loading-face"><i className="fas fa-ghost"></i></div>
                                        <div className="game-loading-face"><i className="fas fa-trophy"></i></div>
                                        <div className="game-loading-face"><i className="fas fa-headset"></i></div>
                                        <div className="game-loading-face"><i className="fas fa-dragon"></i></div>
                                    </div>
                                </div>
                                <div className="loading-text">LOADING GAMES...</div>
                            </div>
                        )}

                        {status === 'failed' && (
                            <Alert variant="danger" className="my-3">
                                Error: {error || 'Failed to load games'}
                            </Alert>
                        )}

                        {status === 'succeeded' && games.length === 0 && (
                            <Alert variant="info" className="my-3">
                                No games found matching your criteria. Try adjusting your filters or search term.
                            </Alert>
                        )}

                        {status === 'succeeded' && games.length > 0 && (
                            <>
                                <div className="games-count mb-3">
                                    Showing {games.length} games
                                </div>

                                <Row xs={1} sm={2} md={3} lg={4} className="g-4 games-grid" style={{ width: '100%', margin: '0' }}>
                                    {games.map(game => (
                                        <Col key={game.id} className="mb-4">
                                            <GameCard game={game} />
                                        </Col>
                                    ))}
                                </Row>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;