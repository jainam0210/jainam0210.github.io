// Event tracking for Q2
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image hover details
    initImageHoverDetails();
    
    // Add fade-in class to all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
    });
    
    // Initialize section visibility detection
    initSectionObserver();
    
    // Track all click events
    document.addEventListener('click', function(event) {
        logEvent('click', event.target);
    });

    // Track page views for specific elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logEvent('view', entry.target);
            }
        });
    }, {
        threshold: 0.5 // Element is considered viewed when 50% visible
    });

    // Observe all sections and important elements
    document.querySelectorAll('section, img, a, button').forEach(element => {
        observer.observe(element);
    });

    // Function to log events to console
    function logEvent(eventType, element) {
        const timestamp = new Date().toISOString();
        let elementType = element.tagName.toLowerCase();
        
        // Add additional context based on element type
        if (element.id) {
            elementType += `#${element.id}`;
        } else if (element.className) {
            elementType += `.${element.className.split(' ')[0]}`;
        }
        
        // For images, add alt text
        if (element.tagName === 'IMG' && element.alt) {
            elementType += ` (${element.alt})`;
        }
        
        // For links, add href
        if (element.tagName === 'A' && element.href) {
            elementType += ` (${element.href})`;
        }
        
        console.log(`${timestamp}, ${eventType}, ${elementType}`);
    }

    // Function to initialize section visibility detection
    function initSectionObserver() {
        const options = {
            root: null, // use the viewport
            rootMargin: '0px',
            threshold: 0.15 // trigger when 15% of the element is visible
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to trigger animations
                    entry.target.classList.add('visible');
                    // Optionally remove observer after animation is triggered
                    // sectionObserver.unobserve(entry.target);
                } else {
                    // Optional: remove the visible class when section is not in view
                    // Uncomment this if you want animations to replay when scrolling back
                    // entry.target.classList.remove('visible');
                }
            });
        }, options);

        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Function to initialize the image hover details
    function initImageHoverDetails() {
        const birthplaceImages = document.querySelectorAll('.birthplace-img');
        
        birthplaceImages.forEach(img => {
            const container = img.closest('.image-container');
            const detailsElement = container.querySelector('.image-details');
            const titleElement = detailsElement.querySelector('h4');
            const descriptionElement = detailsElement.querySelector('p');
            
            // Get the data attributes from the image
            const title = img.getAttribute('data-title');
            const description = img.getAttribute('data-description');
            
            // Set the content of the details elements
            titleElement.textContent = title;
            descriptionElement.textContent = description;
        });
    }

    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add animation class to highlight the section when navigating to it
                targetElement.classList.remove('visible');
                
                // Small delay to ensure the class removal is processed
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Account for header height
                        behavior: 'smooth'
                    });
                    
                    // Re-add the visible class after scrolling
                    setTimeout(() => {
                        targetElement.classList.add('visible');
                    }, 400);
                }, 10);
            }
        });
    });

    // Text analysis for Q3
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
    }

    function analyzeText() {
        const text = document.getElementById('text-input').value;
        
        // Task 1: Calculate and display basic stats
        displayBasicStats(text);
        
        // Task 2: Count pronouns
        countPronounsPrepositionsArticles(text);
        
        // Add animation class to analysis results
        document.querySelector('.analysis-results').classList.add('visible');
    }

    function displayBasicStats(text) {
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const words = countWords(text);
        const spaces = (text.match(/\s/g) || []).length;
        const newlines = (text.match(/\n/g) || []).length;
        const specialSymbols = (text.match(/[^\w\s]/g) || []).length;
        
        document.getElementById('letter-count').textContent = `Letters: ${letters}`;
        document.getElementById('word-count').textContent = `Words: ${words}`;
        document.getElementById('space-count').textContent = `Spaces: ${spaces}`;
        document.getElementById('newline-count').textContent = `Newlines: ${newlines}`;
        document.getElementById('special-symbol-count').textContent = `Special symbols: ${specialSymbols}`;
    }

    function countWords(text) {
        return text.trim().split(/\s+/).length;
    }

    function countPronounsPrepositionsArticles(text) {
        // Lowercase the text and tokenize
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Define lists of pronouns, prepositions, and indefinite articles
        const pronouns = [
            'i', 'me', 'my', 'mine', 'myself',
            'you', 'your', 'yours', 'yourself',
            'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself',
            'it', 'its', 'itself',
            'we', 'us', 'our', 'ours', 'ourselves',
            'they', 'them', 'their', 'theirs', 'themselves',
            'this', 'that', 'these', 'those',
            'who', 'whom', 'whose', 'which', 'what',
            'whoever', 'whomever', 'whatever', 'whichever'
        ];
        
        const prepositions = [
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among',
            'around', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
            'beyond', 'by', 'despite', 'down', 'during', 
            'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of',
            'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
            'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const indefiniteArticles = ['a', 'an'];
        
        // Count occurrences
        const pronounCount = countOccurrences(words, pronouns);
        const prepositionCount = countOccurrences(words, prepositions);
        const articleCount = countOccurrences(words, indefiniteArticles);
        
        // Display results
        displayCounts('pronouns-list', pronounCount);
        displayCounts('prepositions-list', prepositionCount);
        displayCounts('articles-list', articleCount);
    }

    function countOccurrences(words, targetWords) {
        const counts = {};
        
        targetWords.forEach(word => {
            counts[word] = 0;
        });
        
        words.forEach(word => {
            if (targetWords.includes(word)) {
                counts[word]++;
            }
        });
        
        // Filter out words with zero occurrences
        return Object.fromEntries(
            Object.entries(counts).filter(([_, count]) => count > 0)
        );
    }

    function displayCounts(elementId, counts) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        
        if (Object.keys(counts).length === 0) {
            container.textContent = 'None found';
            return;
        }
        
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Word</th>
                <th>Count</th>
            </tr>
        `;
        
        Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
            .forEach(([word, count]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${word}</td>
                    <td>${count}</td>
                `;
                table.appendChild(row);
            });
        
        container.appendChild(table);
    }
});