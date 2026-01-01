// Configuration
const BIRTHDAY_CONFIG = {
    name: "Ishrat Jahan Aurpy",
    birthMonth: 0, // July (0-indexed: 0 = January, 11 = December)
    birthDay: 11,
    birthYear: 2003,
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeBirthday();
    initializeBirthdayAnimations();
    initializeSlideshow();
    initializeLogout();
    initializeBackButton();
    initializeGiftBox();
    initializeCountdown();
    initializeFinalMessage();
    initializeMusicControls();
});

// Detect mobile device for optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowEndDevice = isMobile && (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2);

// Birthday Date & Age Calculation
function initializeBirthday() {
    const currentYear = new Date().getFullYear();
    const birthDate = new Date(currentYear, BIRTHDAY_CONFIG.birthMonth, BIRTHDAY_CONFIG.birthDay);
    const age = currentYear - BIRTHDAY_CONFIG.birthYear;                 
    
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = birthDate.toLocaleDateString('en-US', options);
    
    document.getElementById('birthdayDate').textContent = formattedDate;
    document.getElementById('ageDisplay').textContent = `Celebrating ${age} Amazing Years! 🎈`;
    
    // Card reveal functionality
    const revealButton = document.getElementById('revealButton');
    const cardFront = document.getElementById('cardFront');
    const cardInside = document.getElementById('cardInside');
    const closeButton = document.getElementById('closeButton');
    
    revealButton.addEventListener('click', () => {
        cardFront.style.display = 'none';
        cardInside.classList.remove('hidden');
        cardInside.style.display = 'block';
        triggerCelebration();
    });
    
    closeButton.addEventListener('click', () => {
        cardInside.classList.add('hidden');
        cardInside.style.display = 'none';
        cardFront.style.display = 'flex';
        cardFront.classList.remove('hidden');
    });
}

// Birthday Animations
function initializeBirthdayAnimations() {
    createConfetti();
    createBalloons();
    
    // Continuously generate new confetti and balloons
    setInterval(() => {
        createConfetti();
    }, 2000);
    
    setInterval(() => {
        createBalloons();
    }, 3000);
}

// Enhanced Confetti Animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;
    
    const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#feca57', '#48dbfb', '#ff6b6b', '#4ecdc4', '#95e1d3', '#a8edea'];
    const shapes = ['square', 'circle', 'triangle'];
    
    // Optimize count based on device
    const count = isLowEndDevice ? 15 : (isMobile ? 30 : 50);
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.className = `confetti shape-${shape}`;
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = color;
        confetti.style.borderBottomColor = color;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        confetti.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
        
        fragment.appendChild(confetti);
    }
    
    confettiContainer.appendChild(fragment);
    
    // Clean up old confetti after animation
    setTimeout(() => {
        const oldConfetti = confettiContainer.querySelectorAll('.confetti');
        if (oldConfetti.length > count * 3) {
            Array.from(oldConfetti).slice(0, count).forEach(el => el.remove());
        }
    }, 5000);
}

// Floating Balloons Animation
function createBalloons() {
    const balloonsContainer = document.getElementById('balloons');
    if (!balloonsContainer) return;
    
    const colors = ['red', 'blue', 'green', 'purple', 'pink', 'yellow'];
    
    // Optimize count based on device
    const count = isLowEndDevice ? 2 : (isMobile ? 4 : 6);
    
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        balloon.className = `balloon ${color}`;
        balloon.style.left = Math.random() * 100 + '%';
        balloon.style.animationDelay = Math.random() * 3 + 's';
        balloon.style.animationDuration = (12 + Math.random() * 6) + 's';
        balloon.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
        
        const balloonBody = document.createElement('div');
        balloonBody.className = 'balloon-body';
        balloon.appendChild(balloonBody);
        
        fragment.appendChild(balloon);
    }
    
    balloonsContainer.appendChild(fragment);
    
    // Clean up old balloons after animation
    setTimeout(() => {
        const oldBalloons = balloonsContainer.querySelectorAll('.balloon');
        if (oldBalloons.length > count * 3) {
            Array.from(oldBalloons).slice(0, count).forEach(el => el.remove());
        }
    }, 18000);
}

function triggerCelebration() {
    // Create burst of confetti and balloons
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createConfetti();
            createBalloons();
        }, i * 200);
    }
}

// Slideshow functionality
let currentSlide = 0;
let slideshowInterval = null;
let isTransitioning = false;

function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicatorsContainer = document.getElementById('indicators');
    
    // Set initial slide position
    slides[0].classList.add('active');
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(index);
                resetAutoPlay();
            }
        });
        indicatorsContainer.appendChild(indicator);
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        if (!isTransitioning) {
            goToSlide(currentSlide - 1, 'prev');
            resetAutoPlay();
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', () => {
        if (!isTransitioning) {
            goToSlide(currentSlide + 1, 'next');
            resetAutoPlay();
        }
    });
    
    // Start auto-play
    startAutoPlay();
}

function goToSlide(index, direction = 'next') {
    if (isTransitioning) return;
    
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevSlideIndex = currentSlide;
    
    // Calculate new slide index
    if (index >= slides.length) {
        currentSlide = 0;
        direction = 'next';
    } else if (index < 0) {
        currentSlide = slides.length - 1;
        direction = 'prev';
    } else {
        currentSlide = index;
        // Determine direction based on index change
        if (index > prevSlideIndex || (prevSlideIndex === slides.length - 1 && index === 0)) {
            direction = 'next';
        } else {
            direction = 'prev';
        }
    }
    
    if (prevSlideIndex === currentSlide) {
        return; // Same slide, no transition needed
    }
    
    isTransitioning = true;
    
    // Get current active slide and new slide
    const prevSlide = slides[prevSlideIndex];
    const newSlide = slides[currentSlide];
    
    // Remove active class from previous slide and add prev class to make it slide left
    prevSlide.classList.remove('active');
    if (direction === 'next') {
        prevSlide.classList.add('prev'); // Current slide goes left
    }
    
    // Add active class to new slide (it will slide in from right)
    newSlide.classList.remove('prev');
    newSlide.classList.add('active');
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        if (i === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
        // Clean up classes
        prevSlide.classList.remove('prev');
    }, 700);
}

function startAutoPlay() {
    slideshowInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 4000); // Change slide every 4 seconds
}

function resetAutoPlay() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    startAutoPlay();
}

// Logout functionality
function initializeLogout() {
    const logoutButton = document.getElementById('logoutButton');
    const logoutButtonSmall = document.getElementById('logoutButtonSmall');
    
    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'login.html';
        }
    };
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    if (logoutButtonSmall) {
        logoutButtonSmall.addEventListener('click', handleLogout);
    }
}

// Back Button Functionality
function initializeBackButton() {
    const backButton = document.getElementById('backButton');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Check if there's history to go back to
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
}

// Gift Box Functionality
function initializeGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const giftContent = document.getElementById('giftContent');
    const giftInstruction = document.querySelector('.gift-instruction');
    const openFinalMessageBtn = document.getElementById('openFinalMessageBtn');
    
    if (!giftBox || !giftContent) return;
    
    let isOpened = false;
    
    giftBox.addEventListener('click', () => {
        if (isOpened) return;
        
        isOpened = true;
        giftBox.classList.add('opened');
        
        // Hide instruction
        if (giftInstruction) {
            giftInstruction.style.opacity = '0';
            setTimeout(() => {
                giftInstruction.style.display = 'none';
            }, 300);
        }
        
        // Show content with delay
        setTimeout(() => {
            giftContent.classList.remove('hidden');
            triggerCelebration(); // Trigger confetti and balloons
        }, 500);
    });
    
    // Open final message button
    if (openFinalMessageBtn) {
        openFinalMessageBtn.addEventListener('click', () => {
            openFinalMessage();
        });
    }
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Final Message Section with Fireworks
function initializeFinalMessage() {
    const closeFinalMessageBtn = document.getElementById('closeFinalMessageBtn');
    const addFinalVideoButton = document.getElementById('addFinalVideoButton');
    const removeFinalVideoButton = document.getElementById('removeFinalVideoButton');
    const finalVideoUrl = document.getElementById('finalVideoUrl');
    const finalVideoDisplay = document.getElementById('finalVideoDisplay');
    
    // Close button
    if (closeFinalMessageBtn) {
        closeFinalMessageBtn.addEventListener('click', () => {
            closeFinalMessage();
        });
    }
    
    // Close on overlay click (outside content)
    const finalMessageOverlay = document.getElementById('finalMessageOverlay');
    if (finalMessageOverlay) {
        finalMessageOverlay.addEventListener('click', (e) => {
            if (e.target === finalMessageOverlay) {
                closeFinalMessage();
            }
        });
    }
    
    // Add video functionality
    if (addFinalVideoButton && finalVideoUrl && finalVideoDisplay) {
        addFinalVideoButton.addEventListener('click', () => {
            const url = finalVideoUrl.value.trim();
            if (!url) {
                alert('Please enter a YouTube URL');
                return;
            }
            
            // Extract YouTube video ID
            const videoId = extractYouTubeId(url);
            if (!videoId) {
                alert('Invalid YouTube URL. Please use a valid YouTube link.');
                return;
            }
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            finalVideoDisplay.innerHTML = '';
            finalVideoDisplay.appendChild(iframe);
            
            // Show remove button
            if (removeFinalVideoButton) {
                removeFinalVideoButton.classList.remove('hidden');
            }
            
            finalVideoUrl.value = '';
        });
    }
    
    // Remove video functionality
    if (removeFinalVideoButton && finalVideoDisplay) {
        removeFinalVideoButton.addEventListener('click', () => {
            finalVideoDisplay.innerHTML = '<p class="video-placeholder">No video added yet. Add a special video above!</p>';
            if (removeFinalVideoButton) {
                removeFinalVideoButton.classList.add('hidden');
            }
            if (finalVideoUrl) {
                finalVideoUrl.value = '';
            }
        });
    }
}

function openFinalMessage() {
    const finalMessageOverlay = document.getElementById('finalMessageOverlay');
    if (!finalMessageOverlay) return;
    
    finalMessageOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Start fireworks animation
    startFireworks();
}

function closeFinalMessage() {
    const finalMessageOverlay = document.getElementById('finalMessageOverlay');
    if (!finalMessageOverlay) return;
    
    finalMessageOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Stop fireworks
    const fireworksContainer = document.getElementById('fireworks');
    if (fireworksContainer) {
        fireworksContainer.innerHTML = '';
    }
}

function startFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    if (!fireworksContainer) return;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#95e1d3', '#f38181', '#aa96da'];
    
    function createFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        fireworksContainer.appendChild(firework);
        
        // Create particles
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = 100 + Math.random() * 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                fireworksContainer.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }, 50);
        }
        
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }
    
    // Create fireworks at random positions
    function launchFirework() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.5) + 50; // Upper half of screen
        createFirework(x, y);
    }
    
    // Launch initial fireworks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => launchFirework(), i * 200);
    }
    
    // Continue launching fireworks periodically
    const fireworkInterval = setInterval(() => {
        if (!document.getElementById('finalMessageOverlay') || 
            document.getElementById('finalMessageOverlay').classList.contains('hidden')) {
            clearInterval(fireworkInterval);
            return;
        }
        launchFirework();
    }, 800);
}

// Countdown Timer Configuration
// Set the target date for countdown (configurable)
const COUNTDOWN_TARGET_DATE = new Date(
    new Date().getFullYear(),
    BIRTHDAY_CONFIG.birthMonth,
    BIRTHDAY_CONFIG.birthDay
);

// If birthday has passed this year, set target to next year
if (COUNTDOWN_TARGET_DATE < new Date()) {
    COUNTDOWN_TARGET_DATE.setFullYear(COUNTDOWN_TARGET_DATE.getFullYear() + 1);
}

// Countdown Timer - Flip Clock Style
function initializeCountdown() {
    const daysCard = document.getElementById('daysCard');
    const hoursCard = document.getElementById('hoursCard');
    const minutesCard = document.getElementById('minutesCard');
    const secondsCard = document.getElementById('secondsCard');
    
    if (!daysCard || !hoursCard || !minutesCard || !secondsCard) return;
    
    let currentValues = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    
    let celebrationSoundPlayed = false;
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = COUNTDOWN_TARGET_DATE - now;
        
        if (timeLeft <= 0) {
            // Birthday has arrived!
            updateFlipCard(daysCard, 0, currentValues.days);
            updateFlipCard(hoursCard, 0, currentValues.hours);
            updateFlipCard(minutesCard, 0, currentValues.minutes);
            updateFlipCard(secondsCard, 0, currentValues.seconds);
            
            // Play celebration sound when countdown reaches zero (only once)
            if (!celebrationSoundPlayed) {
                playCelebrationSound();
                celebrationSoundPlayed = true;
            }
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update only if value changed
        if (days !== currentValues.days) {
            updateFlipCard(daysCard, days, currentValues.days);
            currentValues.days = days;
        }
        
        if (hours !== currentValues.hours) {
            updateFlipCard(hoursCard, hours, currentValues.hours);
            currentValues.hours = hours;
        }
        
        if (minutes !== currentValues.minutes) {
            updateFlipCard(minutesCard, minutes, currentValues.minutes);
            currentValues.minutes = minutes;
        }
        
        // Always update seconds (they change every second)
        if (seconds !== currentValues.seconds) {
            updateFlipCard(secondsCard, seconds, currentValues.seconds);
            currentValues.seconds = seconds;
        }
    }
    
    function updateFlipCard(card, newValue, oldValue) {
        if (newValue === oldValue && oldValue !== undefined) return;
        
        const formattedValue = String(newValue).padStart(2, '0');
        const formattedOldValue = oldValue !== undefined ? String(oldValue).padStart(2, '0') : '00';
        
        const frontTop = card.querySelector('.flip-card-front .flip-card-top');
        const frontBottom = card.querySelector('.flip-card-front .flip-card-bottom');
        const backTop = card.querySelector('.flip-card-back .flip-card-top');
        const backBottom = card.querySelector('.flip-card-back .flip-card-bottom');
        
        // Set current value on front (visible)
        frontTop.textContent = formattedOldValue;
        frontBottom.textContent = formattedOldValue;
        
        // Set new value on back (will be revealed after flip)
        backTop.textContent = formattedValue;
        backBottom.textContent = formattedValue;
        
        // Trigger flip animation
        card.classList.add('flipping');
        
        // After animation completes, update front card and remove flip class
        setTimeout(() => {
            frontTop.textContent = formattedValue;
            frontBottom.textContent = formattedValue;
            card.classList.remove('flipping');
        }, 600);
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Music Controls Functionality
function initializeMusicControls() {
    const playMusicBtn = document.getElementById('playMusicBtn');
    const floatingMusicControl = document.getElementById('floatingMusicControl');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const celebrationSound = document.getElementById('celebrationSound');
    
    // Background music should be available on all pages
    if (!backgroundMusic) return;
    
    // Music controls only exist on index.html
    const hasControls = playMusicBtn && floatingMusicControl && musicToggleBtn;
    
    let isPlaying = false;
    let hasStarted = false;
    
    // Check if music was playing from previous page
    const savedMusicState = localStorage.getItem('birthdayMusicPlaying');
    const savedVolume = localStorage.getItem('birthdayMusicVolume');
    const savedHasStarted = localStorage.getItem('birthdayMusicStarted');
    
    // Set initial volume
    if (volumeSlider && backgroundMusic) {
        const initialVolume = savedVolume ? parseFloat(savedVolume) : volumeSlider.value / 100;
        backgroundMusic.volume = initialVolume;
        volumeSlider.value = initialVolume * 100;
        if (celebrationSound) {
            celebrationSound.volume = 0.7; // Celebration sound at 70% volume
        }
    } else if (backgroundMusic) {
        const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.7;
        backgroundMusic.volume = initialVolume;
    }
    
    // Resume music if it was playing
    if (savedMusicState === 'true' && savedHasStarted === 'true') {
        hasStarted = true;
        if (hasControls) {
            if (playMusicBtn) playMusicBtn.classList.add('hidden');
            if (floatingMusicControl) floatingMusicControl.classList.remove('hidden');
        }
        
        // Try to resume playback (may require user interaction on some browsers)
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    if (hasControls) updatePlayPauseIcon();
                })
                .catch(error => {
                    console.warn('Could not auto-resume music:', error);
                    // Music will need to be manually started again
                    isPlaying = false;
                    if (hasControls) updatePlayPauseIcon();
                });
        }
    }
    
    // Play Music Button - Initial Start
    if (playMusicBtn) {
        playMusicBtn.addEventListener('click', () => {
            if (!hasStarted) {
                // User interaction required for autoplay policy
                startBackgroundMusic();
                hasStarted = true;
                playMusicBtn.classList.add('hidden');
                floatingMusicControl.classList.remove('hidden');
                saveMusicState();
            }
        });
    }
    
    // Toggle Play/Pause
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            if (!hasStarted) {
                startBackgroundMusic();
                hasStarted = true;
                if (playMusicBtn) playMusicBtn.classList.add('hidden');
                if (floatingMusicControl) floatingMusicControl.classList.remove('hidden');
                saveMusicState();
            } else {
                toggleMusic();
            }
        });
    }
    
    // Volume Control
    if (volumeSlider && backgroundMusic) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            backgroundMusic.volume = volume;
            localStorage.setItem('birthdayMusicVolume', volume.toString());
            
            // Update volume icon
            const volumeIcon = volumeSlider.nextElementSibling;
            if (volumeIcon) {
                if (volume === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (volume < 0.5) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
        });
    }
    
    // Handle audio errors (e.g., file not found)
    backgroundMusic.addEventListener('error', () => {
        console.warn('Background music file not found. Please add your audio file to the audio element.');
        // Show a helpful message to the user
        if (floatingMusicControl) {
            const musicTitle = floatingMusicControl.querySelector('.music-title');
            if (musicTitle) {
                musicTitle.textContent = 'Add audio file to play';
                musicTitle.style.color = '#999';
            }
        }
    });
    
    if (celebrationSound) {
        celebrationSound.addEventListener('error', () => {
            console.warn('Celebration sound file not found. Please add your audio file to the audio element.');
        });
    }
    
    // Save music state to localStorage
    function saveMusicState() {
        localStorage.setItem('birthdayMusicPlaying', isPlaying.toString());
        localStorage.setItem('birthdayMusicStarted', hasStarted.toString());
        if (backgroundMusic) {
            localStorage.setItem('birthdayMusicVolume', backgroundMusic.volume.toString());
        }
    }
    
    // Update play/pause icon based on playing state
    function updatePlayPauseIcon() {
        if (!musicToggleBtn) return;
        const icon = musicToggleBtn.querySelector('.play-pause-icon');
        if (icon) {
            icon.textContent = isPlaying ? '⏸' : '▶';
        }
    }
    
    function startBackgroundMusic() {
        // Attempt to play - handle autoplay policy
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    if (hasControls) updatePlayPauseIcon();
                    saveMusicState();
                })
                .catch(error => {
                    console.warn('Autoplay prevented:', error);
                    // Show message to user
                    alert('Please click the play button to start the music. Some browsers require user interaction to play audio.');
                    isPlaying = false;
                    if (hasControls) updatePlayPauseIcon();
                    saveMusicState();
                });
        }
    }
    
    function toggleMusic() {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
        } else {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                    })
                    .catch(error => {
                        console.warn('Play failed:', error);
                        isPlaying = false;
                    });
            }
        }
        if (hasControls) updatePlayPauseIcon();
        saveMusicState();
    }
    
    // Pause music when user clicks/touches the page (but not on music controls)
    function handlePageClick(e) {
        // Don't pause if clicking on music controls or buttons
        const target = e.target;
        const isMusicControl = target.closest('.play-music-btn') || 
                              target.closest('.floating-music-control') ||
                              target.closest('.music-toggle-btn') ||
                              target.closest('#playMusicBtn') ||
                              target.closest('#musicToggleBtn') ||
                              target.closest('#volumeSlider') ||
                              target.closest('.back-btn') ||
                              target.closest('.logout-btn');
        
        if (!isMusicControl && isPlaying && hasStarted) {
            backgroundMusic.pause();
            isPlaying = false;
            if (hasControls) updatePlayPauseIcon();
            saveMusicState();
        }
    }
    
    // Add click/touch listeners to pause music (keep listeners active)
    document.addEventListener('click', handlePageClick, true);
    document.addEventListener('touchstart', handlePageClick, true);
    
    // Handle when audio ends (shouldn't happen with loop, but just in case)
    backgroundMusic.addEventListener('ended', () => {
        isPlaying = false;
        if (hasControls) updatePlayPauseIcon();
        saveMusicState();
    });
    
    // Handle when audio starts playing
    backgroundMusic.addEventListener('play', () => {
        isPlaying = true;
        if (hasControls) updatePlayPauseIcon();
        saveMusicState();
    });
    
    // Handle when audio pauses
    backgroundMusic.addEventListener('pause', () => {
        isPlaying = false;
        if (hasControls) updatePlayPauseIcon();
        saveMusicState();
    });
}

// Play celebration sound when countdown reaches zero
function playCelebrationSound() {
    const celebrationSound = document.getElementById('celebrationSound');
    if (!celebrationSound) return;
    
    // Reset and play
    celebrationSound.currentTime = 0;
    const playPromise = celebrationSound.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Celebration sound played!');
            })
            .catch(error => {
                console.warn('Could not play celebration sound:', error);
            });
    }
}





