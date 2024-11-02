import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
        import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCt8ZEJDI7wfi0jvQDY4qMx49MMtE1in_E",
            authDomain: "academia-56566.firebaseapp.com",
            projectId: "academia-56566",
            storageBucket: "academia-56566.appspot.com",
            messagingSenderId: "578752731789",
            appId: "1:578752731789:web:dbd67a93d25d095d5b60c4"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        document.addEventListener('DOMContentLoaded', async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('query');
            const searchInput = document.getElementById('search-input');
            const resultsContainer = document.getElementById('results-container');

            if (query) {
                console.log('Query:', query); // Debugging: log the query parameter

                // Set the document title to "query - Academia"
                document.title = `${query} - Academia`;

                // Set the input value to the search query
                if (searchInput) {
                    searchInput.value = query;
                }

                const searchQuery = query.toLowerCase();

                try {
                    const articlesRef = collection(db, 'articles');
                    const querySnapshot = await getDocs(articlesRef);
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    //console.log('Data:', data); // Debugging: log the fetched data

                    const filteredResults = data.filter(article => {
                        const topic = article.topic ? article.topic.toLowerCase() : '';
                        const snippet = article.snippet ? article.snippet.toLowerCase() : '';
                        const author = article.author ? article.author.toLowerCase() : '';

                        //console.log('Checking article:', article); // Debugging: log each article being checked
                        //console.log('Topic:', topic, 'Snippet:', snippet, 'Author:', author); // Debugging: log topic, snippet, and author

                        return topic.includes(searchQuery) || snippet.includes(searchQuery) || author.includes(searchQuery);
                    });

                    // console.log('Filtered Results:', filteredResults); // Debugging: log the filtered results

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

                    //console.log('Sorted Results:', sortedResults); // Debugging: log the sorted results

                    resultsContainer.innerHTML = '';

                    if (sortedResults.length > 0) {
                        sortedResults.forEach(article => {
                            const articleDiv = document.createElement('div');
                            articleDiv.classList.add('article');
                            articleDiv.setAttribute('data-aos', 'fade-right');
                            articleDiv.setAttribute('data-aos-duration', '1000');

                            const titleElement = document.createElement('a');
                            titleElement.href = `topic.html?id=${encodeURIComponent(article.id)}`;
                            titleElement.innerHTML = `<h2 id="title">${article.topic}</h2>`;

                            const snippetElement = document.createElement('p');
                            snippetElement.classList.add('article-snippet');
                            snippetElement.textContent = article.snippet;

                            const authorElement = document.createElement('p');
                            authorElement.classList.add('article-author');
                            authorElement.textContent = article.author;

                            articleDiv.appendChild(titleElement);
                            articleDiv.appendChild(snippetElement);
                            articleDiv.appendChild(authorElement);
                            resultsContainer.appendChild(articleDiv);
                        });
                    } else {
                        resultsContainer.innerHTML = '<p>No results found.</p>';
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    resultsContainer.innerHTML = '<p>An error occurred while fetching the data.</p>';
                }
            }
        });