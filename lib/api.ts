const API_URL = 'https://student-khabri-backend-1.onrender.com/api';

export const fetcher = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'An error occurred');
    }

    return res.json();
};
