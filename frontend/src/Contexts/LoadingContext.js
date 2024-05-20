import React, { createContext, useContext, useState } from 'react';

// Create a loading context
const LoadingContext = createContext();

// Custom hook to use loading context
export const useLoading = () => useContext(LoadingContext);

// Loading provider component
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // Function to set loading state to true
    const startLoading = () => setLoading(true);

    // Function to set loading state to false
    const finishLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, startLoading, finishLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
