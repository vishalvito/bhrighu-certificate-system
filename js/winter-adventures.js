document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("winterEnquiryForm");

    const messageBox =
        document.getElementById("winterEnquiryMessage");

    const activitySelect =
        document.getElementById("winterActivity");

    const enquiryButtons =
        document.querySelectorAll(".winter-enquiry-button");


    /* ==========================================
       SHOW MESSAGE
    ========================================== */

    function showMessage(message, type) {

        if (!messageBox) return;

        messageBox.textContent = message;

        messageBox.classList.remove(
            "success",
            "error"
        );

        messageBox.classList.add(type);

        messageBox.style.display = "block";
    }


    /* ==========================================
       CREATE UNIQUE ENQUIRY ID
    ========================================== */

    function createEnquiryId() {

        const time = Date.now()
            .toString()
            .slice(-8);

        const random = Math.floor(
            100 + Math.random() * 900
        );

        return `BA-WIN-${time}${random}`;
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


        return "winter_adventures_page";
    }


    /* ==========================================
       WINTER EXPERIENCE BUTTONS
    ========================================== */

    enquiryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const activity =
                    button.dataset.activity;

                if (
                    activitySelect &&
                    activity
                ) {

                    activitySelect.value =
                        activity;

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
       FORM
    ========================================== */

    if (!form) return;


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const selectedActivity =
                activitySelect.value.trim();

            const fullName =
                document
                    .getElementById(
                        "winterName"
                    )
                    .value
                    .trim();

            const phone =
                document
                    .getElementById(
                        "winterPhone"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "winterEmail"
                    )
                    .value
                    .trim();

            const participants =
                document
                    .getElementById(
                        "winterParticipants"
                    )
                    .value;

            const preferredDate =
                document
                    .getElementById(
                        "winterDate"
                    )
                    .value;

            const experience =
                document
                    .getElementById(
                        "winterExperience"
                    )
                    .value;

            const customerMessage =
                document
                    .getElementById(
                        "winterMessage"
                    )
                    .value
                    .trim();


            /* ==================================
               VALIDATION
            ================================== */

            if (!selectedActivity) {

                showMessage(
                    "Please select a winter experience.",
                    "error"
                );

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
                    "The enquiry system is temporarily unavailable. Please try again.",
                    "error"
                );

                return;
            }


            /* ==================================
               BUILD MESSAGE
            ================================== */

            const messageParts = [];


            if (participants) {

                messageParts.push(
                    `Participants: ${participants}`
                );

            }


            if (experience) {

                messageParts.push(
                    `Experience: ${experience}`
                );

            }


            if (customerMessage) {

                messageParts.push(
                    `Customer Message: ${customerMessage}`
                );

            }


            const finalMessage =
                messageParts.join(" | ");


            /* ==================================
               ENQUIRY DATA
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
                    experience || null,

                preferred_date:
                    preferredDate || null,

                message:
                    finalMessage,

                course:
                    selectedActivity,

                status:
                    "New",

                source:
                    getSource()

            };


            /* ==================================
               BUTTON STATE
            ================================== */

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            const originalButtonText =
                submitButton.textContent;


            submitButton.disabled = true;

            submitButton.textContent =
                "Sending Enquiry...";


            /* ==================================
               SEND TO SUPABASE
            ================================== */

            try {

                const { error } =
                    await supabaseClient
                        .from(
                            "course_enquiries"
                        )
                        .insert([
                            enquiryData
                        ]);


                if (error) {

                    console.error(
                        "Winter enquiry error:",
                        error
                    );

                    throw error;
                }


                /* ==============================
                   SUCCESS
                ============================== */

                showMessage(
                    `Thank you. Your ${selectedActivity} enquiry has been sent successfully. Our team will contact you.`,
                    "success"
                );


                form.reset();


                document
                    .getElementById(
                        "winterParticipants"
                    )
                    .value = "1";


            } catch (error) {

                console.error(
                    "Unable to submit winter enquiry:",
                    error
                );


                showMessage(
                    "We could not send your enquiry. Please try again.",
                    "error"
                );


            } finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalButtonText;

            }

        }
    );

});