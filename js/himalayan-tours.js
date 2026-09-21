/* ==========================================
   BHRIGHU ADVENTURE
   HIMALAYAN TOURS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("tourEnquiryForm");

    const messageBox =
        document.getElementById("tourEnquiryMessage");

    const tourSelect =
        document.getElementById("tourSelect");

    const enquiryButtons =
        document.querySelectorAll(
            ".tour-enquiry-button"
        );


    /* ==========================================
       MESSAGE
    ========================================== */

    function showMessage(message, type) {

        if (!messageBox) return;

        messageBox.textContent = message;

        messageBox.className =
            "form-message " + type;

    }


    /* ==========================================
       CREATE UNIQUE ENQUIRY ID
    ========================================== */

    function createEnquiryId() {

        const time =
            Date.now()
                .toString()
                .slice(-8);

        const random =
            Math.floor(
                1000 + Math.random() * 9000
            );

        return `BA-TOUR-${time}${random}`;

    }


    /* ==========================================
       TRACK ENQUIRY SOURCE
    ========================================== */

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


        return "himalayan_tours_page";

    }


    /* ==========================================
       TOUR BUTTONS
       AUTO SELECT TOUR + OPEN FORM
    ========================================== */

    enquiryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selectedTour =
                    button.dataset.tour;


                if (
                    selectedTour &&
                    tourSelect
                ) {

                    tourSelect.value =
                        selectedTour;

                }


                const enquirySection =
                    document.getElementById(
                        "enquire"
                    );


                if (enquirySection) {

                    enquirySection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


    /* ==========================================
       FORM SUBMISSION
    ========================================== */

    if (!form) {

        console.error(
            "Tour enquiry form not found."
        );

        return;

    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            const selectedTour =
                tourSelect.value.trim();


            const fullName =
                document
                    .getElementById("tourName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("tourPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("tourEmail")
                    .value
                    .trim();


            const participants =
                document
                    .getElementById(
                        "tourParticipants"
                    )
                    .value;


            const preferredDate =
                document
                    .getElementById("tourDate")
                    .value;


            const travelStyle =
                document
                    .getElementById(
                        "tourExperience"
                    )
                    .value;


            const customerMessage =
                document
                    .getElementById(
                        "tourMessage"
                    )
                    .value
                    .trim();


            /* ==================================
               VALIDATION
            ================================== */

            if (!selectedTour) {

                showMessage(
                    "Please select a tour.",
                    "error"
                );

                tourSelect.focus();

                return;

            }


            if (!fullName) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                return;

            }


            if (!phone) {

                showMessage(
                    "Please enter your phone or WhatsApp number.",
                    "error"
                );

                return;

            }


            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                console.error(
                    "Supabase client is not available."
                );

                showMessage(
                    "Unable to connect to the booking system. Please try again.",
                    "error"
                );

                return;

            }


            /* ==================================
               BUILD DASHBOARD MESSAGE
            ================================== */

            const messageParts = [];


            if (participants) {

                messageParts.push(
                    `Travellers: ${participants}`
                );

            }


            if (travelStyle) {

                messageParts.push(
                    `Travel Style: ${travelStyle}`
                );

            }


            if (customerMessage) {

                messageParts.push(
                    `Customer Message: ${customerMessage}`
                );

            }


            const finalMessage =
                messageParts.length
                    ? messageParts.join(" | ")
                    : null;


            /* ==================================
               SUPABASE DATA
            ================================== */

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
                    travelStyle || null,

                preferred_date:
                    preferredDate || null,

                message:
                    finalMessage,

                course:
                    selectedTour,

                status:
                    "New",

                source:
                    getSource()

            };


            /* ==================================
               SEND
            ================================== */

            try {

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Sending Enquiry...";

                }


                showMessage(
                    "Sending your enquiry...",
                    "success"
                );


                /*
                    IMPORTANT:
                    Insert only.

                    Do not add .select() here because
                    public visitors have INSERT access,
                    not public SELECT access.
                */

                const { error } =
                    await supabaseClient
                        .from(
                            "course_enquiries"
                        )
                        .insert([
                            enquiryData
                        ]);


                if (error) {

                    throw error;

                }


                showMessage(
                    `Thank you. Your ${selectedTour} enquiry has been sent successfully. Our team will contact you.`,
                    "success"
                );


                form.reset();


                document
                    .getElementById(
                        "tourParticipants"
                    )
                    .value = "1";


            } catch (error) {

                console.error(
                    "Tour enquiry error:",
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
                        "Send Tour Enquiry →";

                }

            }

        }
    );

});