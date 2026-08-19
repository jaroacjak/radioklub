/* =========================================
   RÁDIO KLUB – COMMENTS.JS
   ========================================= */

(function () {

    "use strict";

    const STORAGE_KEY =
        "radioklub_squid_game_comments";

    const form =
        document.getElementById("commentForm");

    const commentsList =
        document.getElementById("commentsList");

    const nameInput =
        document.getElementById("commentName");

    const textInput =
        document.getElementById("commentText");


    /* =========================================
       KONTROLA
       ========================================= */

    if (!form || !commentsList) {
        return;
    }


    /* =========================================
       NAČÍTANIE KOMENTÁROV
       ========================================= */

    function getComments() {

        try {

            return JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

        } catch (error) {

            console.error(
                "Nepodarilo sa načítať komentáre:",
                error
            );

            return [];

        }

    }


    /* =========================================
       ULOŽENIE KOMENTÁROV
       ========================================= */

    function saveComments(comments) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(comments)
        );

    }


    /* =========================================
       ZOBRAZENIE KOMENTÁRA
       ========================================= */

    function showComment(comment) {

        const commentElement =
            document.createElement("div");

        commentElement.className =
            "comment";


        const header =
            document.createElement("div");

        const name =
            document.createElement("strong");

        name.textContent =
            comment.name;


        const date =
            document.createElement("span");

        date.className =
            "comment-date";

        date.textContent =
            comment.date;


        header.appendChild(name);
        header.appendChild(date);


        const text =
            document.createElement("p");

        text.textContent =
            comment.text;


        commentElement.appendChild(header);
        commentElement.appendChild(text);


        commentsList.appendChild(
            commentElement
        );

    }


    /* =========================================
       ZOBRAZENIE VŠETKÝCH KOMENTÁROV
       ========================================= */

    function renderComments() {

        commentsList.innerHTML = "";

        const comments =
            getComments();


        if (comments.length === 0) {

            const empty =
                document.createElement("p");

            empty.textContent =
                "Zatiaľ tu nie sú žiadne komentáre.";

            empty.style.color =
                "#777";

            commentsList.appendChild(
                empty
            );

            return;

        }


        comments.forEach(
            function (comment) {

                showComment(comment);

            }
        );

    }


    /* =========================================
       PRIDANIE KOMENTÁRA
       ========================================= */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const text =
                textInput.value.trim();


            if (!name || !text) {

                alert(
                    "Vyplň meno aj komentár."
                );

                return;

            }


            if (name.length > 50) {

                alert(
                    "Meno môže mať maximálne 50 znakov."
                );

                return;

            }


            if (text.length > 500) {

                alert(
                    "Komentár môže mať maximálne 500 znakov."
                );

                return;

            }


            const comment = {

                name: name,

                text: text,

                date:
                    new Date()
                        .toLocaleString(
                            "sk-SK"
                        )

            };


            const comments =
                getComments();


            comments.push(
                comment
            );


            saveComments(
                comments
            );


            form.reset();


            renderComments();


            commentsList.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );


    /* =========================================
       SPUSTENIE
       ========================================= */

    renderComments();


})();
