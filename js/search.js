document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');

    if (query) {
        console.log('Query:', query); // Debugging: log the query parameter

        // Set the input value to the search query
        if (searchInput) {
            searchInput.value = query;
        }

        fetch('https://raw.githubusercontent.com/Nelkeys/academia-data/main/data.json') // Corrected URL
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data:', data); // Debugging: log the fetched data

                const searchQuery = query.toLowerCase();
                console.log('Search Query:', searchQuery); // Debugging: log the search query

                const filteredResults = data.filter(article => {
                    const topic = article.topic ? article.topic.toLowerCase() : '';
                    const snippet = article.snippet ? article.snippet.toLowerCase() : '';
                    const author = article.author ? article.author.toLowerCase() : '';

                    console.log('Checking article:', article); // Debugging: log each article being checked
                    console.log('Topic:', topic, 'Snippet:', snippet, 'Author:', author); // Debugging: log topic, snippet, and author

                    return topic.includes(searchQuery) || snippet.includes(searchQuery) || author.includes(searchQuery);
                });

                console.log('Filtered Results:', filteredResults); // Debugging: log the filtered results

                const sortedResults = filteredResults.sort((a, b) => {
                    const aTopic = a.topic ? a.topic.toLowerCase() : '';
                    const bTopic = b.topic ? b.topic.toLowerCase() : '';

                    if (aTopic.includes(searchQuery) && !bTopic.includes(searchQuery)) {
                        return -1;
                    }
                    if (!aTopic.includes(searchQuery) && bTopic.includes(searchQuery)) {
                        return 1;
                    }
                    return 0;
                });

                console.log('Sorted Results:', sortedResults); // Debugging: log the sorted results

                resultsContainer.innerHTML = '';

                if (sortedResults.length > 0) {
                    sortedResults.forEach(article => {
                        const articleDiv = document.createElement('div');
                        articleDiv.classList.add('article');

                        const titleElement = document.createElement('a');
                        titleElement.href = `topic.html?title=${encodeURIComponent(article.topic)}&date=${encodeURIComponent(article.date)}&note=${encodeURIComponent(article.full_note)}&author=${encodeURIComponent(article.author)}`;
                        titleElement.innerHTML = `<h2 id="title">${article.topic}</h2>`;

                        const snippetElement = document.createElement('p');
                        snippetElement.classList.add('article-snippet'); // Added class "article-snippet"
                        snippetElement.textContent = article.snippet;

                        const authorElement = document.createElement('p');
                        authorElement.classList.add('article-author'); // Added class "article-author"
                        authorElement.textContent = article.author;

                        articleDiv.appendChild(titleElement);
                        articleDiv.appendChild(snippetElement);
                        articleDiv.appendChild(authorElement);
                        resultsContainer.appendChild(articleDiv);
                    });
                } else {
                    resultsContainer.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsContainer.innerHTML = '<p>An error occurred while fetching the data.</p>';
            });
    } else {
        resultsContainer.innerHTML = '<p>Please enter a search query.</p>';
    }
});
