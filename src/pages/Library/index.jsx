import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import GameCard from '../../components/GameCard';
import './Library.css';

const Library = () => {
    const bookmarks = useSelector((state) => state.bookmarks.items);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="library-page">
            <Header />

            <Container className="my-4">
                <h2 className="mb-4 slide-in-left">Game Library</h2>

                {isLoading ? (
                    <div className="text-center my-5 fade-in">
                        <Spinner animation="border" role="status" className="library-spinner">
                            <span className="visually-hidden">Loading library...</span>
                        </Spinner>
                        <p className="mt-3 text-muted">Loading game collection...</p>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <Alert variant="info" className="slide-up">
                        <h4>Library is empty</h4>
                        <p>No games have been added to the library yet. Browse games and click the bookmark icon to add them here.</p>
                        <div className="d-flex justify-content-end">
                            <Button as={Link} to="/" variant="primary">Browse Games</Button>
                        </div>
                    </Alert>
                ) : (
                    <>
                        <p className="text-muted mb-4 slide-in-right">
                            {bookmarks.length} game{bookmarks.length !== 1 ? 's' : ''} in library
                        </p>

                        <Row xs={1} sm={2} md={3} lg={4} className="g-4 library-grid">
                            {bookmarks.map((game, index) => (
                                <Col key={game.id} className={`library-item-${index % 4}`}>
                                    <GameCard game={game} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
};

export default Library;