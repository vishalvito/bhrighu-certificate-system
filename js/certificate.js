/* ==========================================
   BHRIGHU ADVENTURE
   DIGITAL CERTIFICATE GENERATOR
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const certificateForm =
    document.getElementById("certificateForm");

const participantName =
    document.getElementById("participantName");

const completionDate =
    document.getElementById("completionDate");

const locationInput =
    document.getElementById("location");

const batchInput =
    document.getElementById("batch");

const certificateNumber =
    document.getElementById("certificateNumber");

const certificateQr =
    document.getElementById("certificateQr");  

const generatePdfBtn =
    document.getElementById("generatePdfBtn");
    let certificateIssued = false;

const certificateCanvas =
    document.getElementById("certificateCanvas");    

const issueCertificateBtn =
    document.getElementById("issueCertificateBtn");

const newCertificateBtn =
    document.getElementById("newCertificateBtn");    

const issuedList =
    document.getElementById("issuedList");

const issuedCount =
    document.getElementById("issuedCount");    


/* ==========================================
   CERTIFICATE PREVIEW ELEMENTS
========================================== */

const certificateName =
    document.getElementById("certificateName");

const certificateDate =
    document.getElementById("certificateDate");

const certificateLocation =
    document.getElementById("certificateLocation");

const certificateBatch =
    document.getElementById("certificateBatch");

const previewCertificateId =
    document.getElementById("previewCertificateId");


/* ==========================================
   FORMAT CERTIFICATE NUMBER
========================================== */

function formatCertificateNumber(number) {

    return String(number).padStart(3, "0");

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(dateValue) {

    if (!dateValue) {
        return "DD MONTH YYYY";
    }

    const date =
        new Date(dateValue + "T00:00:00");

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* ==========================================
   GET YEAR
========================================== */

function getCertificateYear() {

    if (!completionDate.value) {
        return "YYYY";
    }

    const date =
        new Date(
            completionDate.value +
            "T00:00:00"
        );

    return date.getFullYear();

}


/* ==========================================
   GENERATE CERTIFICATE ID
========================================== */

function generateCertificateId() {

    const year =
        getCertificateYear();

    const number =
        formatCertificateNumber(
            certificateNumber.value || 1
        );

    return `BA-RCW-${year}-${number}`;

}

/* ==========================================
   FORMAT PARTICIPANT NAME
========================================== */

function formatParticipantName(name) {

    return name
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(word => word.length > 0)
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

}

/* ==========================================
   GENERATE QR CODE
========================================== */

function generateQrCode(certificateId) {

    if (!certificateQr) {
        return;
    }

    certificateQr.innerHTML = "";

  const verificationUrl =
    `https://vishalvito.github.io/bhrighu-certificate-system/verify.html?id=${certificateId}`;
   
   
   
    new QRCode(
        certificateQr,
        {
            text: verificationUrl,
            width: 180,
            height: 180,

            colorDark: "#111111",
            colorLight: "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );

}



/* ==========================================
   UPDATE CERTIFICATE
========================================== */

function updateCertificate() {

    /* NAME */

    certificateName.textContent =
    participantName.value.trim()
        ? formatParticipantName(
            participantName.value
        )
        : "";


    /* DATE */

    certificateDate.textContent =
        formatDate(
            completionDate.value
        );


    /* LOCATION */

    certificateLocation.textContent =
        locationInput.value.trim() ||
        "Manali, Himachal Pradesh";


    /* BATCH */

    certificateBatch.textContent =
        batchInput.value.trim() ||
        "MONTH YYYY / GROUP";


    /* CERTIFICATE ID */

   const certificateId =
    generateCertificateId();

previewCertificateId.textContent =
    certificateId;

generateQrCode(certificateId);

}
certificateIssued = false;

if (generatePdfBtn) {
    generatePdfBtn.disabled = true;
}


/* ==========================================
   CREATE SAFE FILE NAME
========================================== */

function createSafeFileName(name) {

    return name
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");

} 


/* ==========================================
   GENERATE PDF
========================================== */

async function generateCertificatePdf() {

    /* --------------------------------------
       CHECK REQUIRED INFORMATION
    -------------------------------------- */

    if (!participantName.value.trim()) {

        alert(
            "Please enter the participant name."
        );

        participantName.focus();

        return;
    }


    if (!completionDate.value) {

        alert(
            "Please select the completion date."
        );

        completionDate.focus();

        return;
    }


    if (!batchInput.value.trim()) {

        alert(
            "Please enter the batch or group."
        );

        batchInput.focus();

        return;
    }


    /* --------------------------------------
       UPDATE CERTIFICATE FIRST
    -------------------------------------- */

    updateCertificate();


    /* --------------------------------------
       BUTTON LOADING STATE
    -------------------------------------- */

    const originalButtonText =
        generatePdfBtn.textContent;

    generatePdfBtn.textContent =
        "Generating PDF...";

    generatePdfBtn.disabled = true;


    try {

        /*
         * Give QR and browser a moment
         * to finish rendering.
         */

        await new Promise(
            resolve =>
                setTimeout(resolve, 700)
        );


        /* --------------------------------------
           CAPTURE CERTIFICATE
        -------------------------------------- */

        const canvas =
            await html2canvas(
                certificateCanvas,
                {
                    scale: 3,

                    useCORS: true,

                    backgroundColor:
                        "#ffffff",

                    logging: false
                }
            );


        /* --------------------------------------
           CONVERT TO IMAGE
        -------------------------------------- */

        const certificateImage =
            canvas.toDataURL(
                "image/jpeg",
                0.98
            );


        /* --------------------------------------
           CREATE LANDSCAPE A4 PDF
        -------------------------------------- */

        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });


        /* --------------------------------------
           A4 LANDSCAPE SIZE
        -------------------------------------- */

        const pdfWidth =
            pdf.internal
                .pageSize
                .getWidth();

        const pdfHeight =
            pdf.internal
                .pageSize
                .getHeight();


        /* --------------------------------------
           IMAGE DIMENSIONS
        -------------------------------------- */

        const imageWidth =
            canvas.width;

        const imageHeight =
            canvas.height;

        const imageRatio =
            imageWidth /
            imageHeight;


        const pageRatio =
            pdfWidth /
            pdfHeight;


        let finalWidth;
        let finalHeight;
        let x;
        let y;


        /*
         * Preserve the certificate ratio
         * so it doesn't stretch.
         */

        if (imageRatio > pageRatio) {

            finalWidth =
                pdfWidth;

            finalHeight =
                pdfWidth /
                imageRatio;

            x = 0;

            y =
                (
                    pdfHeight -
                    finalHeight
                ) / 2;

        } else {

            finalHeight =
                pdfHeight;

            finalWidth =
                pdfHeight *
                imageRatio;

            y = 0;

            x =
                (
                    pdfWidth -
                    finalWidth
                ) / 2;

        }


        /* --------------------------------------
           ADD CERTIFICATE
        -------------------------------------- */

        pdf.addImage(
            certificateImage,
            "JPEG",
            x,
            y,
            finalWidth,
            finalHeight,
            undefined,
            "FAST"
        );


        /* --------------------------------------
           CREATE FILE NAME
        -------------------------------------- */

        const certificateId =
            generateCertificateId();

        const participant =
            createSafeFileName(
                formatParticipantName(
                    participantName.value
                )
            );


        const fileName =
            `Bhrighu-Certificate-${certificateId}-${participant}.pdf`;


        /* --------------------------------------
           DOWNLOAD PDF
        -------------------------------------- */

        pdf.save(
            fileName
        );

    }

    catch (error) {

        console.error(
            "PDF generation error:",
            error
        );

        alert(
            "There was a problem generating the PDF. Please check the console."
        );

    }

    finally {

        generatePdfBtn.disabled =
            false;

        generatePdfBtn.textContent =
            originalButtonText;

    }

}

/* ==========================================
   CERTIFICATE STORAGE
========================================== */

function getIssuedCertificates() {

    return JSON.parse(
        localStorage.getItem(
            "bhrighuCertificates"
        )
    ) || [];

}


function saveIssuedCertificates(records) {

    localStorage.setItem(
        "bhrighuCertificates",
        JSON.stringify(records)
    );

}

/* ==========================================
   CREATE CERTIFICATE RECORD
========================================== */

function createCertificateRecord() {

    return {

        id:
            generateCertificateId(),

        participant:
            formatParticipantName(
                participantName.value
            ),

        completionDate:
            formatDate(
                completionDate.value
            ),

        rawDate:
            completionDate.value,

        location:
            locationInput.value.trim(),

        batch:
            batchInput.value.trim(),

        number:
            Number(
                certificateNumber.value
            ),

        issuedAt:
            new Date().toISOString(),

        status:
            "Valid"

    };

}

/* ==========================================
   CHECK DUPLICATE ID
========================================== */

function certificateExists(id) {

    const records =
        getIssuedCertificates();

    return records.some(
        record =>
            record.id === id
    );

}


function escapeCertificateHtml(value) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

/* ==========================================
   RENDER ISSUED CERTIFICATES FROM SUPABASE
========================================== */

async function renderIssuedCertificates() {

    if (!issuedList || !issuedCount) {
        return;
    }


    issuedList.innerHTML =
        `
        <p class="empty-register">
            Loading certificates...
        </p>
        `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("certificates")
                .select("*")
                .order(
                    "issued_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Certificate register error:",
                error
            );


            issuedList.innerHTML =
                `
                <p class="empty-register">
                    Could not load certificate register.
                </p>
                `;

            return;
        }


        const records =
            data || [];


        issuedCount.textContent =
            `${records.length} issued`;


        if (!records.length) {

            issuedList.innerHTML =
                `
                <p class="empty-register">
                    No certificates issued yet.
                </p>
                `;

            return;
        }


        issuedList.innerHTML =
            records
                .map(
                    record => {

                        return `
                            <div class="issued-card">

                                <div>

                                    <div class="issued-name">

                                        ${escapeCertificateHtml(
                                            record.participant
                                        )}

                                    </div>

                                    <div class="issued-id">

                                        ${escapeCertificateHtml(
                                            record.id
                                        )}

                                    </div>

                                </div>


                                <div class="issued-meta">

                                    ${escapeCertificateHtml(
                                        record.completion_date
                                    )}

                                    <br>

                                    ${escapeCertificateHtml(
                                        record.batch
                                    )}

                                </div>


                                <span class="issued-status">

                                    ${escapeCertificateHtml(
                                        record.status ||
                                        "Valid"
                                    )}

                                </span>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Certificate register connection error:",
            error
        );


        issuedList.innerHTML =
            `
            <p class="empty-register">
                Could not connect to the certificate register.
            </p>
            `;

    }

}

/* ==========================================
   ISSUE CERTIFICATE THROUGH SECURE SERVER
========================================== */

async function issueCertificate() {

    console.log(
        "SECURE ISSUE FUNCTION RUNNING"
    );


    /* ======================================
       VALIDATE FORM
    ====================================== */

    if (!participantName.value.trim()) {

        alert(
            "Please enter the participant name."
        );

        participantName.focus();

        return;
    }


    if (!completionDate.value) {

        alert(
            "Please select the completion date."
        );

        completionDate.focus();

        return;
    }


    if (!batchInput.value.trim()) {

        alert(
            "Please enter the batch or group."
        );

        batchInput.focus();

        return;
    }


    /* ======================================
       ASK FOR PRIVATE PASSPHRASE
    ====================================== */

    const adminSecret =
        prompt(
            "Enter the private certificate issuing passphrase:"
        );


    if (!adminSecret) {

        return;
    }


    /* ======================================
       CREATE CERTIFICATE DATA
    ====================================== */

    const certificateId =
        generateCertificateId();


    const record = {

        id:
            certificateId,

        participant:
            formatParticipantName(
                participantName.value
            ),

        completion_date:
            formatDate(
                completionDate.value
            ),

        raw_date:
            completionDate.value,

        location:
            locationInput.value.trim()
            || "Manali, Himachal Pradesh",

        batch:
            batchInput.value.trim(),

        certificate_number:
            Number(
                certificateNumber.value
            ),

        status:
            "Valid"

    };


    /* ======================================
       BUTTON LOADING STATE
    ====================================== */

    const originalText =
        issueCertificateBtn.textContent;


    issueCertificateBtn.disabled =
        true;

    issueCertificateBtn.textContent =
        "Issuing...";


    try {

        /* ======================================
           CALL SECURE EDGE FUNCTION
        ====================================== */

        const {
            data,
            error
        } = await supabaseClient
            .functions
            .invoke(
                "super-processor",
                {
                    body:
                        record,

                    headers: {
                        "x-admin-secret":
                            adminSecret
                    }
                }
            );


        /* ======================================
           EDGE FUNCTION ERROR
        ====================================== */

        if (error) {

            console.error(
                "Edge Function error:",
                error
            );


            let statusCode =
                error?.context?.status ||
                error?.status ||
                error?.statusCode ||
                null;


            let serverMessage =
                error?.message ||
                "Could not issue certificate.";


            /*
                Try reading JSON returned
                by the Edge Function.
            */

            try {

                if (
                    error?.context &&
                    typeof error.context.json
                        === "function"
                ) {

                    const serverError =
                        await error.context.json();


                    if (serverError?.error) {

                        serverMessage =
                            serverError.error;
                    }


                    if (
                        !statusCode &&
                        serverError?.status
                    ) {

                        statusCode =
                            serverError.status;
                    }
                }

            } catch (responseError) {

                console.warn(
                    "Could not read Edge Function error response:",
                    responseError
                );
            }


            /* ==================================
               FRIENDLY ERROR MESSAGES
            ================================== */

            if (statusCode === 401) {

                alert(
                    "Incorrect issuing passphrase."
                );

                return;
            }


            if (statusCode === 409) {

                alert(
                    `Certificate ${certificateId} already exists. Please use the next certificate number.`
                );


                await setNextCertificateNumber();

                return;
            }


            if (statusCode === 400) {

                alert(
                    serverMessage ||
                    "Some required certificate information is missing."
                );

                return;
            }


            if (statusCode === 500) {

                alert(
                    serverMessage ||
                    "The certificate server encountered an internal error."
                );

                return;
            }


            alert(
                serverMessage
            );

            return;
        }


        /* ======================================
           CHECK SERVER RESULT
        ====================================== */

        const result =
            data;


        if (
            !result ||
            result.success !== true
        ) {

            console.error(
                "Unexpected server response:",
                result
            );


            alert(
                result?.error ||
                "The certificate could not be issued."
            );

            return;
        }


        /* ======================================
           SUCCESS FROM SERVER
        ====================================== */

        console.log(
            "Certificate saved online:",
            result
        );


        certificateIssued =
            true;


        if (generatePdfBtn) {

            generatePdfBtn.disabled =
                false;
        }


        /* ======================================
           UPDATE CERTIFICATE REGISTER
        ====================================== */

        await renderIssuedCertificates();


        /* ======================================
           SUCCESS MESSAGE
        ====================================== */

        alert(
            `Certificate ${certificateId} issued successfully.`
        );


        /* ======================================
           PREPARE NEXT CERTIFICATE NUMBER
        ====================================== */

        await setNextCertificateNumber();


    } catch (error) {

        console.error(
            "Server connection error:",
            error
        );


        alert(
            "Could not connect to the certificate issuing server."
        );

    } finally {

        /* ======================================
           RESTORE BUTTON
        ====================================== */

        issueCertificateBtn.disabled =
            false;


        issueCertificateBtn.textContent =
            originalText;
    }

}


/* ==========================================
   SET NEXT CERTIFICATE NUMBER
   FROM ONLINE SUPABASE DATABASE
========================================== */

async function setNextCertificateNumber() {

    try {

        /* ======================================
           GET CERTIFICATE YEAR
        ====================================== */

        const currentYear =
            completionDate.value
                ? new Date(
                    completionDate.value +
                    "T00:00:00"
                ).getFullYear()
                : new Date().getFullYear();


        /* ======================================
           GET CERTIFICATES FROM SUPABASE
        ====================================== */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("certificates")
                .select(
                    "id, certificate_number"
                )
                .like(
                    "id",
                    `BA-RCW-${currentYear}-%`
                );


        /* ======================================
           DATABASE ERROR
        ====================================== */

        if (error) {

            console.error(
                "Certificate number lookup error:",
                error
            );

            setNextCertificateNumberLocal();

            return;
        }


        /* ======================================
           NO CERTIFICATES FOR THIS YEAR
        ====================================== */

        if (
            !data ||
            data.length === 0
        ) {

            certificateNumber.value =
                1;

            updateCertificate();

            return;
        }


        /* ======================================
           FIND HIGHEST NUMBER
        ====================================== */

        const numbers =
            data
                .map(
                    certificate =>
                        Number(
                            certificate.certificate_number
                        )
                )
                .filter(
                    number =>
                        Number.isFinite(number)
                );


        const highestNumber =
            numbers.length
                ? Math.max(...numbers)
                : 0;


        /* ======================================
           SET NEXT NUMBER
        ====================================== */

        certificateNumber.value =
            highestNumber + 1;


        updateCertificate();


        console.log(
            "Next online certificate number:",
            certificateNumber.value
        );


    } catch (error) {

        console.error(
            "Certificate number system error:",
            error
        );


        setNextCertificateNumberLocal();

    }

}


/* ==========================================
   LOCAL NUMBER FALLBACK
========================================== */

function setNextCertificateNumberLocal() {

    const records =
        getIssuedCertificates();


    if (!records.length) {

        certificateNumber.value =
            1;

        updateCertificate();

        return;

    }


    const currentYear =
        completionDate.value
            ? new Date(
                completionDate.value +
                "T00:00:00"
            ).getFullYear()
            : new Date().getFullYear();


    const sameYearRecords =
        records.filter(
            record =>
                record.id.includes(
                    `BA-RCW-${currentYear}-`
                )
        );


    if (!sameYearRecords.length) {

        certificateNumber.value =
            1;

        updateCertificate();

        return;

    }


    const highestNumber =
        Math.max(
            ...sameYearRecords.map(
                record =>
                    Number(record.number)
            )
        );


    certificateNumber.value =
        highestNumber + 1;


    updateCertificate();

}



/* ==========================================
   FORM SUBMIT
========================================== */

if (certificateForm) {

    certificateForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            updateCertificate();

        }
    );

}

/* ==========================================
   NEW CERTIFICATE
========================================== */

async function startNewCertificate() {

    participantName.value = "";

    batchInput.value = "";

    locationInput.value =
        "Manali, Himachal Pradesh";

    /*
     Keep the same completion date.
     This is useful when issuing multiple
     certificates for the same workshop batch.
    */

    await setNextCertificateNumber();

    updateCertificate();

    participantName.focus();

}

/* ==========================================
   LIVE PREVIEW
========================================== */

participantName.addEventListener(
    "input",
    updateCertificate
);

completionDate.addEventListener(
    "change",
    function() {

        setNextCertificateNumber();

    }
);

locationInput.addEventListener(
    "input",
    updateCertificate
);

batchInput.addEventListener(
    "input",
    updateCertificate
);

certificateNumber.addEventListener(
    "input",
    updateCertificate
);


/* ==========================================
   INITIALIZE
========================================== */

updateCertificate();
if (generatePdfBtn) {
    generatePdfBtn.disabled = true;
}

/* ==========================================
   GENERATE PDF BUTTON
========================================== */

if (generatePdfBtn) {

    generatePdfBtn.addEventListener(
        "click",
        generateCertificatePdf
    );

}

renderIssuedCertificates();

if (issueCertificateBtn) {

    issueCertificateBtn.addEventListener(
        "click",
        issueCertificate
    );

}

if (newCertificateBtn) {

    newCertificateBtn.addEventListener(
        "click",
        startNewCertificate
    );

}

setNextCertificateNumber();
