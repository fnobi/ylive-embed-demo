import EmbedTube from './lib/EmbedTube';
import locationParams from './lib/locationParams';

window.onYouTubeIframeAPIReady = () => {
    const videoId = locationParams.v;
    if (!videoId) {
        return;
    }
    
    const embedTube = new EmbedTube({
        elementId: 'video',
        videoId: videoId,
        playerVars: {
            controls: 0,
            rel: 0,
            disablekb: 1,
            playsinline: 1,
            showinfo: 0
        }
    });
    
    const toggleButton = document.getElementById('toggle-button');
    
    let isPlaying = false;

    function play () {
        isPlaying = true;
        embedTube.play();
    }

    function pause () {
        isPlaying = false;
        embedTube.pause();
    }

    function toggle () {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    embedTube.on('ready', () => {
        toggleButton.addEventListener('click', toggle);
        play();
    });
};
