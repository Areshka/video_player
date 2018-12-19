// Проверям поддерживает ли браузер элемент <video>
var supportsVideo = !!document.createElement('video').canPlayType;
// Если браузер поддерживает элемент <video> настраиваем наши элементы управления
if (supportsVideo) {
  // Получаем ссылки на элементы
  var videoContainer = document.getElementById('videoContainer'); // ссылка на контейнер для видео
  var video = document.getElementById('video'); // ссылка на контейнер видео
  var sources = video.getElementsByTagName('source'); // ссылка на элемент source
  var quality = document.getElementById('quality');
  sources[0].src = '../video/Maroon_5_-_Sugar[240].mp4'; // источник видео по умолчанию
  quality.options[0].selected = true; // выбран первый пункт select

  var videoControls = document.getElementById('video-controls'); // ссылка на контейнер для элементов управления
  video.controls = false; // прячем элементы управления браузера по умолчанию
  videoControls.style.display = 'flex'; // отображаем пользовательские элементы управления видео

  var playpause = document.getElementById('playpause');
  var stop = document.getElementById('stop');
  var currentTime = document.getElementById('currentTime');
  var duration = document.getElementById('duration');
  var progress = document.getElementById('progress');
  var progressBar = document.getElementById('progress-bar');
  var mute = document.getElementById('mute');
  var volumeRange = document.getElementById('volumeRange');
  var fullscreen = document.getElementById('fs');

  var loading = document.getElementById('loading');
  // loading.style.display = 'block';
  
  // videoContainer.addEventListener('touchstart', function(e) {
  //   setTimeout(function() {
  //     videoControls.style.transform = 'translateY(0)';
  //   }, 100);
  //   setTimeout(function() {
  //     videoControls.style.transform = 'translateY(100%)';
  //   }, 4000);
  // });

  // событие, которое определяет когда доступно достаточно данных для того, что бы медиа могло воспроизвестись
  video.addEventListener('canplay', function() {
    duration.innerHTML = converToTime(video.duration); // указываем общее время воспроизведения видео
    video.volume = 0.8;
  });

  // на кнопке воспроизведения/паузы обнаруживается событие щелчка
  playpause.addEventListener('click', playPause);

  // отслеживаем событие нажатия пробела
  window.addEventListener('keydown', function(e) {
    if (event.keyCode === 32) { // 32 - код пробела
      event.preventDefault(); //отключаем действие клавиши по умолчанию
      playPause(); // вызываем ф-ию воспроизведения/паузы видео
    }
  });

  // // при нажатии на кнопку stop
  // stop.addEventListener('click', function(e) {
  //   playpause.className = "play"; // указываем класс для кнопки
  //   video.pause(); // видео ставится на пазу
  //   video.currentTime = 0; // текущее время воспроизведения устанавливаем в 0
  //   progress.value = 0; // позицию элемента <progress> установливаем в 0
  // });

  // при нажатии на кнопку mute
  mute.addEventListener('click', function(e) {
    if (video.muted) { //если звук выключен
      video.muted = false; // включаем звук
      mute.className = "unMuted";
    } else { // в противном случае
      video.muted = true; // выключаем звук
      mute.className = "muted";
    }
  });

  // событие, когда метаданные загружены
  video.addEventListener('loadedmetadata', function() {
    // устанавливаем атрибут max для элемента progress равным длительности видео
    progress.setAttribute('max', video.duration);
    volumeRange.setAttribute('max', '100'); // для слайдера изменения громкости устанавливаем атрибут max равный 100
  });

  // При возникновении события timeupdate атрибуту value элемента progress присваивается значение currentTime для видео.
  video.addEventListener('timeupdate', function() {
    //если атрибут max не установлен, устанавливаем его равным длительности видео
    if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
    progress.value = video.currentTime; // атрибуту value элемента progress присваивается значение currentTime для видео
    progressBar.style.width = (video.currentTime / video.duration) * 100 + '%';
    currentTime.innerHTML = converToTime(video.currentTime); // изменяем содержимое элемента currentTime на текущее время воспроизведения
    if (video.ended) { // если воспроизведение закончено
      video.currentTime = 0; //текущее время воспроизведения устанавливаем в 0
      playpause.className = "play";
    }
    // Сохранение текущее время воспроизведения в sessionStorage
    sessionStorage.setItem('currentTime', video.currentTime);
  });

  progress.addEventListener('click', function(e) {
    var x = e.offsetX == undefined ? e.layerX : e.offsetX; //определяем положение курсора
    var pos = (x) / this.offsetWidth;
    video.currentTime = pos * video.duration; // "переходим вперед" к другой точке воспроизведения видео
  });


  // отслеживаем событие нажаятия клавиши клавиатуры
  window.addEventListener('keydown', function(e) {
    if (event.keyCode === 39) { // 39 - код стрелки вправо
      if ((video.currentTime < video.duration) && !video.ended)
        video.currentTime = video.currentTime + 10; // увеличиваем текущее время на 10
    }
  });

  // отслеживаем событие нажаятия клавиши клавиатуры
  window.addEventListener('keydown', function(e) {
    if (event.keyCode === 37) { // 37 - код стрелки влево
      if ((video.currentTime - 10) != 0)
        video.currentTime = video.currentTime - 10; // уменьшаем текущее время на 10
    }
  });

  // отлавливаем событие изменения слайдера громкости
  volumeRange.addEventListener('change', function() {
    setVolume(); // вызываем ф-ию изменения громкости
  });

  // отслеживаем событие нажаятия клавиши клавиатуры
  window.addEventListener('keydown', function(e) {
    if (event.keyCode === 38) { // 38 - код стрелки вверх
      event.preventDefault();
      keyVolume("+"); // увеличиваем громкость
    }
  });

  // отслеживаем событие нажаятия клавиши клавиатуры
  window.addEventListener('keydown', function(e) {
    if (event.keyCode === 40) { // 40 - код стрелки вниз
      event.preventDefault();
      keyVolume("-"); // уменьшаем громкость
    }
  });

  var keyVolume = function(dir) {
    var currentVolume = Math.floor(video.volume * 10) / 10; // получаем текущию громкость
    if (dir === '+') {
      if (currentVolume < 1) video.volume += 0.1; // если текущия громкость меньше 1 увеличиваем громкость на 0,1
    } else if (dir === '-') {
      if (currentVolume > 0) video.volume -= 0.1; // если текущия громкость больше 0 уменьшаем громкость на 0,1
    }
    volumeRange.value = video.volume * 100; // устанавливаем значение слайдера
    setVolume();
  };

  changeSelect(); // вызов функции выбора частоты видео
  document.addEventListener("click", closeAllSelect);

  // определяем, действительно ли браузер поддерживает полноэкранный и что он включен
  var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

  // если полноэкранный режим не поддерживается прячем кнопку полноэкранного режима
  if (!fullScreenEnabled) {
    fs.style.display = 'none';
  }

  // обработчик события щелчка на кнопке полноэкранного режима
  fs.addEventListener('click', function(e) {
    handleFullscreen();
  });

  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      fs.className = "full";
    }
  });

  // Функция проверяет находится ли браузер в полноэкранном режиме вызывая другую функцию isFullScreen()
  var handleFullscreen = function() {
    // проверяется находится ли браузер в полноэкранном режиме
    // Если браузер в настоящее время находится в полноэкранном режиме, то он должен быть закрыт и наоборот
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

  //ф-ия устанавливает значение атрибута "data-fullscreen"
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

function playPause() {
  // если видео в данный момент в режиме паузы или закончено воспроизведение, то метод play() воспроизведит видео
  // В противном случае видео должно воспроизводиться, поэтому оно приостанавливается с помощью метода pause().
  if (video.paused || video.ended) {
    playpause.className = "pause";
    video.play(); // воспроизведит видео
  } else {
    playpause.className = "play";
    video.pause(); // приостанавливает видео
  }
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

// функиция изменения громкости звука
function setVolume() {
  video.volume = volumeRange.value / 100;
  mute.className = "unMuted";
  video.muted = false;
  // mute.style.color = "#d51414";
  if (video.volume == 0) {
    mute.className = "muted";
    // mute.style.color = "#4a4a4a";
  } else if (video.volume.toFixed(1) <= 0.5) {
    mute.className = "q1";
  }
}

function changeSelect() {
  var selectWrapper, i, j, selElement, a, b, c;
  /* Look for any elements with the class "custom-select": */
  selectWrapper = document.getElementsByClassName("selectWrapper");
  for (i = 0; i < selectWrapper.length; i++) {
    selElement = selectWrapper[i].getElementsByTagName("select")[0];
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElement.options[selElement.selectedIndex].innerHTML;
    selectWrapper[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 0; j < selElement.length; j++) {
      /* For each option in the original select element, create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElement.options[j].innerHTML;
      c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box, and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            // console.log(this.innerHTML);
            changeSourceVideo(this);
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    selectWrapper[i].appendChild(b);
    a.addEventListener("click", function(e) {
      /* When the select box is clicked, close any other select boxes, and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document, except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

function changeSourceVideo(elem) {
  if (elem.innerHTML == '720p') {
    sources[0].src = '../video/Maroon_5_-_Sugar[720].mp4';
  } else if (elem.innerHTML == '480p') {
    sources[0].src = '../video/Maroon_5_-_Sugar[480].mp4';
  } else if (elem.innerHTML == '360p') {
    sources[0].src = '../video/Maroon_5_-_Sugar[360].mp4';
  } else if (elem.innerHTML == '240p') {
    sources[0].src = '../video/Maroon_5_-_Sugar[240].mp4';
  }

  video.load();
  video.currentTime = sessionStorage.getItem('currentTime');
  sessionStorage.removeItem('currentTime');
  playpause.className = "pause";
  video.play();
}
