var supportsVideo = !!document.createElement('video').canPlayType;
if (supportsVideo) {
  var videoContainer = document.getElementById('videoContainer');
  var video = document.getElementById('video');
  var videoControls = document.getElementById('video-controls');
  video.controls = false;
  videoControls.style.display = 'flex';

  var playpause = document.getElementById('playpause');
  var stop = document.getElementById('stop');
  var mute = document.getElementById('mute');
  var volinc = document.getElementById('volinc');
  var voldec = document.getElementById('voldec');
  var currentTime = document.getElementById('currentTime');
  var duration = document.getElementById('duration');
  var progress = document.getElementById('progress');
  var progressBar = document.getElementById('progress-bar');
  var volumeRange = document.getElementById('volumeRange');
  volumeRange.setAttribute('max', '100');
  var fullscreen = document.getElementById('fs');

  videoContainer.addEventListener('touchstart', function(e) {
    setTimeout( function(){
      videoControls.style.transform = 'translateY(0)';
    }, 100);
    setTimeout( function(){
      videoControls.style.transform = 'translateY(100%)';
    }, 4000);
  });

  playpause.addEventListener('click', function(e) {
    if (video.paused || video.ended) {
      playpause.className = "pause";
      video.play();
    } else {
      playpause.className = "play";
      video.pause();
    }
  });

  stop.addEventListener('click', function(e) {
    playpause.className = "play";
    video.pause();
    video.currentTime = 0;
    progress.value = 0;
  });

  mute.addEventListener('click', function(e) {
    if (video.muted) {
      video.muted = false;
      mute.className = "unMuted";
    } else {
      video.muted = true;
      mute.className = "muted";
    }
  });

  video.addEventListener('loadedmetadata', function() {
    progress.setAttribute('max', video.duration);
  });

  video.addEventListener('timeupdate', function() {
    if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
    progress.value = video.currentTime;
    currentTime.innerHTML = converToTime(video.currentTime);
    progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
    if (video.ended) {
      video.currentTime = 0;
      playpause.className = "play";
    }
  });

  video.addEventListener('canplay', function() {
    duration.innerHTML = converToTime(video.duration);
  });

  progress.addEventListener('click', function(e) {
    var x = e.offsetX == undefined ? e.layerX : e.offsetX;
    // alert('x'+x +" - offsetLeft" + this.offsetLeft +" - offsetWidth" + this.offsetWidth);
    var pos = (x) / this.offsetWidth;
    // alert(pos);
    video.currentTime = pos * video.duration;
  });

  // volumeRange.addEventListener('mousemove', function(){
  //   setVolume();
  // });
  volumeRange.addEventListener('change', function() {
    setVolume();
  });

  var setVolume = function() {
    video.volume = volumeRange.value / 100;
    mute.className = "unMuted";
    video.muted = false;
    mute.style.color = "#d51414";
    if (video.volume == 0) {
      mute.className = "muted";
      mute.style.color = "#4a4a4a";
    } else if (video.volume.toFixed(1) <= 0.5) {
      mute.className = "q1";
    }
  };

  var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

  if (!fullScreenEnabled) {
    fullscreen.style.display = 'none';
  }

  fs.addEventListener('click', function(e) {
    handleFullscreen();
  });

  window.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {    
      fs.className = "full";
    }
  });

  // Функция проверяет находится ли браузер в полноэкранном режиме вызывая другую функцию isFullScreen()
  var handleFullscreen = function() {
    if (isFullScreen()) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
      fs.className = "full";
    } else {
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
      else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
      setFullscreenData(true);
      fs.className = "exitFull";
    }
  };

  var isFullScreen = function() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
  };

  var setFullscreenData = function(state) {
    videoContainer.setAttribute('data-fullscreen', !!state);
  };

  document.addEventListener('fullscreenchange', function(e) {
    setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
  });
  document.addEventListener('webkitfullscreenchange', function() {
    setFullscreenData(!!document.webkitIsFullScreen);
  });
  document.addEventListener('mozfullscreenchange', function() {
    setFullscreenData(!!document.mozFullScreen);
  });
  document.addEventListener('msfullscreenchange', function() {
    setFullscreenData(!!document.msFullscreenElement);
  });

}

// Функция конвертации времени (секунды переводся в фомат 00:00:00)
function converToTime(seconds) {
  var h, m, s;
  h = Math.floor(seconds / 3600);
  m = Math.floor((seconds - (h * 3600)) / 60);
  s = Math.floor(seconds - (h * 3600) - (m * 60));
  if (h > 0)
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  else
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}
