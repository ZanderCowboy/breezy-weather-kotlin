// Progress tracking with localStorage persistence
let progress = 0;
let conceptsLearned = 0;
let codeExamples = 0;
let quizzesCompleted = 0;
let learningStreak = 1;
let chapterProgress = {};

// Load progress from localStorage on page load
function loadProgress() {
    const savedProgress = localStorage.getItem('kotlinCourseProgress');
    if (savedProgress) {
        try {
            const data = JSON.parse(savedProgress);
            conceptsLearned = data.conceptsLearned || 0;
            codeExamples = data.codeExamples || 0;
            quizzesCompleted = data.quizzesCompleted || 0;
            learningStreak = data.learningStreak || 1;
            chapterProgress = data.chapterProgress || {};

            // Update UI with loaded progress
            updateStats();
            updateAllChapterProgress();

            console.log('Progress loaded:', data);
        } catch (e) {
            console.error('Error loading progress:', e);
        }
    }
}

// Save progress to localStorage
function saveProgress() {
    const progressData = {
        conceptsLearned,
        codeExamples,
        quizzesCompleted,
        learningStreak,
        chapterProgress,
        lastUpdated: new Date().toISOString()
    };

    try {
        localStorage.setItem('kotlinCourseProgress', JSON.stringify(progressData));
        console.log('Progress saved:', progressData);
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

// Update chapter progress (called from individual chapter pages)
function updateChapterProgress(chapterNumber, sectionsCompleted, totalSections) {
    chapterProgress[`chapter${chapterNumber}`] = {
        sectionsCompleted,
        totalSections,
        completed: sectionsCompleted === totalSections,
        lastAccessed: new Date().toISOString()
    };
    saveProgress();
    updateAllChapterProgress();
}

// Update all chapter progress indicators on landing page
function updateAllChapterProgress() {
    for (let i = 1; i <= 6; i++) {
        const chapterData = chapterProgress[`chapter${i}`];
        if (chapterData) {
            updateChapterCard(i, chapterData);
        }
    }
}

function updateStats() {
    // Update stats display if elements exist
    const conceptsEl = document.getElementById('conceptsLearned');
    const codeEl = document.getElementById('codeExamples');
    const quizzesEl = document.getElementById('quizzesCompleted');
    const streakEl = document.getElementById('learningStreak');
    const progressFillEl = document.getElementById('progressFill');
    const progressTextEl = document.getElementById('progressText');

    if (conceptsEl) conceptsEl.textContent = conceptsLearned;
    if (codeEl) codeEl.textContent = codeExamples;
    if (quizzesEl) quizzesEl.textContent = quizzesCompleted;
    if (streakEl) streakEl.textContent = learningStreak;

    progress = ((conceptsLearned / 12 + quizzesCompleted / 6) / 2) * 100;
    if (progressFillEl) progressFillEl.style.width = progress + '%';
    if (progressTextEl) progressTextEl.textContent = Math.round(progress) + '% Complete';

    // Save progress after updating stats
    saveProgress();
}

function showAchievement(text) {
    const achievement = document.getElementById('achievement');
    document.getElementById('achievementText').textContent = text;
    achievement.classList.add('show');

    setTimeout(() => {
        achievement.classList.remove('show');
    }, 3000);
}

function learnConcept(concept) {
    conceptsLearned++;
    updateStats();

    const achievements = {
        'app-class': 'Android Application Master! 📱',
        'data-classes': 'Data Class Detective! 🕵️',
        'enums': 'Enum Expert! 📋',
        'extensions': 'Extension Function Wizard! 🪄',
        'interfaces': 'Interface Architect! 🏗️',
        'advanced': 'Kotlin Ninja! 🥷'
    };

    showAchievement(achievements[concept] || 'Concept Mastered!');
    saveProgress(); // Save after learning concept
}

function exploreFile(fileType) {
    const messages = {
        'weather-models': 'Great choice! Explore the weather models to see more data classes in action! 🌦️',
        'extensions': 'Awesome! Extension functions are Kotlin\'s superpower! 🚀',
        'ui-components': 'Perfect! See how Android UI components use Kotlin features! 📱',
        'sources': 'Excellent! Check how different APIs are integrated with Kotlin! 🔗'
    };

    showAchievement(messages[fileType] || 'Happy exploring! 🎯');
}

function switchTab(tabId) {
    // Hide all tab contents in the same container
    const tabContainer = event.target.closest('.tab-container');
    tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons in the same container
    tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    if (tabId.includes('code')) {
        codeExamples++;
        updateStats();
    }
}

function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '✅ Copied!';
        setTimeout(() => {
            button.innerHTML = '📋 Copy';
        }, 2000);
    });
}

function nextChapter() {
    window.scrollTo({
        top: document.querySelector('.learning-section:nth-of-type(3)').offsetTop,
        behavior: 'smooth'
    });
}

// Drag and Drop Quiz
let draggedElement = null;

document.addEventListener('DOMContentLoaded', function () {
    // Load saved progress first
    loadProgress();

    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    dragItems.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedElement = this;
            this.style.opacity = '0.5';
        });

        item.addEventListener('dragend', function (e) {
            this.style.opacity = '1';
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        zone.addEventListener('dragleave', function (e) {
            this.classList.remove('dragover');
        });

        zone.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            if (draggedElement) {
                this.appendChild(draggedElement);
                draggedElement = null;
            }
        });
    });
});

function checkQuizAnswers(quizNumber) {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    let total = 0;

    dropZones.forEach(zone => {
        const expectedAnswer = zone.dataset.answer;
        const draggedItem = zone.querySelector('.drag-item');

        if (draggedItem) {
            total++;
            const actualAnswer = draggedItem.dataset.concept;

            if (expectedAnswer === actualAnswer) {
                correct++;
                zone.style.backgroundColor = 'rgba(72, 187, 120, 0.3)';
                zone.style.borderColor = '#48bb78';
            } else {
                zone.style.backgroundColor = 'rgba(245, 101, 101, 0.3)';
                zone.style.borderColor = '#f56565';
            }
        }
    });

    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const resultDiv = document.getElementById(`quizResult${quizNumber}`);

    if (percentage === 100) {
        resultDiv.innerHTML = `
            <div style="background: #48bb78; color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <h3>🎉 Perfect Score! ${correct}/${total} correct!</h3>
                <p>You're becoming a Kotlin master! 🚀</p>
            </div>
        `;
        quizzesCompleted++;
        updateStats();
        showAchievement('Quiz Master! 🧠');
        saveProgress(); // Save after completing quiz
    } else {
        resultDiv.innerHTML = `
            <div style="background: #f56565; color: white; padding: 15px; border-radius: 10px; margin-top: 15px;">
                <h3>Good try! ${correct}/${total} correct (${percentage}%)</h3>
                <p>Review the concepts and try again! 💪</p>
            </div>
        `;
    }
}

function completeLesson() {
    conceptsLearned = 12;
    learningStreak++;
    updateStats();
    showAchievement('Kotlin Crash Course Complete! You\'re ready for Android development! 🎓');

    // Confetti effect
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 100);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';

    document.body.appendChild(confetti);

    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-out'
    });

    animation.onfinish = () => confetti.remove();
}

// Add chapter card update function for landing page
function updateChapterCard(chapterNumber, chapterData) {
    const chapterCards = document.querySelectorAll('.chapter-card');
    const chapterCard = chapterCards[chapterNumber - 1]; // 0-indexed

    if (chapterCard) {
        const progressFill = chapterCard.querySelector('.progress-fill-small');
        const progressText = chapterCard.querySelector('.chapter-progress span');

        if (progressFill && progressText) {
            const percentage = (chapterData.sectionsCompleted / chapterData.totalSections) * 100;
            progressFill.style.width = percentage + '%';
            progressText.textContent = `${chapterData.sectionsCompleted}/${chapterData.totalSections} sections`;

            // Add completed styling
            if (chapterData.completed) {
                chapterCard.classList.add('completed');
                const icon = chapterCard.querySelector('.chapter-icon i');
                if (icon && !icon.classList.contains('fa-check-circle')) {
                    icon.classList.add('fa-check-circle');
                    icon.style.color = '#48bb78';
                }
            }
        }
    }
}

// Progress reset function (for development/testing)
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('kotlinCourseProgress');
        location.reload();
    }
}

// Initialize the dashboard
updateStats(); 