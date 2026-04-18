import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import catalogService from '../services/catalogService';

export default function VisitTracker() {
    const location = useLocation();

    useEffect(() => {
        // We only consider it a visit if they navigate past the home page
        if (location.pathname === '/' || location.pathname === '') return;

        // Ensure we only record one visit per session
        const hasVisited = sessionStorage.getItem('has_recorded_visit');
        if (!hasVisited) {
            catalogService.recordVisit()
                .then(() => {
                    sessionStorage.setItem('has_recorded_visit', 'true');
                })
                .catch(err => console.error("Failed to record analytics visit", err));
        }
    }, [location.pathname]);

    return null; // This is an invisible utility component
}
