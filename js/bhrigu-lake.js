/* =========================================================
   BHRIGU LAKE TREK
   Enquiry Form
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("bhriguEnquiryForm");

    const messageBox =
        document.getElementById("bhriguEnquiryMessage");

    if (!form) {
        console.warn("Bhrigu Lake enquiry form not found.");
        return;
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(message, type) {

        if (!messageBox) {
            return;
        }

        messageBox.textContent = message;

        messageBox.className =
            `form-message ${type}`;

    }


    /* =====================================================
       CREATE UNIQUE ENQUIRY ID
    ===================================================== */

    function createEnquiryId() {

        const time =
            Date.now()
                .toString()
                .slice(-9);

        const random =
            Math.floor(
                100 + Math.random() * 900
            );

        return `BA-BL-${time}${random}`;

    }


    /* =====================================================
       SOURCE TRACKING
    ===================================================== */

    function getSource() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const source =
            (
                params.get("utm_source") || ""
            ).toLowerCase();

        const medium =
            (
                params.get("utm_medium") || ""
            ).toLowerCase();


        if (
            source === "instagram" &&
            medium === "bio"
        ) {
            return "instagram_bio";
        }


        if (
            source === "instagram" &&
            medium === "story"
        ) {
            return "instagram_story";
        }


        if (source === "whatsapp") {
            return "whatsapp";
        }


        return "bhrigu_lake_page";

    }


    /* =====================================================
       SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* -------------------------------------------------
               FORM VALUES
            ------------------------------------------------- */

            const fullName =
                document
                    .getElementById("trekName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("trekPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("trekEmail")
                    .value
                    .trim();


            const participants =
                document
                    .getElementById("trekParticipants")
                    .value;


            const preferredDate =
                document
                    .getElementById("trekDate")
                    .value;


            const experience =
                document
                    .getElementById("trekExperience")
                    .value;


            const customerMessage =
                document
                    .getElementById("trekMessage")
                    .value
                    .trim();


            /* -------------------------------------------------
               BASIC VALIDATION
            ------------------------------------------------- */

            if (!fullName || !phone) {

                showMessage(
                    "Please enter your name and phone number.",
                    "error"
                );

                return;

            }


            if (
                typeof supabaseClient === "undefined"
            ) {

                console.error(
                    "supabaseClient is not available."
                );

                showMessage(
                    "The enquiry system is temporarily unavailable. Please try again.",
                    "error"
                );

                return;

            }


            /* -------------------------------------------------
               BUTTON STATE
            ------------------------------------------------- */

            const submitButton =
                form.querySelector(
                    ".enquiry-submit"
                );


            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";

            }


            /* -------------------------------------------------
               MESSAGE STORED IN DATABASE
            ------------------------------------------------- */

            let finalMessage =
                `Participants: ${participants || "1"}`;


            if (customerMessage) {

                finalMessage +=
                    `\nMessage: ${customerMessage}`;

            }


            /* -------------------------------------------------
               DATABASE RECORD

               IMPORTANT:
               "location" is included because the existing
               course_enquiries table requires it.
            ------------------------------------------------- */

            const enquiryData = {

                enquiry_id:
                    createEnquiryId(),

                full_name:
                    fullName,

                phone:
                    phone,

                email:
                    email || null,

                location:
                    "Manali, Himachal Pradesh",

                experience:
                    experience || null,

                preferred_date:
                    preferredDate || null,

                message:
                    finalMessage,

                course:
                    "Bhrigu Lake Trek",

                status:
                    "New",

                source:
                    getSource()

            };


            console.log(
                "Sending Bhrigu Lake enquiry:",
                enquiryData
            );


            /* -------------------------------------------------
               SEND TO SUPABASE

               No .select() here.
               Public website only needs INSERT permission.
            ------------------------------------------------- */

            try {

                const { error } =
                    await supabaseClient
                        .from("course_enquiries")
                        .insert([enquiryData]);


                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    throw error;

                }


                console.log(
                    "BHRIGU LAKE ENQUIRY SAVED"
                );


                /* ---------------------------------------------
                   SUCCESS
                --------------------------------------------- */

                showMessage(
                    "Thank you. Your Bhrigu Lake Trek enquiry has been sent successfully. Our team will contact you.",
                    "success"
                );


                form.reset();


                const participantsInput =
                    document.getElementById(
                        "trekParticipants"
                    );


                if (participantsInput) {

                    participantsInput.value = "1";

                }


            } catch (error) {

                console.error(
                    "ENQUIRY FAILED:",
                    error
                );


                showMessage(
                    "We could not send your enquiry. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

});