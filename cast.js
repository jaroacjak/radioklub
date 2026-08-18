const CAST_STREAM_URL =
    "https://listen.radioking.com/radio/917921/stream/988836";

const RADIO_LOGO_URL =
    "https://d3t3ozftmdmh3i.cloudfront.net/staging/podcast_uploaded_nologo/44153165/44153165-1756027969361-fe65b85dada35.jpg";

let castInitialized = false;


/* ==============================
   INICIALIZÁCIA
============================== */

function initializeCast() {

    if (castInitialized) {
        return;
    }

    try {

        const context =
            cast.framework.CastContext.getInstance();

        context.setOptions({
            receiverApplicationId:
                chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,

            autoJoinPolicy:
                chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });

        castInitialized = true;

        console.log(
            "Google Cast pripravený."
        );

    } catch (error) {

        console.error(
            "Google Cast inicializácia:",
            error
        );

    }
}


/* ==============================
   CAST TLAČIDLO
============================== */

async function startCast() {

    try {

        if (!castInitialized) {
            initializeCast();
        }


        const context =
            cast.framework.CastContext.getInstance();


        /*
         * AK UŽ JE PRIPOJENÝ
         * → ODPOJÍME HO
         */

        let session =
            context.getCurrentSession();

        if (session) {

            session.endSession(true);

            updateCastStatus("");

            console.log(
                "Google Cast odpojený."
            );

            return;
        }


        /*
         * AK NIE JE PRIPOJENÝ
         * → OTVORÍME VÝBER ZARIADENIA
         */

        await context.requestSession();


        session =
            context.getCurrentSession();


        if (!session) {

            console.log(
                "Nebolo vybrané Cast zariadenie."
            );

            return;
        }


        /*
         * STREAM
         */

        const mediaInfo =
            new chrome.cast.media.MediaInfo(
                CAST_STREAM_URL,
                "audio/mpeg"
            );


        mediaInfo.streamType =
            chrome.cast.media.StreamType.LIVE;


        /*
         * METADATA
         */

        const metadata =
            new chrome.cast.media.MusicTrackMediaMetadata();


        const songElement =
            document.getElementById(
                "songName"
            );


        let title =
            "Rádio Klub – Živé vysielanie";


        if (songElement) {

            const text =
                songElement.textContent.trim();

            if (text) {
                title = text;
            }
        }


        metadata.title =
            title;

        metadata.artist =
            "Rádio Klub";

        metadata.albumName =
            "Rádio Klub";


        metadata.images = [
            new chrome.cast.Image(
                RADIO_LOGO_URL
            )
        ];


        mediaInfo.metadata =
            metadata;


        /*
         * LOAD
         */

        const request =
            new chrome.cast.media.LoadRequest(
                mediaInfo
            );


        request.autoplay = true;


        await session.loadMedia(
            request
        );


        /*
         * ZASTAVÍME LOKÁLNE RÁDIO
         */

        const radio =
            document.getElementById(
                "radioPlayer"
            );


        const playButton =
            document.getElementById(
                "playButton"
            );


        if (radio) {
            radio.pause();
        }


        if (playButton) {

            playButton.innerHTML =
                "▶";

            playButton.title =
                "Prehrať rádio";

        }


        if (
            typeof playing !== "undefined"
        ) {
            playing = false;
        }


        updateCastStatus(
            "📺 Rádio Klub hrá cez Google Cast"
        );


        console.log(
            "Rádio Klub odoslané na Chromecast."
        );


    } catch (error) {

        console.error(
            "Google Cast chyba:",
            error
        );

        updateCastStatus(
            "Google Cast sa nepodarilo pripojiť."
        );

    }

}


/* ==============================
   STAV
============================== */

function updateCastStatus(text) {

    const element =
        document.getElementById(
            "castStatus"
        );

    if (element) {
        element.textContent = text;
    }

}


/* ==============================
   AUTOMATICKÁ INICIALIZÁCIA
============================== */

function onCastReady() {

    if (
        typeof cast !== "undefined" &&
        typeof chrome !== "undefined"
    ) {

        initializeCast();

    }

}


/* ==============================
   GOOGLE CAST SDK CALLBACK
============================== */

window.__onGCastApiAvailable =
    function(isAvailable) {

        if (isAvailable) {

            onCastReady();

        } else {

            console.error(
                "Google Cast SDK nie je dostupné."
            );

        }

    };
