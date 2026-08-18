const CAST_STREAM_URL =
    "https://listen.radioking.com/radio/917921/stream/988836";

const RADIO_LOGO_URL =
    "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/44153165/44153165-1756027969361-fe65b85dada35.jpg";

let castInitialized = false;


/*
========================================
GOOGLE CAST SDK
========================================
*/

window.__onGCastApiAvailable = function(isAvailable) {

    if (isAvailable) {

        initializeCast();

    } else {

        console.error(
            "Google Cast SDK nie je dostupné."
        );

    }

};


/*
========================================
INICIALIZÁCIA CAST
========================================
*/

function initializeCast() {

    if (castInitialized) {
        return;
    }

    try {

        const castContext =
            cast.framework.CastContext.getInstance();


        castContext.setOptions({

            receiverApplicationId:
                chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,

            autoJoinPolicy:
                chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED

        });


        castContext.addEventListener(

            cast.framework.CastContextEventType
                .SESSION_STATE_CHANGED,

            function(event) {

                console.log(
                    "Google Cast:",
                    event.sessionState
                );

            }

        );


        castInitialized = true;

        console.log(
            "Google Cast je pripravený."
        );


    } catch (error) {

        console.error(
            "Chyba Google Cast:",
            error
        );

    }

}


/*
========================================
SPUSTENIE GOOGLE CAST
========================================
*/

async function startCast() {

    try {

        /*
        Skontrolujeme, či je Cast SDK
        načítané.
        */

        if (
            typeof cast === "undefined" ||
            typeof chrome === "undefined"
        ) {

            console.error(
                "Google Cast SDK ešte nie je načítané."
            );

            return;

        }


        const castContext =
            cast.framework.CastContext.getInstance();


        /*
        Aktuálna Cast session
        */

        let castSession =
            castContext.getCurrentSession();


        /*
        Ak nie je pripojené zariadenie,
        otvorí sa výber Chromecast zariadenia.
        */

        if (!castSession) {

            await castContext.requestSession();

            castSession =
                castContext.getCurrentSession();

        }


        /*
        Používateľ nezvolil zariadenie.
        */

        if (!castSession) {

            console.log(
                "Nebolo vybrané Cast zariadenie."
            );

            return;

        }


        /*
        ========================================
        STREAM
        ========================================
        */

        const mediaInfo =
            new chrome.cast.media.MediaInfo(
                CAST_STREAM_URL,
                "audio/mpeg"
            );


        /*
        Rádio je LIVE stream.
        */

        mediaInfo.streamType =
            chrome.cast.media.StreamType.LIVE;


        /*
        ========================================
        METADATA
        ========================================
        */

        const metadata =
            new chrome.cast.media.MusicTrackMediaMetadata();


        const songElement =
            document.getElementById(
                "songName"
            );


        let currentSong =
            "Rádio Klub – Živé vysielanie";


        if (songElement) {

            const text =
                songElement.textContent.trim();

            if (text) {
                currentSong = text;
            }

        }


        metadata.title =
            currentSong;

        metadata.artist =
            "Rádio Klub";

        metadata.albumName =
            "Rádio Klub";


        /*
        Logo Rádio Klub
        */

        metadata.images = [

            new chrome.cast.Image(
                RADIO_LOGO_URL
            )

        ];


        mediaInfo.metadata =
            metadata;


        /*
        ========================================
        LOAD REQUEST
        ========================================
        */

        const request =
            new chrome.cast.media.LoadRequest(
                mediaInfo
            );


        request.autoplay = true;


        /*
        ========================================
        SPUSTENIE NA CHROMECASTE
        ========================================
        */

        await castSession.loadMedia(
            request
        );


        console.log(
            "Rádio Klub sa prehráva cez Google Cast."
        );


        /*
        ========================================
        ZASTAVÍME LOKÁLNE RÁDIO
        ========================================
        */

        const localRadio =
            document.getElementById(
                "radioPlayer"
            );


        const localPlayButton =
            document.getElementById(
                "playButton"
            );


        if (localRadio) {

            localRadio.pause();

        }


        if (localPlayButton) {

            localPlayButton.innerHTML =
                "▶";

            localPlayButton.title =
                "Prehrať rádio";

        }


        /*
        Ak existuje premenná playing
        v stream.html, nastavíme ju
        na false.
        */

        if (
            typeof playing !== "undefined"
        ) {

            playing = false;

        }


    } catch (error) {

        console.error(
            "Google Cast chyba:",
            error
        );

    }

}


/*
========================================
UKONČENIE CAST
========================================
*/

function stopCast() {

    try {

        const castContext =
            cast.framework.CastContext.getInstance();


        const castSession =
            castContext.getCurrentSession();


        if (castSession) {

            castSession.endSession(
                true
            );

        }


    } catch (error) {

        console.error(
            "Chyba pri ukončení Cast:",
            error
        );

    }

}


/*
========================================
KONTROLA STAVU CAST
========================================
*/

function getCastState() {

    try {

        const castContext =
            cast.framework.CastContext.getInstance();


        return castContext.getCastState();


    } catch (error) {

        console.error(
            "Nepodarilo sa zistiť Cast stav.",
            error
        );

        return null;

    }

}
