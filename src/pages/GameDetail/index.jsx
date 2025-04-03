import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Badge, Button, Spinner, Alert, Carousel } from 'react-bootstrap';
import { fetchGameDetails, clearCurrentGame } from '../../redux/slices/gamesSlice';
import Header from '../../components/Header';
import './GameDetail.css';

const GameDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentGame, status, error } = useSelector((state) => state.games);
    const bookmarks = useSelector((state) => state.bookmarks.items);
    const isBookmarked = bookmarks.some(item => item?.id === parseInt(id));

    useEffect(() => {
        // Fetch game details when component mounts
        dispatch(fetchGameDetails(id));

        // Clear current game when component unmounts
        return () => {
            dispatch(clearCurrentGame());
        };
    }, [dispatch, id]);

    const handleBookmark = () => {
        if (isBookmarked) {
            dispatch({ type: 'bookmarks/removeBookmark', payload: parseInt(id) });
        } else if (currentGame) {
            dispatch({ type: 'bookmarks/addBookmark', payload: currentGame });
        }
    };

    // Format release date
    const formatReleaseDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Render loading state
    if (status === 'loading') {
        return (
            <div className="game-detail-page">
                <Header />
                <Container className="my-5">
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
                        <div className="loading-text">LOADING GAME DETAILS...</div>
                    </div>
                </Container>
            </div>
        );
    }

    // Render error state
    if (status === 'failed') {
        return (
            <div>
                <Header />
                <Container className="my-5">
                    <Alert variant="danger">
                        Error: {error || 'Failed to load game details'}
                    </Alert>
                    <Button as={Link} to="/" variant="primary">
                        Back to Home
                    </Button>
                </Container>
            </div>
        );
    }

    // Render game details when data is loaded
    if (status === 'succeeded' && currentGame) {
        return (
            <div className="game-detail-page">
                <Header />
                <Container className="game-detail-container">
                    <Button as={Link} to="/" variant="outline-secondary" className="mb-4">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Games
                    </Button>

                    <Row>
                        <Col lg={8}>
                            <h1 className="game-title">{currentGame.name}</h1>

                            <div className="game-meta">
                                {currentGame.released && (
                                    <Badge bg="secondary" className="me-2">
                                        Released: {formatReleaseDate(currentGame.released)}
                                    </Badge>
                                )}

                                {currentGame.rating > 0 && (
                                    <Badge bg="warning" text="dark" className="me-2">
                                        <i className="bi bi-star-fill me-1"></i>
                                        {currentGame.rating.toFixed(1)}
                                    </Badge>
                                )}

                                {currentGame.metacritic && (
                                    <Badge bg={currentGame.metacritic > 75 ? "success" : currentGame.metacritic > 50 ? "warning" : "danger"} className="me-2">
                                        Metacritic: {currentGame.metacritic}
                                    </Badge>
                                )}
                            </div>

                            {currentGame.genres && (
                                <div className="game-genres mb-3">
                                    {currentGame.genres.map(genre => (
                                        <Badge key={genre.id} bg="info" className="me-1">{genre.name}</Badge>
                                    ))}
                                </div>
                            )}

                            <Button
                                variant={isBookmarked ? "danger" : "primary"}
                                onClick={handleBookmark}
                                className="mb-4"
                            >
                                <i className={`bi ${isBookmarked ? 'bi-bookmark-dash' : 'bi-bookmark-plus'} me-2`}></i>
                                {isBookmarked ? 'Remove from Library' : 'Add to Library'}
                            </Button>

                            {currentGame.description_raw && (
                                <div className="game-description">
                                    <h3>About</h3>
                                    <p>{currentGame.description_raw}</p>
                                </div>
                            )}

                            {currentGame.screenshots && currentGame.screenshots.results && currentGame.screenshots.results.length > 0 && (
                                <div className="game-screenshots">
                                    <h3>Screenshots</h3>
                                    <Carousel>
                                        {currentGame.screenshots.results.map(screenshot => (
                                            <Carousel.Item key={screenshot.id}>
                                                <img
                                                    className="d-block w-100"
                                                    src={screenshot.image}
                                                    alt={`Screenshot ${screenshot.id}`}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>
                            )}
                        </Col>

                        <Col lg={4}>
                            <div className="game-sidebar">
                                {currentGame.background_image && (
                                    <img
                                        src={currentGame.background_image}
                                        alt={currentGame.name}
                                        className="game-image mb-4"
                                    />
                                )}

                                {currentGame.platforms && (
                                    <div className="game-info">
                                        <h4>Platforms</h4>
                                        <ul className="list-unstyled">
                                            {currentGame.platforms.map(platform => (
                                                <li key={platform.platform.id} className="mb-1">
                                                    <i className="bi bi-controller me-2"></i>
                                                    {platform.platform.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {currentGame.developers && currentGame.developers.length > 0 && (
                                    <div className="game-info">
                                        <h4>Developers</h4>
                                        <p>{currentGame.developers.map(dev => dev.name).join(', ')}</p>
                                    </div>
                                )}

                                {currentGame.publishers && currentGame.publishers.length > 0 && (
                                    <div className="game-info">
                                        <h4>Publishers</h4>
                                        <p>{currentGame.publishers.map(pub => pub.name).join(', ')}</p>
                                    </div>
                                )}

                                {currentGame.esrb_rating && (
                                    <div className="game-info">
                                        <h4>Age Rating</h4>
                                        <Badge bg="dark">{currentGame.esrb_rating.name}</Badge>
                                    </div>
                                )}

                                {currentGame.website && (
                                    <div className="game-info">
                                        <h4>Website</h4>
                                        <a href={currentGame.website} target="_blank" rel="noopener noreferrer">
                                            {currentGame.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    // Fallback if no data is available
    return (
        <div>
            <Header />
            <Container className="my-5 text-center">
                <Alert variant="info">No game data available</Alert>
                <Button as={Link} to="/" variant="primary">
                    Back to Home
                </Button>
            </Container>
        </div>
    );
};

export default GameDetail;