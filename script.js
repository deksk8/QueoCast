const allowedDomain = "queonetics.com";
const savedEmail = localStorage.getItem("userEmail");

if (!savedEmail || !savedEmail.endsWith("@" + allowedDomain)) {
  window.location.href = "login.html";
}


console.log("Versão atual do script carregada");

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const rewindButton = document.getElementById('rewind');
    const forwardButton = document.getElementById('forward');
    const skipBackButton = document.getElementById('skip-back');
    const skipNextButton = document.getElementById('skip-next');
    const episodeTitle = document.getElementById('episode-title');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const episodesList = document.getElementById('episodes');
    const modeToggleButton = document.getElementById('mode-toggle');
    const volumeControl = document.getElementById('volume-control');



    let currentEpisodeIndex = -1;
    let isPlaying = false;
    let episodes = [];

    // Define volume inicial
    audioPlayer.volume = 0.5;
    volumeControl.value = audioPlayer.volume;
    const body = document.body;

    const progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    progressBarContainer.appendChild(progressIndicator);

    function renderEpisodes() {
        episodesList.innerHTML = '';
        episodes.forEach((episode, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = episode.title;
            listItem.addEventListener('click', () => {
                loadEpisode(index);
                isPlaying = true;
                audioPlayer.play();
            });
            episodesList.appendChild(listItem);
        });
    }

    fetch('episodios.json')
        .then(response => response.json())
        .then(data => {
            episodes = data;
            renderEpisodes();
            if (episodes.length > 0) loadEpisode(0);
        });

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const loadEpisode = (index) => {
        if (index >= 0 && index < episodes.length) {
            currentEpisodeIndex = index;
            const episode = episodes[currentEpisodeIndex];
            audioPlayer.src = episode.src;
            episodeTitle.textContent = episode.title;

            document.querySelectorAll('.episode-list li').forEach((item, idx) => {
                item.classList.remove('active');
                if (idx === currentEpisodeIndex) {
                    item.classList.add('active');
                }
            });

            if (isPlaying) {
                audioPlayer.play();
                playPauseButton.innerHTML = '&#x23F8;&#xFE0E;';
            } else {
                audioPlayer.load();
                playPauseButton.innerHTML = '&#x25B6;';
            }
        }
    };

    const togglePlayPause = () => {
        if (audioPlayer.src === '' && episodes.length > 0) {
            loadEpisode(0);
            isPlaying = true;
            audioPlayer.play();
            playPauseButton.innerHTML = '&#x23F8;&#xFE0E;';
            return;
        }

        if (isPlaying) {
            audioPlayer.pause();
            playPauseButton.innerHTML = '&#x25B6;';
        } else {
            audioPlayer.play();
            playPauseButton.innerHTML = '&#x23F8;&#xFE0E;';
        }
        isPlaying = !isPlaying;
    };

    const seekAudio = (seconds) => {
        audioPlayer.currentTime += seconds;
    };

    const skipNextEpisode = () => {
        if (currentEpisodeIndex < episodes.length - 1) {
            loadEpisode(currentEpisodeIndex + 1);
            isPlaying = true;
            audioPlayer.play();
        } else {
            audioPlayer.pause();
            isPlaying = false;
            playPauseButton.innerHTML = '&#x25B6;';
            audioPlayer.currentTime = 0;
        }
    };

    const skipPreviousEpisode = () => {
        if (currentEpisodeIndex > 0) {
            loadEpisode(currentEpisodeIndex - 1);
            isPlaying = true;
            audioPlayer.play();
        } else {
            audioPlayer.currentTime = 0;
        }
    };

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        progressIndicator.style.left = `${progress}%`;
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => {
        skipNextEpisode();
    });

    progressBarContainer.addEventListener('click', (e) => {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        audioPlayer.currentTime = audioPlayer.duration * percentage;
    });

    let isDragging = false;

    progressIndicator.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    // Atualiza o volume com base no input
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = progressBarContainer.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        const percentage = offsetX / rect.width;
        audioPlayer.currentTime = audioPlayer.duration * percentage;

        const progress = percentage * 100;
        progressBar.style.width = `${progress}%`;
        progressIndicator.style.left = `${progress}%`;
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
    });

    const applySavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        modeToggleButton.textContent = '☀️';
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        modeToggleButton.textContent = '🌙';
    }
};

    const toggleTheme = () => {
    modeToggleButton.classList.add('rotating'); // adiciona animação

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        modeToggleButton.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        modeToggleButton.textContent = '🌙';
    }

    // remove a classe após a animação terminar
    setTimeout(() => {
        modeToggleButton.classList.remove('rotating');
    }, 600);
};

    applySavedTheme();

    playPauseButton.addEventListener('click', togglePlayPause);
    rewindButton.addEventListener('click', () => seekAudio(-10));
    forwardButton.addEventListener('click', () => seekAudio(10));
    skipNextButton.addEventListener('click', skipNextEpisode);
    skipBackButton.addEventListener('click', skipPreviousEpisode);

    if (modeToggleButton) {
        modeToggleButton.addEventListener('click', toggleTheme);
    } else {
        console.error("Erro: Botão 'mode-toggle' não encontrado no DOM.");
    }
});
