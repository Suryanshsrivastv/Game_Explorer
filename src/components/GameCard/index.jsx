import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './GameCard.css';

const GameCard = ({ game }) => {
    const dispatch = useDispatch();
    const bookmarks = useSelector((state) => state.bookmarks.items);
    const isBookmarked = bookmarks.some(item => item?.id === game.id);

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isBookmarked) {
            dispatch({ type: 'bookmarks/removeBookmark', payload: game.id });
        } else {
            dispatch({ type: 'bookmarks/addBookmark', payload: game });
        }
    };

    const formatReleaseDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <Card className="game-card h-100">
            <Link to={`/game/${game.id}`} className="game-card-link">
                {game.background_image ? (
                    <div className="game-card-image-container">
                        <Card.Img
                            variant="top"
                            src={game.background_image}
                            alt={game.name}
                            className="game-card-image"
                        />
                    </div>
                ) : (
                    <div className="game-card-image-placeholder">
                        <span>No Image Available</span>
                    </div>
                )}

                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                        <Card.Title className="game-card-title">{game.name}</Card.Title>
                        <button
                            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                            onClick={handleBookmark}
                            aria-label={isBookmarked ? 'Remove from library' : 'Add to library'}
                        >
                            <i className={`bi ${isBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                        </button>
                    </div>

                    {game.released && (
                        <Card.Subtitle className="mb-2 text-muted">
                            Released: {formatReleaseDate(game.released)}
                        </Card.Subtitle>
                    )}

                    {game.rating > 0 && (
                        <div className="game-rating mb-2">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            <span>{game.rating.toFixed(1)}</span>
                        </div>
                    )}

                    <div className="game-genres mb-2">
                        {game.genres?.slice(0, 3).map(genre => (
                            <Badge key={genre.id} bg="secondary" className="me-1">{genre.name}</Badge>
                        ))}
                    </div>

                    {game.platforms && (
                        <div className="game-platforms">
                            {game.platforms.slice(0, 4).map(platform => (
                                <span key={platform.platform.id} className="platform-icon me-1" title={platform.platform.name}>
                                    {getPlatformIcon(platform.platform.name)}
                                </span>
                            ))}
                            {game.platforms.length > 4 && <span>+{game.platforms.length - 4}</span>}
                        </div>
                    )}
                </Card.Body>
            </Link>
        </Card>
    );
};

const getPlatformIcon = (platformName) => {
    const name = platformName.toLowerCase();
    if (name.includes('playstation')) return <i className="bi bi-playstation"></i>;
    if (name.includes('xbox')) return <i className="bi bi-xbox"></i>;
    if (name.includes('pc') || name.includes('windows')) return <i className="bi bi-windows"></i>;
    if (name.includes('nintendo') || name.includes('switch')) return <i className="bi bi-nintendo-switch"></i>;
    if (name.includes('mac') || name.includes('apple')) return <i className="bi bi-apple"></i>;
    if (name.includes('linux')) return <i className="bi bi-ubuntu"></i>;
    if (name.includes('android')) return <i className="bi bi-android2"></i>;
    if (name.includes('ios')) return <i className="bi bi-phone"></i>;
    return <i className="bi bi-controller"></i>;
};

export default GameCard;