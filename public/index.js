(function() {
    var container;
    var audioPlayer;
    var playPause;
    var playpauseBtn;
    var loading;
    var progress;
    var sliders;
    var volumeBtn;
    var volumeControls;
    var volumeProgress;
    var player;
    var currentTime;
    var totalTime;
    var speaker;
    var tipBtn;
    var backBtn;
    var draggableClasses = ['pin'];
    var currentlyDragged = null;
    var showTipInfo = false;

    $('document').ready(function() {
        container = $('.stw-audio-player-container');
        audioPlayer = document.querySelector('.stw-audio-player-container .green-audio-player');
        playPause = audioPlayer.querySelector('#playPause');
        playpauseBtn = audioPlayer.querySelector('.play-pause-btn');
        loading = audioPlayer.querySelector('.loading');
        progress = audioPlayer.querySelector('.progress');
        sliders = audioPlayer.querySelectorAll('.slider');
        volumeBtn = audioPlayer.querySelector('.volume-btn');
        volumeControls = $('.volume-controls');
        volumeProgress = volumeControls.find($('.slider .progress'));
        player = audioPlayer.querySelector('audio');
        currentTime = audioPlayer.querySelector('.current-time');
        totalTime = audioPlayer.querySelector('.total-time');
        speaker = audioPlayer.querySelector('#speaker');
        tipBtn = document.querySelector('.stw-audio-player-container .tip-btn');
        backBtn = document.querySelector('.stw-audio-player-container .back-btn');

        draggableClasses = ['pin'];
        currentlyDragged = null;

        window.addEventListener('mousedown', function(event) {

            if(!isDraggable(event.target)) return false;

            currentlyDragged = event.target;
            let handleMethod = currentlyDragged.dataset.method;

            this.addEventListener('mousemove', window[handleMethod], false);

            window.addEventListener('mouseup', () => {
                currentlyDragged = false;
                window.removeEventListener('mousemove', window[handleMethod], false);
            }, false);
        });

        playpauseBtn.addEventListener('click', togglePlay);
        player.addEventListener('timeupdate', updateProgress);
        player.addEventListener('volumechange', updateVolume);
        player.addEventListener('loadedmetadata', () => {
            totalTime.textContent = formatTime(player.duration);
        });
        player.addEventListener('canplay', makePlay);
        player.addEventListener('ended', function(){
            playPause.attributes.d.value = "M18 12L0 24V0";
            player.currentTime = 0;
        });

        volumeBtn.addEventListener('click', function() {
            if (volumeControls.css('display') === 'none') {
                volumeControls.css('display', 'flex');
            } else {
                volumeControls.css('display', 'none')
            }
        });

        tipBtn.addEventListener('click', function() {
            $('.stw-audio-player-container .controls').css('display', 'none');
            $('.stw-audio-player-container .content-top').css('display', 'none');
            $('.stw-audio-player-container .tip-count').css('display', 'none');
            $('.stw-audio-player-container .address').css('display', 'block');
            $('.stw-audio-player-container .memo').css('display', 'block');
            $('.stw-audio-player-container .tip-btn').css('display', 'none');
            $('.stw-audio-player-container .back-btn').css('display', 'block');
            $('.stw-audio-player-container .tip-explanation').css('display', 'block');
            $('.stw-audio-player-container .play-pause-btn').css('margin-top', '26px');
            $('.stw-audio-player-container .volume').css('margin-top', '26px');
            showTipInfo = true;
        });

        backBtn.addEventListener('click', function() {
            $('.stw-audio-player-container .controls').css('display', 'flex');
            $('.stw-audio-player-container .content-top').css('display', 'block');
            $('.stw-audio-player-container .tip-count').css('display', 'block');
            $('.stw-audio-player-container .address').css('display', 'none');
            $('.stw-audio-player-container .memo').css('display', 'none');
            $('.stw-audio-player-container .tip-btn').css('display', 'block');
            $('.stw-audio-player-container .tip-explanation').css('display', 'none');
            $('.stw-audio-player-container .back-btn').css('display', 'none');
            $('.stw-audio-player-container .play-pause-btn').css('margin-top', '');
            $('.stw-audio-player-container .volume').css('margin-top', '');
        });

        window.addEventListener('resize', directionAware);

        sliders.forEach(slider => {
            let pin = slider.querySelector('.pin');
            slider.addEventListener('click', window[pin.dataset.method]);
        });

        directionAware();

    });


    function setCss() {

        $('.stw-audio-player-container').css({
            'font-family' : 'Roboto, sans-serif',
            'width' : '400px',
            'min-width' : '300px',
            'height' : '76px',
            'box-shadow' : '0 4px 16px 0 rgba(0, 0, 0, .07)',
            'padding-left' : '24px',
            'padding-right' : '24px',
            'border-radius' : '4px',
            'background-color' : '#fff'
        });

        $('.stw-audio-player-container .address').css({
            'font-size': '14px',
            'color': '#556473',
            'margin-left': '42px',
            'padding-top': '18px',
            'display': 'none',
            'word-wrap': 'break-word',
            'margin-right': '30px',
            'position': 'absolute',
            'width': '320px'
        });

        $('.stw-audio-player-container .memo').css({
            'font-size': '14px',
            'color': '#556473',
            'position': 'absolute',
            'margin-top': '55px',
            'margin-left': '42px'
        });

        $('.stw-audio-player-container .tip').css({
            'font-size': '12px',
            'margin-top': '5px',
            'color': '#556473',
            'display': 'flex',
            'justify-content': 'space-between',
            'margin-left': '42px'
        });

        $('.stw-audio-player-container .tip-btn').css({
            'cursor': 'pointer',
            'border-radius': '3px',
            'padding': '1px 5px',
            'background': '#4ad5b6',
            'box-shadow' : '0px 1px 1px 0px rgba(0, 0, 0, 0.32)'
        });

        $('.stw-audio-player-container .back-btn').css({
            'display': 'none',
            'margin-left': '322px',
            'cursor': 'pointer',
            'border-radius': '3px',
            'padding': '1px 5px',
            'background': '#43c7ab',
            'box-shadow' : '0px 1px 1px 0px rgba(0, 0, 0, 0.32)'
        });

        $('.stw-audio-player-container .content-top').css({
            'margin-left': '42px',
            'padding-top': '5px',
            'margin-bottom': '5px',
            'font-size': '14px'
        });

        $('.stw-audio-player-container .tip-explanation').css({
            'font-size': '10px',
            'position': 'absolute',
            'margin-left': '42px',
            'margin-top': '5px',
            'color': '#556473',
            'font-style': 'italic',
            'user-select': 'none',
            'display': 'none'
        })


        $('.stw-audio-player-container .song-name').css({
            'color': '#556473',
            'font-weight': '600'
        });

        $('.stw-audio-player-container .song-author').css({
            'color': '#66788a'
        });

        $('.stw-audio-player-container .address-title').css({
            'user-select': 'none',
            'font-weight': '800'
        });

        $('.stw-audio-player-container .memo-title').css({
            'user-select': 'none',
            'font-weight': '800'
        });

        $('.stw-audio-player-container .memo').css({
            'display': 'none'
        });

        $('.stw-audio-player-container .audio.green-audio-player').css({
            'display' : 'flex',
            'justify-content' : 'space-between',
            'align-items' : 'center',
        });

        $('.stw-audio-player-container .audio.green-audio-player .play-pause-btn').css({
            'display' : 'none',
            'cursor' : 'pointer'
        });

        $('.stw-audio-player-container .audio.green-audio-player .spinner').css({
            'width' : '18px',
            'height' : '18px',
            'background-image' : 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/loading.png)',
            'background-size' : 'cover',
            'background-repeat' : 'no-repeat',
            'animation' : 'spin 0.4s linear infinite'
        });

        $('.stw-audio-player-container .audio.green-audio-player .slider').css({
            'flex-grow' : '1',
            'background-color' : '#d8d8d8',
            'cursor' : 'pointer',
            'position' : 'relative'
        });

        $('.stw-audio-player-container .audio.green-audio-player .slider .progress').css({
            'background-color' : '#44bfa3',
            'border-radius' : 'inherit',
            'position' : 'absolute',
            'pointer-events' : 'none'
        });

        $('.stw-audio-player-container .audio.green-audio-player .slider .progress .pin').css({
            'height' : '16px',
            'width' : '16px',
            'border-radius' : '8px',
            'background-color' : '#44bfa3',
            'position' : 'absolute',
            'pointer-events' : 'all',
            'box-shadow' : '0px 1px 1px 0px rgba(0, 0, 0, 0.32)'
        });

        $('.stw-audio-player-container .audio.green-audio-player .controls').css({
            'font-family' : 'Roboto, sans-serif',
            'font-size' : '16px',
            'line-height' : '18px',
            'color' : '#55606e',
            'display' : 'flex',
            'flex-grow' : '1',
            'justify-content' : 'space-between',
            'align-items' : 'center',
            'margin-left' : '24px',
            'margin-right' : '24px'
        });

        $('.stw-audio-player-container .audio.green-audio-player .controls .slider').css({
            'margin-left' : '16px',
            'margin-right' : '16px',
            'border-radius' : '2px',
            'height' : '4px'
        });

        $('.stw-audio-player-container .audio.green-audio-player .controls .slider .progress').css({
            'width' : '0',
            'height' : '100%'
        });

        $('.stw-audio-player-container .audio.green-audio-player .controls .slider .progress .pin').css({
            'right' : '-8px',
            'top' : '-6px'
        });

        $('.stw-audio-player-container .audio.green-audio-player .controls span').css({
            'cursor' : 'default'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume').css({
            'position' : 'relative'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-btn').css({
            'cursor' : 'pointer'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-btn.open path').css({
            'fill' : '#44bfa3'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-controls').css({
            'width' : '30px',
            'height' : '135px',
            'background-color' : 'rgba(0, 0, 0, 0.62)',
            'border-radius' : '7px',
            'position' : 'absolute',
            'left' : '-3px',
            'bottom' : '52px',
            'flex-direction' : 'column',
            'align-items' : 'center',
            'display' : 'none'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-controls .slider').css({
            'margin-top' : '12px',
            'margin-bottom' : '12px',
            'width' : '6px',
            'border-radius' : '3px'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-controls .slider .progress').css({
            'bottom' : '0',
            'height' : '100%',
            'width' : '6px'
        });

        $('.stw-audio-player-container .audio.green-audio-player .volume .volume-controls .slider .progress .pin').css({
            'left' : '-5px',
            'top' : '-8px'
        });

        $('.stw-audio-player-container svg, img').css({
            'display' : 'block'
        });

        try {
            $.keyframe.define([{
                name: 'spin',
                from: {
                    'transform': 'rotateZ(0)'
                },
                to: {
                    'transform': 'rotateZ(1turn)'
                }
            }])
        } catch(err) {
            // don't do anything
        }


    }

    function memoCounter(o) {
        return o.records.filter(function(record) {
            return record.memo === o.memo
        }).length;
    }


    var numToTextHash = {
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
    };

    function getCountText(o) {
        var tipCountText = '';
        var songOrPiece = o.isClassical ? 'piece' : 'song';

        if (o.count === 0) {
            tipCountText = 'Be the first to tip this ' + songOrPiece  + '.';
        } else if (o.count === 1) {
            tipCountText = 'One person has tipped this ' + songOrPiece + '.';
        } else if (o.count < 10) {
            tipCountText = numToTextHash[o.count].concat(' people have tipped this ' + songOrPiece + '.');
        } else if (o.count === 'overOneHundred') {
            tipCountText = 'Over one hundred people have tipped this ' + songOrPiece + '.'
        } else {
            tipCountText = o.count + ' people have tipped this ' + songOrPiece + '.';
        }
        return  tipCountText;
    }

    function AudioPlayer(o) {
        var server = new StellarSdk.Server('https://horizon.stellar.org');
        var accountId = o.address;

        var count = 0;

        server.transactions()
            .forAccount(accountId)
            .call()
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function (page) {
                count += memoCounter({records: page.records, memo: o.memo});
            })
            .then(function () {
                $('.stw-audio-player-container .tip-count').html(getCountText({count: 'overOneHundred', isClassical: o.isClassical}));
            })
            .catch(function (err) {
                $('.stw-audio-player-container .tip-count').html(getCountText({count: count, isClassical: o.isClassical}));
            });



        var container = $("<div class=\"stw-audio-player-container\">" + "<div class=\"tip-explanation\">Tip using the stellar blockchain</div>" +
            "<div class=\"address\"><span class=\"address-title\">XLM&nbsp;Address:&nbsp;</span>" + o.address + "</div>" +
            "<div class=\"memo\"><span class=\"memo-title\">Memo:</span>&nbsp;" + o.memo + "</div>" +
            "<div class=\"content-top\"><span  class=\"song-name\">" + o.songName + "</span>" + ' ' + "<span class=\"song-author\">" + o.by + "</span></div>" +
            "<div class=\"audio green-audio-player\">\n" +
            "    <div class=\"loading\">\n" +
            "        <div class=\"spinner\"></div>\n" +
            "    </div>\n" +
            "    <div class=\"play-pause-btn\">\n" +
            "        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"24\" viewBox=\"0 0 18 24\">\n" +
            "            <path fill=\"#566574\" fill-rule=\"evenodd\" d=\"M18 12L0 24V0\" class=\"play-pause-icon\" id=\"playPause\"/>\n" +
            "        </svg>\n" +
            "    </div>\n" +
            "\n" +
            "    <div class=\"controls\">\n" +
            "        <span class=\"current-time\">0:00</span>\n" +
            "        <div class=\"slider\" data-direction=\"horizontal\">\n" +
            "            <div class=\"progress\">\n" +
            "                <div class=\"pin\" id=\"progress-pin\" data-method=\"rewind\"></div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <span class=\"total-time\">0:00</span>\n" +
            "    </div>\n" +
            "\n" +
            "    <div class=\"volume\">\n" +
            "        <div class=\"volume-btn\">\n" +
            "            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n" +
            "                <path fill=\"#566574\" fill-rule=\"evenodd\" d=\"M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z\" id=\"speaker\"/>\n" +
            "            </svg>\n" +
            "        </div>\n" +
            "        <div class=\"volume-controls hidden\">\n" +
            "            <div class=\"slider\" data-direction=\"vertical\">\n" +
            "                <div class=\"progress\">\n" +
            "                    <div class=\"pin\" id=\"volume-pin\" data-method=\"changeVolume\"></div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "\n" +
            "    <audio crossorigin>\n" +
            "        <source src=" + o.src + " type=\"audio/mpeg\">\n" +
            "    </audio>\n" +
            "</div><div class=\"tip\">" +
            "<span class=\"tip-count\"></span>" +
            "<span class=\"tip-btn\">Tip XLM</span>" +
            "<span class=\"back-btn\">Back</span>" +
            "</div>" +
            "</div>"
        );
        $("body").append(container);
        setCss();
    }

    var isDraggable = function(el) {
        let canDrag = false;
        let classes = Array.from(el.classList);
        draggableClasses.forEach(draggable => {
            if(classes.indexOf(draggable) !== -1)
                canDrag = true;
        })
        return canDrag;
    }

    var inRange = function(event) {
        let rangeBox = getRangeBox(event);
        let rect = rangeBox.getBoundingClientRect();
        let direction = rangeBox.dataset.direction;
        if(direction == 'horizontal') {
            var min = rangeBox.offsetLeft;
            var max = min + rangeBox.offsetWidth;
            if(event.clientX < min || event.clientX > max) return false;
        } else {
            var min = rect.top;
            var max = min + rangeBox.offsetHeight;
            if(event.clientY < min || event.clientY > max) return false;
        }
        return true;
    }

    var updateProgress = function() {
        var current = player.currentTime;
        var percent = (current / player.duration) * 100;
        progress.style.width = percent + '%';

        currentTime.textContent = formatTime(current);
    }

    var updateVolume = function() {
        volumeProgress.css('height', player.volume * 100 + '%');
        if(player.volume >= 0.5) {
            speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
        } else if(player.volume < 0.5 && player.volume > 0.05) {
            speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
        } else if(player.volume <= 0.05) {
            speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
        }
    }

    var getRangeBox = function(event) {
        let rangeBox = event.target;
        let el = currentlyDragged;
        if(event.type == 'click' && isDraggable(event.target)) {
            rangeBox = event.target.parentElement.parentElement;
        }
        if(event.type == 'mousemove') {
            rangeBox = el.parentElement.parentElement;
        }
        return rangeBox;
    }

    var getCoefficient = function(event) {
        let slider = getRangeBox(event);
        let rect = slider.getBoundingClientRect();
        let K = 0;
        if(slider.dataset.direction == 'horizontal') {

            let offsetX = event.clientX - slider.offsetLeft;
            let width = slider.clientWidth;
            K = offsetX / width;

        } else if(slider.dataset.direction == 'vertical') {

            let height = slider.clientHeight;
            var offsetY = event.clientY - rect.top;
            K = 1 - offsetY / height;

        }
        return K;
    }

    rewind = function(event) {
        console.log('hello')
        if(inRange(event)) {
            player.currentTime = player.duration * getCoefficient(event);
        }
    }

    changeVolume = function(event) {
        if(inRange(event)) {
            player.volume = getCoefficient(event);
        }
    }

    function formatTime(time) {
        var min = Math.floor(time / 60);
        var sec = Math.floor(time % 60);
        return min + ':' + ((sec<10) ? ('0' + sec) : sec);
    }

    function togglePlay() {
        if(player.paused) {
            playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
            player.play();
        } else {
            playPause.attributes.d.value = "M18 12L0 24V0";
            player.pause();
        }
    }

    function makePlay() {
        playpauseBtn.style.display = 'block';
        loading.style.display = 'none';
    }

    function directionAware() {
        if(window.innerHeight < 250) {
            volumeControls.css({
                'bottom': '-54px',
                'left': '54px'
            });
        } else if(audioPlayer.offsetTop < 154) {
            volumeControls.css({
                'bottom': '-164px',
                'left': '-3px'
            });
        } else {
            volumeControls.css({
                'bottom': '52px',
                'left': '-3px'
            });
        }
    }

    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return {
                AudioPlayer: AudioPlayer
            };
        });
    }
    // Add support for CommonJS libraries such as browserify.
    if (typeof exports !== 'undefined') {
        exports.AudioPlayer = AudioPlayer;
    }
    // Define globally in case AMD is not available or unused.
    if (typeof window !== 'undefined') {
        window.AudioPlayer = AudioPlayer;
    } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
        global.AudioPlayer = AudioPlayer;
    }
})();

