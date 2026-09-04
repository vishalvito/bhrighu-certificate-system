/* ==========================================
   BHRIGHU ADVENTURE
   ROCK CLIMBING COURSE PAGE
========================================== */


const courseHeader =
    document.querySelector(
        ".course-header"
    );


const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const courseNavLinks =
    document.querySelectorAll(
        ".course-nav a"
    );


const faqItems =
    document.querySelectorAll(
        ".faq-item"
    );


/* ==========================================
   NAVBAR SCROLL
========================================== */

window.addEventListener(
    "scroll",
    function() {

        if (!courseHeader) return;


        if (window.scrollY > 40) {

            courseHeader
                .classList
                .add(
                    "scrolled"
                );

        } else {

            courseHeader
                .classList
                .remove(
                    "scrolled"
                );

        }

    }
);


/* ==========================================
   MOBILE MENU
========================================== */

if (
    menuToggle &&
    courseHeader
) {

    menuToggle.addEventListener(
        "click",
        function() {

            courseHeader
                .classList
                .toggle(
                    "menu-open"
                );

        }
    );

}


/* ==========================================
   CLOSE MENU AFTER LINK CLICK
========================================== */

courseNavLinks.forEach(
    function(link) {

        link.addEventListener(
            "click",
            function() {

                if (!courseHeader) return;

                courseHeader
                    .classList
                    .remove(
                        "menu-open"
                    );

            }
        );

    }
);


/* ==========================================
   FAQ ACCORDION
========================================== */

faqItems.forEach(
    function(item) {

        const question =
            item.querySelector(
                ".faq-question"
            );

        const answer =
            item.querySelector(
                ".faq-answer"
            );


        if (
            !question ||
            !answer
        ) {

            return;

        }


        question.addEventListener(
            "click",
            function() {

                const isOpen =
                    item.classList
                        .contains(
                            "active"
                        );


                faqItems.forEach(
                    function(otherItem) {

                        otherItem
                            .classList
                            .remove(
                                "active"
                            );


                        const otherAnswer =
                            otherItem
                                .querySelector(
                                    ".faq-answer"
                                );


                        if (otherAnswer) {

                            otherAnswer
                                .style
                                .maxHeight =
                                null;

                        }

                    }
                );


                if (!isOpen) {

                    item
                        .classList
                        .add(
                            "active"
                        );


                    answer
                        .style
                        .maxHeight =
                        answer.scrollHeight +
                        "px";

                }

            }
        );

    }
);


/* ==========================================
   COURSE BOOKING FORM
========================================== */

const bookingModal =
    document.getElementById(
        "bookingModal"
    );

const bookingModalClose =
    document.getElementById(
        "bookingModalClose"
    );

const bookingButtons =
    document.querySelectorAll(
        ".open-booking-form"
    );

const bookingBackdrop =
    document.querySelector(
        ".booking-modal-backdrop"
    );

const courseBookingForm =
    document.getElementById(
        "courseBookingForm"
    );


function openBookingModal() {

    if (!bookingModal) return;

    bookingModal.classList.add(
        "active"
    );

    bookingModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "booking-modal-open"
    );

}


function closeBookingModal() {

    if (!bookingModal) return;

    bookingModal.classList.remove(
        "active"
    );

    bookingModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "booking-modal-open"
    );

}


bookingButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            openBookingModal
        );

    }
);


if (bookingModalClose) {

    bookingModalClose.addEventListener(
        "click",
        closeBookingModal
    );

}


if (bookingBackdrop) {

    bookingBackdrop.addEventListener(
        "click",
        closeBookingModal
    );

}


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeBookingModal();

        }

    }
);

/* ==========================================
   FORM SUBMISSION
   SUPABASE → WHATSAPP
========================================== */

if (courseBookingForm) {

    courseBookingForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();
            
            const whatsappWindow =
    window.open(
        "",
        "_blank"
    );

            const submitButton =
                courseBookingForm.querySelector(
                    ".booking-submit-btn"
                );


            /* ======================================
               GET FORM VALUES
            ====================================== */

            const name =
                document.getElementById(
                    "bookingName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "bookingPhone"
                ).value.trim();


            const email =
                document.getElementById(
                    "bookingEmail"
                ).value.trim();


            const age =
                document.getElementById(
                    "bookingAge"
                ).value;


            const location =
                document.getElementById(
                    "bookingLocation"
                ).value.trim();


            const participants =
                document.getElementById(
                    "bookingParticipants"
                ).value;


            const experience =
                document.getElementById(
                    "bookingExperience"
                ).value;


            const preferredDate =
                document.getElementById(
                    "bookingDate"
                ).value;


            const message =
                document.getElementById(
                    "bookingMessage"
                ).value.trim();


            /* ======================================
               CREATE UNIQUE ENQUIRY ID
            ====================================== */

            const enquiryId =
                "BA-RC-" +
                Date.now()
                    .toString()
                    .slice(-8);


            /* ======================================
               BUTTON LOADING STATE
            ====================================== */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Saving Enquiry...";

            }


            try {

/* ==================================
   TRACK ENQUIRY SOURCE
================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const utmSource =
    params.get("utm_source");

const utmMedium =
    params.get("utm_medium");

let enquirySource = "direct";

if (
    utmSource === "instagram" &&
    utmMedium === "bio"
) {
    enquirySource = "instagram_bio";
}

if (
    utmSource === "instagram" &&
    utmMedium === "story"
) {
    enquirySource = "instagram_story";
}
                /* ==================================
                   SAVE ENQUIRY TO SUPABASE
                ================================== */

                const {
                    error
                } = await supabaseClient
                    .from(
                        "course_enquiries"
                    )
                    .insert([
                        {

                            enquiry_id:
                                enquiryId,

                            full_name:
                                name,

                            phone:
                                phone,

                            email:
                                email || null,

                            age:
                                age
                                    ? Number(age)
                                    : null,

                            location:
                                location,

                            participants:
                                participants,

                            experience:
                                experience,

                            preferred_date:
                                preferredDate || null,

                            message:
                                message || null,

                            course:
                                "5-Day Rock Climbing Course",

                            status:
                                "New",
                            source: enquirySource    

                        }
                    ]);


                /* ==================================
                   CHECK DATABASE ERROR
                ================================== */

                if (error) {

                    console.error(
                        "Supabase enquiry error:",
                        error
                    );

                    if (whatsappWindow) {
    whatsappWindow.close();
}


                   alert(
        `Supabase Error:

${error.message}

Code: ${error.code || "No code"}

Details: ${error.details || "No details"}`
    );

    return;
}


                console.log(
                    "Enquiry saved:",
                    enquiryId
                );


                /* ==================================
                   CREATE WHATSAPP MESSAGE
                ================================== */

                const whatsappMessage =

`Hello Bhrighu Adventure,

I would like to enquire about the 5-Day Rock Climbing Course.

Enquiry ID: ${enquiryId}

Name: ${name}
Phone / WhatsApp: ${phone}
Email: ${email || "Not provided"}
Age: ${age || "Not provided"}
From: ${location}

Participants: ${participants}
Climbing Experience: ${experience}

Preferred Start Date:
${preferredDate || "Flexible"}

Message:
${message || "No additional message"}

Please send me the available batch and booking details.`;


                /* ==================================
                   YOUR WHATSAPP NUMBER
                ================================== */

                const whatsappNumber =
                    "919882162308";


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        whatsappMessage
                    )}`;


                /* ==================================
                   SUCCESS
                ================================== */

                alert(
                    `Enquiry saved successfully!

Your Enquiry ID:

${enquiryId}`
                );


                /* ==================================
                   OPEN WHATSAPP
                ================================== */

               if (whatsappWindow) {

    whatsappWindow.location.href =
        whatsappURL;

} else {

    window.location.href =
        whatsappURL;

}


                /* ==================================
                   CLEAR FORM
                ================================== */

                courseBookingForm.reset();


                /* ==================================
                   CLOSE FORM
                ================================== */

                closeBookingModal();


            } catch (error) {


                console.error(
                    "Booking form error:",
                    error
                );

                if (whatsappWindow) {
    whatsappWindow.close();
}


                alert(
                    "Something went wrong. Please try again."
                );


            } finally {


                /* ==================================
                   RESTORE BUTTON
                ================================== */

                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        `Send Booking Enquiry <span>→</span>`;

                }

            }

        }
    );

}