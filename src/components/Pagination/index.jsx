import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate page items
    const renderPageItems = () => {
        const items = [];
        const maxVisiblePages = 5; // Maximum number of page buttons to show

        // Always show first page
        items.push(
            <BootstrapPagination.Item
                key={1}
                active={currentPage === 1}
                onClick={() => handlePageChange(1)}
            >
                1
            </BootstrapPagination.Item>
        );

        // Calculate range of pages to show
        let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

        // Adjust if we're near the beginning
        if (startPage > 2) {
            items.push(<BootstrapPagination.Ellipsis key="ellipsis-1" />);
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <BootstrapPagination.Item
                    key={i}
                    active={currentPage === i}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </BootstrapPagination.Item>
            );
        }

        // Add ellipsis if needed
        if (endPage < totalPages - 1) {
            items.push(<BootstrapPagination.Ellipsis key="ellipsis-2" />);
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            items.push(
                <BootstrapPagination.Item
                    key={totalPages}
                    active={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </BootstrapPagination.Item>
            );
        }

        return items;
    };

    // Don't render pagination if there's only one page
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <BootstrapPagination>
                <BootstrapPagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />

                {renderPageItems()}

                <BootstrapPagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </BootstrapPagination>
        </div>
    );
};

export default Pagination;