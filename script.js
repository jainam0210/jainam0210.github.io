document.addEventListener('DOMContentLoaded', function() {
    initImageHoverDetails();
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
    });
    
    initSectionObserver();
    
    document.addEventListener('click', function(event) {
        logEvent('click', event.target);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                logEvent('view', entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('section, img, a, button').forEach(element => {
        observer.observe(element);
    });

    function logEvent(eventType, element) {
        const timestamp = new Date().toISOString();
        let elementType = element.tagName.toLowerCase();
        
        if (element.id) {
            elementType += `#${element.id}`;
        } else if (element.className) {
            elementType += `.${element.className.split(' ')[0]}`;
        }
        
        if (element.tagName === 'IMG' && element.alt) {
            elementType += ` (${element.alt})`;
        }
        
        if (element.tagName === 'A' && element.href) {
            elementType += ` (${element.href})`;
        }
        
        console.log(`${timestamp}, ${eventType}, ${elementType}`);
    }

    function initSectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        document.querySelectorAll('.section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    function initImageHoverDetails() {
        const birthplaceImages = document.querySelectorAll('.birthplace-img');
        
        birthplaceImages.forEach(img => {
            const container = img.closest('.image-container');
            const detailsElement = container.querySelector('.image-details');
            const titleElement = detailsElement.querySelector('h4');
            const descriptionElement = detailsElement.querySelector('p');
            
            const title = img.getAttribute('data-title');
            const description = img.getAttribute('data-description');
            
            titleElement.textContent = title;
            descriptionElement.textContent = description;
        });
    }

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.classList.remove('visible');
                
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        targetElement.classList.add('visible');
                    }, 400);
                }, 10);
            }
        });
    });

    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeText);
    }

    function analyzeText() {
        const text = document.getElementById('text-input').value;
        
        displayBasicStats(text);
        
        countPronounsPrepositionsArticles(text);
        
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
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
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
            'beyond', 'by', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 
            'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past',
            'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards',
            'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];
        
        const indefiniteArticles = ['a', 'an'];
        
        const pronounCount = countOccurrences(words, pronouns);
        const prepositionCount = countOccurrences(words, prepositions);
        const articleCount = countOccurrences(words, indefiniteArticles);
        
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
            .sort((a, b) => b[1] - a[1])
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