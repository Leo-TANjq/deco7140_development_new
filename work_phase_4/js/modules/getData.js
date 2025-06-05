const fetchGetData = async (url, headers = {}) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error('Server returned an error.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export { fetchGetData };