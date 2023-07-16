/* script.js */

// store api key in a variable
const api_key = 'AX1mRQHczgXhqC4eYD5rwwGcO30m2n3V';
// store url in a variable
const url1 = "http://api.nytimes.com/svc/topstories/v2/home.json?api-key=" + api_key;
// declare function fetchApiData() that accepts one parameter, url
async function fetchApiData(url) {
    // try to fetch the data
    try {
        // await the response of the fetch call. Assign response object to a variable named response
        const response = await fetch(url);
        // await until the response.json is resolved. Assign the result to a variable named data
        const data = await response.json();
        // log the data to make sure it's working
        // console.log(data);
        // return the data to the caller of the function
        return data;
        // catch any errors
    } catch (error) {
        // log the errors 
        console.log(error);
        // document.querySelector('.error').innerHTML = `<p class="text-danger">Sorry, something went wrong. Please try again later.</p>`;
    }
}

// call the function fetchApiData with the ur1 as an argument to get top stories data
fetchApiData(url1)
    .then(data => {
        // call displayFeaturedArticle() function to display random article from the top stories
        // (it will span the whole width of the page)
        const randomIndex = Math.floor(Math.random() * data.results.length);
        displayFeaturedArticle(data.results[randomIndex]);
        // call displayTopStories() function to display the rest of the articles
        displayTopStories(data.results);
        // call displayTopHeadlines() function to display the top headlines in the sidebar
        displayTopHeadlines(data.results);
    })
    // return featured article
    .catch(error => {
        console.log(error);
        // document.querySelector('.error').innerHTML = `<p class="text-danger">Sorry, something went wrong. Please try again later.</p>`;
    });

// function to shorten the alt text for the images
function truncateAltText(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    } else {
        return text;
    }
}

// add an event listener to the section select menu, on change call displaySections() function
document.querySelector('#section').addEventListener('change', () => {
    const selectedSection = document.querySelector('#section').value;
    // update the url without reloading the page and show the selected section in the url
    displaySections(selectedSection);
});

// add an event listener to the refresh button, on click call displaySections() function
document.querySelector('.refresh').addEventListener('click', () => {
    const selectedSection = document.querySelector('#section').value;
    if (document.querySelector('#section').value) {
        fetchApiData(url1);
        displaySections(selectedSection);
    } else {
        // reload the page
        location.reload();
    }
});


// declare function displayFeaturedArticle() that accepts one parameter, article.
// article is the first article from the top stories
function displayFeaturedArticle(article) {
    // console.log(article);
    let altText = article.multimedia[0].caption;
    if (altText === '') {
        altText = article.title;
    }
    altText = truncateAltText(article.multimedia[0].caption, 25);
    document.querySelector('.featured-img').innerHTML = `<a href="${article.url}" title="Go to article"> <img src="${article.multimedia[0].url}" alt="${altText}" class="image-filter"></a>`;
    document.querySelector('.button-red').innerHTML = `<a href="https://www.nytimes.com/" title="Read more top news" <button class="custom-button-red text-uppercase">Top News</button></a>`;
    document.querySelector('.button-white').innerHTML = `<a href="https://www.nytimes.com/section/${article.section}" title="Read more from ${article.section} section" class="text-dark"><button class="custom-button-white text-uppercase">${article.section}</button></a>`;
    // if there ia a subsection, display it
    if (article.subsection) {
        let subsection = document.querySelector('.featured-subsection');
        subsection.innerHTML = `<a href="https://www.nytimes.com/${article.subsection}"><button class="custom-button-white text-uppercase">${article.subsection}</button><a>`;
    }
    // display the author
    document.querySelector('.featured-author').innerHTML = `${article.byline}`;
    // format the date
    const publishedDate = new Date(article.published_date);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    // display the date
    document.querySelector('.featured-date').innerHTML = formattedDate;
    let featuredArticle = document.querySelector('.featured-article');
    let featuredTitle = document.createElement('h1');
    featuredTitle.classList.add('featured-title');
    // display the title, make it a link to the article
    featuredTitle.innerHTML = `<a href="${article.url}" title="Go to article">${article.title}</a>`;
    featuredArticle.appendChild(featuredTitle);
    let featuredAbstract = document.createElement('p');
    // display the abstract
    featuredAbstract.innerHTML = `${article.abstract}`;
    featuredArticle.appendChild(featuredAbstract);
}


// declare function displayTopStories() that accepts one parameter, articles (that was returned from the api call)
function displayTopStories(articles) {
    // loop through the array of articles and build the divs with individual articles data
    let heading = document.querySelector('.top-articles');
    heading.innerHTML = `<h2 class="custom-text">Latest News</h2>`;
    let output = '';
    // loop through the articles
    for (let i = 0; i < articles.length; i++) {
        // exclude featured article from the loop
        const featuredArticle = document.querySelector('.featured-title').innerText;
        if (articles[i].title === featuredArticle) {
            console.log(featuredArticle);
            console.log('skipped');
            continue;
        }
        if (!articles[i].title || !articles[i].abstract || !articles[i].multimedia || articles[i].multimedia.length === 0) {
            return;
        }
        // format the date
        const publishedDate = new Date(articles[i].published_date);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        if (articles[i].multimedia[0].caption === '' || !articles[i].multimedia[0].caption) {
            articles[i].multimedia[0].caption = articles[i].title;
        }
        const altText = truncateAltText(articles[i].multimedia[0].caption, 25);
        output += `
    <div class="col">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <div class="position-relative">
                        <a href=${articles[i].url} title="Go to article"><img src="${articles[i].multimedia[0].url}" alt="${altText}" class="img-fluid fixed-height-img image-filter"></a>
                        <a href="https://www.nytimes.com/section/${articles[i].section}" title="Read more from ${articles[i].section} section"> <div class="custom-rectangle"><p class="ps-2 text-white text-uppercase">${articles[i].section}</p></div></a>
                    </div>
                </div>
                <div class="col-6 d-flex flex-column justify-content-between">
                    <div>
                        <a href="${articles[i].url}" title ="Read more" class="no-decoration"><h3 class="top-articles-heading">${articles[i].title}</h3></a>
                        <p class="top-articles-abstract">${articles[i].abstract}</p>
                    </div>
                    <div>
                        <p class="text-end top-articles-author mb-0">${articles[i].byline}</p> 
                        <p class="text-end top-articles-date mb-0">${formattedDate}</p>                    
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }
    document.querySelector('.output').innerHTML = output;
}

// declare function displayTopHeadlines() that accepts one parameter, articles (that was returned from the api call)
function displayTopHeadlines(articles) {
    // loop through a few articles and display their titles in the sidebar
    let topHeadlines = document.querySelector('.more-headlines');
    let sectionHeading = document.createElement('h2');
    sectionHeading.innerText = "More Headlines";
    sectionHeading.classList.add('custom-text');
    topHeadlines.appendChild(sectionHeading);
    for (let i = 6; i < 12; i++) {
        // log the titles to make sure it's working
        // console.log(articles[i].title);
        let headlines = document.createElement('a');
        headlines.innerHTML = `${articles[i].title}`;
        headlines.setAttribute('href', `${articles[i].url}`);
        headlines.setAttribute('title', 'Go to article');
        topHeadlines.appendChild(headlines);
        let hr = document.createElement('hr');
        headlines.appendChild(hr);
    }
}

// declare function displaySections() that accepts one parameter, section (that was selected from the menu)
function displaySections(section) {
    // store the url in a variable. This url pulls the articles from the selected section
    const url2 = `https://api.nytimes.com/svc/news/v3/content/all/${section}.json?api-key=${api_key}`;
    let heading = document.querySelector('.top-articles');
    section = section.charAt(0).toUpperCase() + section.slice(1);
    if (section === 'U.s') {
        section = 'U.S.';
    }
    heading.innerHTML = `<h2 class="custom-text">Latest ${section} News</h2>`;
    // call fetchApiData() function with the url2 as an argument
    fetchApiData(url2)
        .then(data => {
            console.log(data);
            let articles = data.results;
            output = '';
            // loop through the articles
            articles.forEach(article => {
                // skip the article that doesn't have a title, abstract, multimedia or multimedia is empty
                if (!article.title || !article.abstract || !article.multimedia || article.multimedia.length === 0) {
                    return;
                }
                // console.log('section article below');
                console.log(article);
                // format the date
                const publishedDate = new Date(article.published_date);
                const formattedDate = publishedDate.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                if (article.multimedia[2].caption === '' || !article.multimedia[2].caption) {
                    article.multimedia[2].caption = article.title;
                }
                const altText = truncateAltText(article.multimedia[2].caption, 25);
                // build the divs with individual articles data
                output += `
                <div class="col mb-3">
                    <div class="container">
                        <div class="row">
                            <div class="col-6">
                                <div>
                                    <a href=${article.url} title="Go to article"><img src="${article.multimedia[2].url}" alt="${altText}" class="img-fluid fixed-height-img image-filter"></a>     
                                </div>
                            </div>
                            <div class="col-6 d-flex flex-column justify-content-between">
                                <div>
                                    <a href="${article.url}" title ="Read more" class=""><h3 class="top-articles-heading">${article.title}</h3></a>
                                    <p class="top-articles-abstract">${article.abstract}</p>
                                </div>
                                <div>
                                    <p class="text-end section-articles-author mb-0">${article.byline}</p>
                                    <p class="text-end section-articles-date mb-0">${formattedDate}</p>                     
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    `;
            });
            // display the output
            document.querySelector('.output').innerHTML = output;
        })
        .catch(error => {
            console.log('Error fetching articles:', error);
        });
}




