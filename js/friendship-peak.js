/* ==========================================
   BHRIGHU ADVENTURE
   FRIENDSHIP PEAK ENQUIRY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("friendshipEnquiryForm");

    const messageBox =
        document.getElementById("expeditionEnquiryMessage");


    if (!form) {
        console.error("Friendship Peak form not found.");
        return;
    }


    const submitButton =
        form.querySelector(".enquiry-submit");


    /* ==========================================
       SHOW MESSAGE
    ========================================== */

    function showMessage(text, type = "normal") {

        if (!messageBox) return;

        messageBox.style.display = "block";
        messageBox.textContent = text;


        if (type === "success") {

            messageBox.style.color = "#f2c94c";
            messageBox.style.borderColor = "#f2c94c";

        } else if (type === "error") {

            messageBox.style.color = "#ff8c8c";
            messageBox.style.borderColor = "#d96b6b";

        } else {

            messageBox.style.color = "#aaa";
            messageBox.style.borderColor =
                "rgba(255,255,255,.2)";
        }
    }


    /* ==========================================
       ENQUIRY ID
    ========================================== */

    function createEnquiryId() {

        const time =
            Date.now().toString().slice(-9);

        const random =
            Math.floor(100 + Math.random() * 900);

        return `BA-FP-${time}${random}`;
    }


    /* ==========================================
       SOURCE
    ========================================== */

    function getSource() {

        const params =
            new URLSearchParams(window.location.search);

        const source =
            (params.get("utm_source") || "")
                .toLowerCase();

        const medium =
            (params.get("utm_medium") || "")
                .toLowerCase();


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


        return "friendship_peak_page";
    }


    /* ==========================================
       SUBMIT FORM
    ========================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        /* ------------------------------------------
           READ FORM
        ------------------------------------------ */

        const fullName =
            document
                .getElementById("expeditionName")
                .value
                .trim();


        const phone =
            document
                .getElementById("expeditionPhone")
                .value
                .trim();


        const email =
            document
                .getElementById("expeditionEmail")
                .value
                .trim();


        const participants =
            document
                .getElementById("expeditionParticipants")
                .value;


        const preferredDate =
            document
                .getElementById("expeditionDate")
                .value;


        const experience =
            document
                .getElementById("expeditionExperience")
                .value;


        const customerMessage =
            document
                .getElementById("expeditionMessage")
                .value
                .trim();


        /* ------------------------------------------
           VALIDATION
        ------------------------------------------ */

        if (!fullName) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            return;
        }


        if (!phone) {

            showMessage(
                "Please enter your phone / WhatsApp number.",
                "error"
            );

            return;
        }


        if (typeof supabaseClient === "undefined") {

            showMessage(
                "Database connection is unavailable. Please refresh the page.",
                "error"
            );

            console.error("supabaseClient is undefined.");

            return;
        }


        /* ------------------------------------------
           MESSAGE
        ------------------------------------------ */

        let finalMessage =
            `Participants: ${participants}`;


        if (customerMessage) {

            finalMessage +=
                `\n\nCustomer Message: ${customerMessage}`;
        }


        /* ------------------------------------------
           DATABASE DATA

           These names match course_enquiries:
           enquiry_id
           full_name
           phone
           email
           experience
           preferred_date
           message
           course
           status
           source
        ------------------------------------------ */

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
        "Friendship Peak Expedition",

    status:
        "New",

    source:
        getSource()

};


        console.log(
            "Sending enquiry:",
            enquiryData
        );


        /* ------------------------------------------
           SEND TO SUPABASE
        ------------------------------------------ */

        try {

            submitButton.disabled = true;

            submitButton.textContent =
                "Sending Enquiry...";


            showMessage(
                "Sending your expedition enquiry..."
            );


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
                "FRIENDSHIP PEAK ENQUIRY SAVED"
            );


            form.reset();


            showMessage(
                "✓ Enquiry received. Bhrighu Adventure will contact you with Friendship Peak expedition details.",
                "success"
            );

        }

        catch (error) {

            console.error(
                "ENQUIRY FAILED:",
                error
            );


            showMessage(
                "We couldn't send your enquiry. Please try again.",
                "error"
            );

        }

        finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Send Expedition Enquiry →";
        }

    });

});
