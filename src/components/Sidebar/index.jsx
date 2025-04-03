import React, { useEffect } from 'react';
import { Form, Button, Accordion } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilters, resetFilters, setAllFilters } from '../../redux/slices/filtersSlice';
import './Sidebar.css';

const Sidebar = ({ onFilterChange }) => {
    const filters = useSelector((state) => state.filters);
    const dispatch = useDispatch();

    // Sample data - in a real app, these would come from the API
    const categories = [
        { id: 'action', name: 'Action' },
        { id: 'adventure', name: 'Adventure' },
        { id: 'rpg', name: 'RPG' },
        { id: 'strategy', name: 'Strategy' },
        { id: 'shooter', name: 'Shooter' },
        { id: 'casual', name: 'Casual' },
        { id: 'simulation', name: 'Simulation' },
        { id: 'puzzle', name: 'Puzzle' },
        { id: 'arcade', name: 'Arcade' },
        { id: 'platformer', name: 'Platformer' },
        { id: 'racing', name: 'Racing' },
        { id: 'sports', name: 'Sports' },
    ];

    const tags = [
        { id: 'singleplayer', name: 'Singleplayer' },
        { id: 'multiplayer', name: 'Multiplayer' },
        { id: 'coop', name: 'Co-op' },
        { id: 'open-world', name: 'Open World' },
        { id: 'first-person', name: 'First Person' },
        { id: 'third-person', name: 'Third Person' },
        { id: 'sci-fi', name: 'Sci-fi' },
        { id: 'fantasy', name: 'Fantasy' },
        { id: 'horror', name: 'Horror' },
        { id: 'pixel-graphics', name: 'Pixel Graphics' },
        { id: 'vr', name: 'VR' },
    ];

    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    const popularityOptions = [
        { value: 'rating', label: 'Highest Rated' },
        { value: 'released', label: 'Recently Released' },
        { value: 'added', label: 'Most Added' },
        { value: 'created', label: 'Recently Added' },
    ];

    const handleCategoryChange = (categoryId) => {
        const updatedCategories = filters.categories.includes(categoryId)
            ? filters.categories.filter(id => id !== categoryId)
            : [...filters.categories, categoryId];

        updateFilterValue('categories', updatedCategories);
    };

    const handleTagChange = (tagId) => {
        const updatedTags = filters.tags.includes(tagId)
            ? filters.tags.filter(id => id !== tagId)
            : [...filters.tags, tagId];

        updateFilterValue('tags', updatedTags);
    };

    const updateFilterValue = (key, value) => {
        dispatch(updateFilters({ key, value }));
        if (onFilterChange) {
            const updatedFilters = { ...filters, [key]: value };
            onFilterChange(updatedFilters);
        }
    };

    const handleReset = () => {
        dispatch(resetFilters());
        if (onFilterChange) {
            const emptyFilters = {
                categories: [],
                tags: [],
                releaseYear: '',
                popularity: ''
            };
            onFilterChange(emptyFilters);
        }
    };

    return (
        <div className="sidebar">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Filters</h5>
                <Button variant="outline-secondary" size="sm" onClick={handleReset}>
                    Reset
                </Button>
            </div>

            <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Categories</Accordion.Header>
                    <Accordion.Body className="filter-section">
                        {categories.map(category => (
                            <Form.Check
                                key={category.id}
                                type="checkbox"
                                id={`category-${category.id}`}
                                label={category.name}
                                checked={filters.categories.includes(category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="mb-2"
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Tags</Accordion.Header>
                    <Accordion.Body className="filter-section">
                        {tags.map(tag => (
                            <Form.Check
                                key={tag.id}
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                label={tag.name}
                                checked={filters.tags.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                                className="mb-2"
                            />
                        ))}
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Release Year</Accordion.Header>
                    <Accordion.Body>
                        <Form.Select
                            value={filters.releaseYear}
                            onChange={(e) => updateFilterValue('releaseYear', e.target.value)}
                        >
                            <option value="">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Form.Select>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Popularity</Accordion.Header>
                    <Accordion.Body>
                        <Form.Select
                            value={filters.popularity}
                            onChange={(e) => updateFilterValue('popularity', e.target.value)}
                        >
                            <option value="">Default</option>
                            {popularityOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Select>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

export default Sidebar;