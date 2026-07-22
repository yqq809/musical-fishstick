const CORRECT_PASSWORD = '20180906';

function initLockScreen() {
    const passwordInput = document.getElementById('password-input');
    const hintBtn = document.getElementById('hint-btn');
    const hintMessage = document.getElementById('hint-message');
    const unlockBtn = document.getElementById('unlock-btn');
    const systemTime = document.getElementById('system-time');
    const hintDots = document.querySelectorAll('.hint-dot');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        systemTime.textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);

    passwordInput.addEventListener('input', (e) => {
        const value = e.target.value;
        hintDots.forEach((dot, index) => {
            if (index < value.length) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    hintBtn.addEventListener('click', () => {
        hintMessage.classList.toggle('show');
    });

    unlockBtn.addEventListener('click', verifyPassword);

    function verifyPassword() {
        const input = passwordInput.value;
        if (input === CORRECT_PASSWORD) {
            unlockBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            unlockBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                window.location.href = 'gallery.html';
            }, 800);
        } else {
            passwordInput.parentElement.classList.add('error-shake');
            setTimeout(() => {
                passwordInput.parentElement.classList.remove('error-shake');
            }, 400);
            
            passwordInput.value = '';
            hintDots.forEach(dot => dot.classList.remove('active'));
        }
    }
}

let currentPhotoIndex = 0;
const photos = [
    '2/条鹅/1.png',
    '2/条鹅/2.png',
    '2/条鹅/3.png',
    '2/条鹅/4.png',
    '2/条鹅/5.png',
    '2/条鹅/6.png',
    '2/条鹅/7.png',
    '2/条鹅/8.png',
    '2/条鹅/9.png'
];

function changePhoto(direction) {
    const newIndex = currentPhotoIndex + direction;
    if (newIndex >= 0 && newIndex < photos.length) {
        currentPhotoIndex = newIndex;
        updatePhotoDisplay();
    }
}

function updatePhotoDisplay() {
    const photoImg = document.getElementById('current-photo');
    const prevBtn = document.getElementById('album-prev');
    const nextBtn = document.getElementById('album-next');
    const counter = document.getElementById('photo-counter');
    const progressFill = document.getElementById('progress-fill');
    const quizContainer = document.getElementById('quiz-container');
    
    photoImg.style.opacity = '0';
    setTimeout(() => {
        photoImg.src = photos[currentPhotoIndex];
        photoImg.style.opacity = '1';
    }, 150);
    
    prevBtn.disabled = currentPhotoIndex === 0;
    nextBtn.disabled = currentPhotoIndex === photos.length - 1;
    counter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    progressFill.style.width = `${((currentPhotoIndex + 1) / photos.length) * 100}%`;
    
    if (currentPhotoIndex === photos.length - 1) {
        setTimeout(() => {
            quizContainer.classList.add('show');
        }, 500);
    } else {
        quizContainer.classList.remove('show');
    }
}

function initGalleryPage() {
    updatePhotoDisplay();
    
    // 自动播放音乐
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.play().catch(e => {
            console.log('自动播放被阻止，需要用户交互');
        });
        const toggleBtn = document.getElementById('music-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '🔊 暂停音乐';
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changePhoto(-1);
        } else if (e.key === 'ArrowRight') {
            changePhoto(1);
        }
    });
}

function answerQuiz(choice) {
    document.querySelectorAll('.quiz-option').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.image-popup').forEach(el => el.classList.remove('show'));

    if (choice === 'A') {
        document.getElementById('option-a').classList.add('selected');
        document.getElementById('img-a').classList.add('show');
    } else if (choice === 'B') {
        document.getElementById('option-b').classList.add('selected');
        document.getElementById('img-b').classList.add('show');
    }
}

// ===== 音乐控制 =====
const audio = document.getElementById('bgm');
const toggleBtn = document.getElementById('music-toggle');

window.toggleMusic = function() {
    if (audio.paused) {
        audio.play().catch(e => {
            console.log('自动播放被阻止，需要用户交互');
        });
        toggleBtn.textContent = '🔊 暂停音乐';
    } else {
        audio.pause();
        toggleBtn.textContent = '🎵 播放音乐';
    }
}

function initPhotosPage() {
    // 自动播放音乐
    const bgm = document.getElementById('bgm');
    
    if (bgm) {
        // 自动播放音乐
        bgm.play().catch(e => {
            console.log('自动播放被阻止，需要用户交互');
        });
        
        const toggleBtn = document.getElementById('music-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '🔊 暂停音乐';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('lock-screen')) {
        initLockScreen();
    } else if (document.body.classList.contains('gallery-page')) {
        initGalleryPage();
    } else if (document.body.classList.contains('photos-page')) {
        initPhotosPage();
    }
});