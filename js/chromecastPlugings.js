//chromecast load
'use strict';

//chromecast 參數
var session = null,
    App_ID = 'CC1AD845';
// namespace = "urn:x-cast:com.google.cast.media";
// DOM
var _chromecastBtn = document.getElementsByClassName('vjs-chromecastBlock'),
    _videoTag = document.getElementById('videojs-contrib-hls-player');
//link & data type
var videoAttributes = 'application/x-mpegurl',
    videoLink = 'http://solutions.brightcove.com/jwhisenant/hls/apple/bipbop/bipbopall.m3u8';
//load video
var loadPlayer = function(videojs) {
    var player = window.player = videojs('videojs-contrib-hls-player');
}(window.videojs);

$(window).load(function() {
    Cast;
    console.log(Cast);
    // loadCastInterval();
});

var Cast = new(function() {
    this.videoData = loadVideoData().loadData.categories[0];

    // loadCastInterval(function(data) { this.loadStatus = data; }.bind(this));

    //load Video
    function loadVideoData() {
        var loadData = null;
        $.ajax({
            async: false,
            type: "GET",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/videos.json",
            dataType: "json",
            contentType: "application/json",
            data: {},
            cache: false,
            success: function(data) {
                loadData = data;
            },
            error: function(jqXHR) {
                console.dir(jqXHR);
                loadData = null;
            }
        });
        return { 'loadData': loadData };
    }

    function loadCastInterval(callback) {
        var loadCastInterval = setInterval(function() {
            if (chrome.cast || chrome.cast.isAvailable) {
                clearInterval(loadCastInterval);
                callback(true);
            } else {
                callback(false);
            }
        }, 1000);
    };
    loadCastInterval(function(status) {
        if (status) {
            function initializeCastApi() {
                var applicarionID = 'CC1AD845';
                var sessionRequest = new chrome.cast.SessionRequest(applicarionID);
                var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverisReady);
                chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
            }
            initializeCastApi();
            // var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        } else {
            console.log('Unavailable');
        }
    });
    //load default media case

    var receiverisReady = function(e) {
        if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
            addChromecastBtn();
        } else {
            console.log("There are no Chromecasts available.");
        }
    }

    //監聽
    function sessionListener(e) {
        session = e;
        console.log('New session');
        if (session.media.length != 0) {
            console.log(session.media);
            console.log('Found ' + session.media.length + ' sessions.');
        }
    }
});


function onInitSuccess() {
    return;
}

var onInitError = function() {
    console.log("Initialization failed");
}

//create new btn
function addChromecastBtn() {
    var chromecastHtmlDom = "<div id='chromecastPlay' class='chromecastBtn'><img class='chromecastImage' src='images/ic_cast_connected_24dp.svg' alt='chromecast 按鈕' /></div>";
    $(_chromecastBtn).append(chromecastHtmlDom);
}


$(document).on('click', '#chromecastPlay', function() { launchApp(); })


function launchApp() {
    console.log("Launching the Chromecast App...");
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onLaunchError() {
    console.log("Error connecting to the Chromecast.");
}

function onRequestSessionSuccess(e) {
    console.log("Successfully created session: " + e.sessionId);
    session = e;
    loadMedia(changeView());
}
//調整開啟chromecast的畫面
function changeView() {
    var _videoView = document.getElementById('videojs-contrib-hls-player_html5_api'),
        _videoImage = document.getElementsByClassName('vjs-poster')[0],
        _videoControlBar = document.getElementsByClassName('vjs-control-bar'),
        _videoTitle = document.getElementById('title-Infor');
    // $('.vjs-control-bar ').fadeOut();
    _videoControlBar[0].style.display = 'none'; //hide video control bar
    _videoTag.pause(); //stop video

    _videoView.style.top = '100%'; //hide video
    _videoImage.style.display = 'block';
    var videoTitleInfor = _videoTitle.innerText;
    var chromeCastposterInformation = "<img class='loadingImage' src='images/loading.gif' /><img class='playBtn' src='images/btn-play.png'><div class='chromeCastposterBlock'><img class='chromecastIcon' src='images/ic_cast_connected_24dp.svg' alt='" + videoTitleInfor + "' /><span class='chromeCastTitle'>" + videoTitleInfor + "</span></div>";
    _videoImage.innerHTML = chromeCastposterInformation;
}

function loadMedia() {
    var _videoImage = document.getElementsByClassName('vjs-poster')[0];
    if (!session) {
        console.log("No session.");
        return;
    }
    var mediaInfo = new chrome.cast.media.MediaInfo(videoLink);
    mediaInfo.contentType = videoAttributes;
    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    console.dir(session);
    // console.dir(castPause);
    console.log(request)
    request.autoplay = false;
    session.loadMedia(request, onLoadSuccess.bind(this, 'loadMedia'), onLoadError);
}

function onLoadSuccess(how, media) {
    console.log('Successfully loaded.');
    var currentMedia = media;
    console.log(currentMedia);
    $('.vjs-control-bar').show();
    var _loadingImage = $('.loadingImage'),
        _playBtn = $('.playBtn');
    _loadingImage.hide();
    _playBtn.show();
    castStop();
}

function onLoadError() {
    console.log('Failed to load Video.');
}

function castStop() {
    var MediaPause = new window.chrome.cast.media.PauseRequest;
    console.log(MediaPause);
    // window.chrome.cast.media.PauseRequest;
}

function stopSuccess() {
    console.log('Stop success!');
}

function stopError() {
    console.log('Stop Error!');
}
