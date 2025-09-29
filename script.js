// Website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Practice cards hover effect
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Feature blocks animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature blocks
    const featureBlocks = document.querySelectorAll('.feature-block');
    featureBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(30px)';
        block.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(block);
    });

    // Observe practice cards
    const practiceCardsToObserve = document.querySelectorAll('.practice-card');
    practiceCardsToObserve.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Mailing list form submission
    const mailingForm = document.querySelector('.mailing-form');
    if (mailingForm) {
        mailingForm.addEventListener('submit', function(e) {
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            
            if (!name || !email) {
                e.preventDefault();
                alert('Please fill in all fields.');
                return;
            }
            
            // Let the form submit naturally to Formspree
            const button = this.querySelector('button');
            button.textContent = 'Sending...';
            button.disabled = true;
        });
    }

    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const practiceGroupsSection = document.querySelector('.practice-groups');
            if (practiceGroupsSection) {
                practiceGroupsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add click effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Recruitment process timeline animation
    const processSteps = document.querySelectorAll('.process-step');
    const processObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    processSteps.forEach(step => {
        processObserver.observe(step);
    });

// Job Seekers & Employers Animation
const jobSeekersSection = document.querySelector('.job-seekers-employers');
if (jobSeekersSection) {
    const jobSeekersObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const columns = section.querySelectorAll('.column');
                const separator = section.querySelector('.vertical-separator');
                const gradientLines = section.querySelectorAll('.gradient-line');
                const buttons = section.querySelectorAll('.main-btn, .arrow-btn');
                
                // Animate columns sliding in from sides
                columns.forEach((column, index) => {
                    setTimeout(() => {
                        column.style.opacity = '1';
                        column.style.transform = 'translateX(0)';
                    }, index * 300);
                });
                
                // Animate separator growing from center
                setTimeout(() => {
                    separator.style.opacity = '1';
                    separator.style.transform = 'scaleY(1)';
                }, 600);
                
                // Animate gradient lines
                gradientLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.opacity = '1';
                        line.style.transform = 'scaleX(1)';
                    }, 900 + (index * 200));
                });
                
                // Animate buttons
                buttons.forEach((button, index) => {
                    setTimeout(() => {
                        button.style.opacity = '1';
                        button.style.transform = 'translateY(0)';
                    }, 1200 + (index * 100));
                });
            }
        });
    }, { threshold: 0.3 });

    // Set initial states for animation
    const columns = jobSeekersSection.querySelectorAll('.column');
    const separator = jobSeekersSection.querySelector('.vertical-separator');
    const gradientLines = jobSeekersSection.querySelectorAll('.gradient-line');
    const buttons = jobSeekersSection.querySelectorAll('.main-btn, .arrow-btn');
    
    // Set initial states
    columns.forEach((column, index) => {
        column.style.opacity = '0';
        column.style.transform = `translateX(${index === 0 ? '-50px' : '50px'})`;
        column.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    separator.style.opacity = '0';
    separator.style.transform = 'scaleY(0)';
    separator.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    separator.style.transformOrigin = 'center';
    
    gradientLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'scaleX(0)';
        line.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        line.style.transformOrigin = 'center';
    });
    
    buttons.forEach(button => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    jobSeekersObserver.observe(jobSeekersSection);
}

// RSS Feed Integration for Career Insights
function loadCareerRSS() {
    const careerArticlesContainer = document.getElementById('career-articles');
    if (!careerArticlesContainer) return;

    console.log('Loading RSS feed...');
    
    // Use a CORS proxy to fetch the RSS feed
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const rssUrl = 'https://jobacle.com/feed';
    
    fetch(proxyUrl + encodeURIComponent(rssUrl))
        .then(response => {
            console.log('Response received:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            console.log('Found items:', items.length);
            
            let articlesHTML = '';
            let count = 0;
            
            items.forEach(item => {
                if (count >= 3) return; // Limit to 3 articles
                
                const title = item.querySelector('title')?.textContent || 'Career Article';
                const link = item.querySelector('link')?.textContent || '#';
                const description = item.querySelector('description')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const category = item.querySelector('category')?.textContent || 'Career Advice';
                
                // Extract image from description if available
                const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
                const imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop';
                
                // Clean description text
                const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                
                // Format date
                const date = new Date(pubDate);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                articlesHTML += `
                    <article class="article-card">
                        <div class="article-image">
                            <img src="${imageUrl}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'">
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="category">${category}</span>
                                <span class="date">${formattedDate}</span>
                            </div>
                            <h3>${title}</h3>
                            <p>${cleanDescription}</p>
                            <a href="${link}" target="_blank" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                `;
                
                count++;
            });
            
            console.log('Generated HTML:', articlesHTML);
            careerArticlesContainer.innerHTML = articlesHTML;
        })
        .catch(error => {
            console.error('Error loading RSS feed:', error);
            // Fallback to static content
            careerArticlesContainer.innerHTML = `
                <article class="article-card">
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop" alt="Career Development">
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="category">Career Development</span>
                            <span class="date">December 15, 2024</span>
                        </div>
                        <h3>5 Essential Skills for Career Advancement in 2025</h3>
                        <p>Discover the key competencies that will set you apart in today's competitive job market and help you advance your career.</p>
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
                <article class="article-card">
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop" alt="Interview Tips">
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="category">Interview Tips</span>
                            <span class="date">December 12, 2024</span>
                        </div>
                        <h3>Mastering Virtual Interviews: A Complete Guide</h3>
                        <p>Learn how to excel in remote interviews with our comprehensive guide to virtual interview best practices.</p>
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
                <article class="article-card">
                    <div class="article-image">
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop" alt="Networking">
                    </div>
                    <div class="article-content">
                        <div class="article-meta">
                            <span class="category">Networking</span>
                            <span class="date">December 10, 2024</span>
                        </div>
                        <h3>Building Your Professional Network: Strategies That Work</h3>
                        <p>Effective networking strategies to expand your professional connections and unlock new opportunities.</p>
                        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `;
        });
}

// Employment News Static Content
function loadEmploymentRSS() {
    console.log('loadEmploymentRSS function called');
    const employmentArticlesContainer = document.getElementById('employment-articles');
    console.log('employmentArticlesContainer:', employmentArticlesContainer);
    
    if (!employmentArticlesContainer) {
        console.error('employment-articles container not found');
        return;
    }

    console.log('Loading employment news static content...');
    
    // Use static content for reliable display
    const content = `
        <article class="article-card">
            <div class="article-image">
                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop" alt="Employment Trends">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="category">Employment Trends</span>
                    <span class="date">December 15, 2024</span>
                </div>
                <h3>2025 Employment Outlook: Key Trends to Watch</h3>
                <p>Analysis of emerging employment trends, including remote work evolution, AI integration in hiring, and changing workforce demographics.</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="article-card">
            <div class="article-image">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop" alt="Job Market">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="category">Job Market</span>
                    <span class="date">December 12, 2024</span>
                </div>
                <h3>Tech Sector Hiring: Q4 2024 Analysis</h3>
                <p>Comprehensive review of technology industry hiring patterns, salary trends, and in-demand skills for the final quarter of 2024.</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
        <article class="article-card">
            <div class="article-image">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop" alt="Workforce Development">
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="category">Workforce Development</span>
                    <span class="date">December 10, 2024</span>
                </div>
                <h3>Skills Gap Analysis: Addressing Workforce Challenges</h3>
                <p>Examining the skills gap in today's labor market and strategies for workforce development and employee training programs.</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;
    
    employmentArticlesContainer.innerHTML = content;
    console.log('Employment news static content loaded successfully');
}

// Load RSS feed when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    console.log('Current pathname:', window.location.pathname);
    
    // Only load RSS on the industry news page
    if (window.location.pathname.includes('industry-news.html')) {
        console.log('Loading RSS feeds for industry news page');
        
        // Add a small delay to ensure DOM is fully ready
        setTimeout(function() {
            console.log('Starting content loading...');
            loadCareerRSS();
            loadEmploymentRSS();
        }, 100);
    } else {
        console.log('Not on industry news page, skipping RSS loading');
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
