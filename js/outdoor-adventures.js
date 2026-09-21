document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("outdoorEnquiryForm");

    const messageBox =
        document.getElementById("outdoorEnquiryMessage");

    const activitySelect =
        document.getElementById("activitySelect");

    const enquiryButtons =
        document.querySelectorAll(".activity-enquiry-button");


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

        return `BA-OUT-${time}${random}`;
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


        return "outdoor_adventures_page";
    }


    /* ==========================================
       ACTIVITY BUTTONS
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
       FORM SUBMISSION
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
                        "outdoorName"
                    )
                    .value
                    .trim();

            const phone =
                document
                    .getElementById(
                        "outdoorPhone"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "outdoorEmail"
                    )
                    .value
                    .trim();

            const participants =
                document
                    .getElementById(
                        "outdoorParticipants"
                    )
                    .value;

            const preferredDate =
                document
                    .getElementById(
                        "outdoorDate"
                    )
                    .value;

            const experience =
                document
                    .getElementById(
                        "outdoorExperience"
                    )
                    .value;

            const customerMessage =
                document
                    .getElementById(
                        "outdoorMessage"
                    )
                    .value
                    .trim();


            /* ==================================
               VALIDATION
            ================================== */

            if (!selectedActivity) {

                showMessage(
                    "Please select an adventure.",
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
               DATA FOR EXISTING DASHBOARD
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
               SUBMIT BUTTON STATE
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
                        "Outdoor enquiry error:",
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
                        "outdoorParticipants"
                    )
                    .value = "1";


            } catch (error) {

                console.error(
                    "Unable to submit enquiry:",
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