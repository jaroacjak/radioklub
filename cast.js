async function startCast() {

    try {

        const castContext =
            cast.framework.CastContext.getInstance();

        const castSession =
            castContext.getCurrentSession();


        /*
        ========================================
        AK UŽ JE CHROMECAST PRIPOJENÝ
        DRUHÝ KLIK HO ODPOJÍ
        ========================================
        */

        if (castSession) {

            castSession.endSession(true);

            console.log(
                "Google Cast odpojený."
            );

            const castStatus =
                document.getElementById("castStatus");

            if (castStatus) {
                castStatus.textContent = "";
            }

            return;
        }


        /*
        ========================================
        NIE JE PRIPOJENÝ
        OTVORÍME VÝBER ZARIADENIA
        ========================================
        */

        await castContext.requestSession();


        const newSession =
            castContext.getCurrentSession();


        if (!newSession) {

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
            document.getElementById("songName");


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


        metadata.images = [

            new chrome.cast.Image(
                RADIO_LOGO_URL
            )

        ];


        mediaInfo.metadata =
            metadata;


        /*
        ========================================
        PREHRÁVANIE
        ========================================
        */

        const request =
            new chrome.cast.media.LoadRequest(
                mediaInfo
            );


        request.autoplay = true;


        await newSession.loadMedia(
            request
        );


        /*
        ========================================
        ZASTAVÍ LOKÁLNE RÁDIO
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


        if (
            typeof playing !== "undefined"
        ) {

            playing = false;

        }


        /*
        ========================================
        STAV
        ========================================
        */

        const castStatus =
            document.getElementById(
                "castStatus"
            );


        if (castStatus) {

            castStatus.textContent =
                "📺 Prehráva sa cez Google Cast";

        }


        console.log(
            "Rádio Klub sa prehráva cez Google Cast."
        );


    } catch (error) {

        console.error(
            "Google Cast chyba:",
            error
        );

    }

}
