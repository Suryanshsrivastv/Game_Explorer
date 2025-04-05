import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        items.push(
            <BootstrapPagination.Item
                key={1}
                active={currentPage === 1}
                onClick={() => handlePageChange(1)}
            >
                1
            </BootstrapPagination.Item>
        );
        let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

        if (startPage > 2) {
            items.push(<BootstrapPagination.Ellipsis key="ellipsis-1" />);
        }

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

        if (endPage < totalPages - 1) {
            items.push(<BootstrapPagination.Ellipsis key="ellipsis-2" />);
        }

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