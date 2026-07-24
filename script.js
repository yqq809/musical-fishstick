const CORRECT_PASSWORD = '20180906';

// 人物图像鼠标跟随效果
function initCharacterMouseFollow() {
    const characterInner = document.getElementById('character-inner');
    if (!characterInner) return;

    let animationFrameId = null;
    let targetRotateX = 0;
    let targetRotateY = 0;

    function updateTransform() {
        characterInner.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
        animationFrameId = null;
    }

    document.addEventListener('mousemove', (e) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 计算鼠标相对于屏幕中心的位置
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;
        
        const deltaX = (e.clientX - centerX) / centerX;
        const deltaY = (e.clientY - centerY) / centerY;
        
        // 计算旋转角度（限制在一定范围内）
        targetRotateY = deltaX * 10; // 左右旋转
        targetRotateX = -deltaY * 10; // 上下旋转
        
        // 使用requestAnimationFrame节流
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateTransform);
        }
    });

    // 鼠标离开时恢复原位
    document.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateTransform);
        }
    });
}

function initLockScreen() {
    const passwordInput = document.getElementById('password-input');
    const hintBtn = document.getElementById('hint-btn');
    const hintMessage = document.getElementById('hint-message');
    const unlockBtn = document.getElementById('unlock-btn');
    const systemTime = document.getElementById('system-time');
    const hintDots = document.querySelectorAll('.hint-dot');
    
    // 初始化人物鼠标跟随
    initCharacterMouseFollow();

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
    
    // 旧照片淡出 + 微微缩小
    photoImg.classList.add('fade-out');
    
    setTimeout(() => {
        photoImg.src = photos[currentPhotoIndex];
        // 新照片从下方8px滑入
        photoImg.classList.remove('fade-out');
        photoImg.classList.add('enter-from-bottom');
        
        setTimeout(() => {
            photoImg.classList.remove('enter-from-bottom');
            photoImg.classList.add('fade-in');
        }, 50);
    }, 300);
    
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

// 视频URL列表
const videoUrls = [
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4',
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4',
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4'
];

// 预加载视频为blob
async function preloadVideos() {
    const promises = videoUrls.map(async (url, index) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const video = document.getElementById(`video-${index}`);
            if (video) {
                video.src = objectUrl;
            }
        } catch (error) {
            console.log(`视频 ${index} 预加载失败，使用原始URL`, error);
        }
    });
    
    await Promise.all(promises);
}

// 视频切换逻辑
let currentVideoIndex = 0;

function startVideoSwitching() {
    // 每8秒切换一次视频
    setInterval(() => {
        const videos = document.querySelectorAll('.photos-video');
        videos[currentVideoIndex].classList.remove('active');
        
        currentVideoIndex = (currentVideoIndex + 1) % videoUrls.length;
        videos[currentVideoIndex].classList.add('active');
    }, 8000);
}

function initPhotosPage() {
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

    // 预加载视频
    preloadVideos();
    
    // 启动视频切换
    startVideoSwitching();

    // 初始化粒子效果
    initParticles();

    // 照片顺序出现动画
    animatePhotosInOrder();

    // 照片6点击事件
    initPhoto6Click();
}

// 粒子效果
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置和动画参数
        const left = Math.random() * 100;
        const duration = 8 + Math.random() * 12; // 8-20秒
        const delay = Math.random() * 10;
        const drift = (Math.random() - 0.5) * 200;
        
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.setProperty('--drift', `${drift}px`);
        
        // 随机大小
        const size = 2 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        container.appendChild(particle);
    }
}

// 照片顺序出现
function animatePhotosInOrder() {
    const photoItems = document.querySelectorAll('.photo-item');
    let delay = 500; // 第一张照片延迟0.5秒出现
    
    photoItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('appear');
            
            // 动画结束后添加静态类，确保hover效果正常
            setTimeout(() => {
                item.classList.remove('appear');
                item.classList.add('animation-done');
                
                // 根据旋转类设置最终transform
                if (item.classList.contains('rotate-1')) {
                    item.style.transform = 'rotate(-12deg)';
                } else if (item.classList.contains('rotate-2')) {
                    item.style.transform = 'rotate(8deg)';
                } else if (item.classList.contains('rotate-3')) {
                    item.style.transform = 'rotate(-15deg)';
                } else if (item.classList.contains('rotate-4')) {
                    item.style.transform = 'rotate(10deg)';
                } else if (item.classList.contains('rotate-5')) {
                    item.style.transform = 'rotate(-8deg)';
                } else if (item.classList.contains('rotate-6')) {
                    item.style.transform = 'rotate(12deg)';
                } else if (item.classList.contains('rotate-7')) {
                    item.style.transform = 'rotate(-10deg)';
                } else if (item.classList.contains('rotate-8')) {
                    item.style.transform = 'rotate(15deg)';
                }
                
                // 显示极光覆盖层
                const auroraOverlay = item.querySelector('.aurora-overlay');
                if (auroraOverlay) {
                    auroraOverlay.style.opacity = '1';
                }
            }, 800); // 动画持续时间0.8秒
        }, delay + index * 1500); // 每张照片间隔1.5秒
    });
}

// 照片6点击事件
function initPhoto6Click() {
    const photo6 = document.getElementById('photo-6');
    const heartsContainer = document.getElementById('hearts-container');
    const photoDate = document.getElementById('photo-date');
    
    if (!photo6 || !heartsContainer || !photoDate) return;
    
    photo6.addEventListener('click', () => {
        // 飘出爱心
        createHearts(heartsContainer);
        
        // 显示日期文字
        photoDate.classList.add('show');
        
        // 3秒后隐藏日期文字
        setTimeout(() => {
            photoDate.classList.remove('show');
        }, 5000);
    });
}

// 创建爱心动画
function createHearts(container) {
    const heartCount = 5;
    const positions = [
        { x: '20%', y: '30%', endX: '-50px', endY: '-100px', rotate: '-30deg' },
        { x: '80%', y: '20%', endX: '80px', endY: '-120px', rotate: '30deg' },
        { x: '30%', y: '70%', endX: '-80px', endY: '-80px', rotate: '-15deg' },
        { x: '70%', y: '60%', endX: '60px', endY: '-90px', rotate: '20deg' },
        { x: '50%', y: '40%', endX: '0px', endY: '-150px', rotate: '0deg' }
    ];
    
    positions.forEach((pos, index) => {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = '❤️';
            
            heart.style.setProperty('--x', pos.x);
            heart.style.setProperty('--y', pos.y);
            heart.style.setProperty('--end-x', pos.endX);
            heart.style.setProperty('--end-y', pos.endY);
            heart.style.setProperty('--rotate', pos.rotate);
            
            container.appendChild(heart);
            
            // 动画结束后移除爱心
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }, index * 100);
    });
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