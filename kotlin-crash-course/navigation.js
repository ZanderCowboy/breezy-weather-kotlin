// Navigation functions for multi-page Kotlin crash course

function navigateToChapter(chapterPage) {
    // Store current progress before navigation
    saveProgressToStorage();

    // Navigate to the chapter page
    window.location.href = chapterPage;
}

function navigateHome() {
    window.location.href = 'index.html';
}

function navigateBack() {
    window.history.back();
}

function saveProgressToStorage() {
    const progressData = {
        conceptsLearned: conceptsLearned || 0,
        codeExamples: codeExamples || 0,
        quizzesCompleted: quizzesCompleted || 0,
        learningStreak: learningStreak || 1,
        lastVisited: Date.now()
    };

    localStorage.setItem('kotlinCrashCourseProgress', JSON.stringify(progressData));
}

function loadProgressFromStorage() {
    const savedProgress = localStorage.getItem('kotlinCrashCourseProgress');
    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);

        // Update global variables
        conceptsLearned = progressData.conceptsLearned || 0;
        codeExamples = progressData.codeExamples || 0;
        quizzesCompleted = progressData.quizzesCompleted || 0;
        learningStreak = progressData.learningStreak || 1;

        // Update the dashboard if it exists
        if (typeof updateStats === 'function') {
            updateStats();
        }

        return progressData;
    }
    return null;
}

function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navbar.innerHTML = `
        <a href="index.html" class="nav-brand">
            <i class="fas fa-cloud-sun"></i> Kotlin Crash Course
        </a>
        <div class="nav-links">
            <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">
                <i class="fas fa-home"></i> Home
            </a>
            <a href="chapter1.html" class="nav-link ${currentPage === 'chapter1.html' ? 'active' : ''}">
                <i class="fas fa-mobile-alt"></i> App Classes
            </a>
            <a href="chapter2.html" class="nav-link ${currentPage === 'chapter2.html' ? 'active' : ''}">
                <i class="fas fa-database"></i> Data Classes
            </a>
            <a href="chapter3.html" class="nav-link ${currentPage === 'chapter3.html' ? 'active' : ''}">
                <i class="fas fa-list-alt"></i> Enums
            </a>
            <a href="chapter4.html" class="nav-link ${currentPage === 'chapter4.html' ? 'active' : ''}">
                <i class="fas fa-magic"></i> Extensions
            </a>
            <a href="chapter5.html" class="nav-link ${currentPage === 'chapter5.html' ? 'active' : ''}">
                <i class="fas fa-cogs"></i> Interfaces
            </a>
            <a href="chapter6.html" class="nav-link ${currentPage === 'chapter6.html' ? 'active' : ''}">
                <i class="fas fa-rocket"></i> Advanced
            </a>
            <a href="quiz.html" class="nav-link ${currentPage === 'quiz.html' ? 'active' : ''}">
                <i class="fas fa-brain"></i> Quiz
            </a>
        </div>
    `;

    // Insert navbar at the beginning of the container
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(navbar, container.firstChild);
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function () {
    // Only add navbar if not on index page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage !== 'index.html') {
        createNavbar();
    }

    // Load progress from storage
    loadProgressFromStorage();

    // Save progress when leaving page
    window.addEventListener('beforeunload', saveProgressToStorage);
});

// Update chapter progress on individual pages
function updateChapterProgress(chapterNumber, sectionsCompleted, totalSections) {
    const progressData = loadProgressFromStorage() || {};

    if (!progressData.chapterProgress) {
        progressData.chapterProgress = {};
    }

    progressData.chapterProgress[`chapter${chapterNumber}`] = {
        sectionsCompleted,
        totalSections,
        percentage: Math.round((sectionsCompleted / totalSections) * 100)
    };

    localStorage.setItem('kotlinCrashCourseProgress', JSON.stringify(progressData));
} 