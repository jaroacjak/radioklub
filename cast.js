const CAST_STREAM_URL =
    "https://listen.radioking.com/radio/917921/stream/988836";

let castInitialized = false;


/*
================================
GOOGLE CAST SDK JE PRIPRAVENÉ
================================
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
================================
INICIALIZÁCIA GOOGLE CAST
================================
*/

function initializeCast() {

    if (castInitialized) {
        return;
    }

    try {

        const castContext =
            cast.framework.CastContext.getInstance();


        castContext.setOptions({

            /*
            Používame Default Media Receiver.
            Nie je potrebné vlastné Cast App ID.
            */

            receiverApplicationId:
                chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,


            autoJoinPolicy:
                chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED

        });


        /*
        Sledovanie stavu Cast pripojenia
        */

        castContext.addEventListener(

            cast.framework.CastContextEventType
                .SESSION_STATE_CHANGED,

            function(event) {

                console.log(
                    "Google Cast stav:",
                    event.sessionState
                );

            }

        );


        castInitialized = true;

        console.log(
            "Google Cast bol úspešne inicializovaný."
        );

    } catch (error) {

        console.error(
            "Chyba pri inicializácii Google Cast:",
            error
        );

    }

}


/*
================================
SPUSTENIE CAST
================================
*/

async function startCast() {

    try {

        const castContext =
            cast.framework.CastContext.getInstance();


        let castSession =
            castContext.getCurrentSession();


        /*
        Ak ešte nie je vybrané zariadenie,
        otvorí sa okno na výber Chromecast.
        */

        if (!castSession) {

            await castContext.requestSession();

            castSession =
                castContext.getCurrentSession();

        }


        /*
        Ak používateľ zruší výber zariadenia
        */

        if (!castSession) {

            console.log(
                "Nebolo vybrané žiadne Cast zariadenie."
            );

            return;

        }


        /*
        VYTVORENIE INFORMÁCIÍ O RÁDIU
        */

        const mediaInfo =
            new chrome.cast.media.MediaInfo(
                CAST_STREAM_URL,
                "audio/mpeg"
            );


        /*
        ŽIVÉ VYSIELANIE
        */

        mediaInfo.streamType =
            chrome.cast.media.StreamType.LIVE;


        /*
        METADATA
        */

        const metadata =
            new chrome.cast.media.MusicTrackMediaMetadata();


        /*
        Aktuálna skladba zo stream.html
        */

        const songElement =
            document.getElementById(
                "songName"
            );


        const currentSong =
            songElement
                ? songElement.textContent.trim()
                : "Rádio Klub – Živé vysielanie";


        metadata.title =
            currentSong;

        metadata.artist =
            "Rádio Klub";

        metadata.albumName =
            "Rádio Klub – Živé vysielanie";


        mediaInfo.metadata =
            metadata;


        /*
        VYTVORENIE POŽIADAVKY
        */

        const request =
            new chrome.cast.media.LoadRequest(
                mediaInfo
            );


        request.autoplay = true;


        /*
        SPUSTENIE RÁDIA NA CHROMECAST
        */

        await castSession.loadMedia(
            request
        );


        console.log(
            "Rádio Klub hrá cez Google Cast."
        );


        /*
        ZASTAVÍ LOKÁLNY PREHRÁVAČ
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

        }


        /*
        Ak používaš premennú playing
        v stream.html
        */

        if (
            typeof playing !== "undefined"
        ) {

            playing = false;

        }

    } catch (error) {

        /*
        Používateľ môže jednoducho
        zavrieť okno s výberom zariadenia,
        preto chybu iba vypíšeme.
        */

        console.error(
            "Google Cast chyba:",
            error
        );

    }

}


/*
================================
UKONČENIE CAST
================================
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
