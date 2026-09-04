/* ==========================================
   BHRIGHU ADVENTURE
   CERTIFICATE VERIFICATION
========================================== */

const manualCertificateId =
    document.getElementById(
        "manualCertificateId"
    );

const manualVerifyBtn =
    document.getElementById(
        "manualVerifyBtn"
    );

const verificationResult =
    document.getElementById(
        "verificationResult"
    );


/* ==========================================
   VERIFY CERTIFICATE
========================================== */

async function verifyCertificateById(
    certificateId
) {

    if (!certificateId) {

        showInvalidCertificate(
            "Not provided",
            "Please enter a certificate ID."
        );

        return;
    }


    certificateId =
        certificateId
            .trim()
            .toUpperCase();


    console.log(
        "Verifying certificate:",
        certificateId
    );


    if (verificationResult) {

        verificationResult.innerHTML = `
            <div class="verify-loading">
                Verifying certificate...
            </div>
        `;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("certificates")
            .select("*")
            .eq(
                "id",
                certificateId
            )
            .maybeSingle();


        if (error) {

            console.error(
                "Certificate verification error:",
                error
            );

            showInvalidCertificate(
                certificateId,
                "Unable to verify this certificate."
            );

            return;
        }


        console.log(
            "Certificate result:",
            data
        );


        if (!data) {

            showInvalidCertificate(
                certificateId,
                "This certificate ID was not found in the official Bhrighu Adventure register."
            );

            return;
        }


        showValidCertificate(
            data
        );


    } catch (error) {

        console.error(
            "Certificate connection error:",
            error
        );


        showInvalidCertificate(
            certificateId,
            "Unable to connect to the certificate register."
        );
    }
}


/* ==========================================
   VALID CERTIFICATE
========================================== */

function showValidCertificate(
    certificate
) {

    if (!verificationResult) {
        return;
    }


    verificationResult.innerHTML = `

        <div class="verify-status-icon valid">
            ✓
        </div>


        <h2>
            CERTIFICATE VERIFIED
        </h2>


        <p class="verify-message">
            This certificate is valid and officially
            registered with Bhrighu Adventure.
        </p>


        <div class="verification-details">


            <div class="verify-row">

                <span>
                    Participant
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificate.participant
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Course
                </span>

                <strong>
                    5-Day Rock Climbing Workshop
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Completion Date
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificate.completion_date
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Location
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificate.location
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Batch / Group
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificate.batch
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Certificate ID
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificate.id
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Status
                </span>

                <strong class="verified-text">
                    ${escapeCertificateHtml(
                        certificate.status ||
                        "Valid"
                    )}
                </strong>

            </div>


        </div>
    `;
}


/* ==========================================
   INVALID CERTIFICATE
========================================== */

function showInvalidCertificate(
    certificateId,
    message
) {

    if (!verificationResult) {
        return;
    }


    verificationResult.innerHTML = `

        <div class="verify-status-icon invalid">
            ×
        </div>


        <h2>
            CERTIFICATE NOT VERIFIED
        </h2>


        <p class="verify-message">
            ${escapeCertificateHtml(
                message
            )}
        </p>


        <div class="verification-details">


            <div class="verify-row">

                <span>
                    Certificate ID
                </span>

                <strong>
                    ${escapeCertificateHtml(
                        certificateId
                    )}
                </strong>

            </div>


            <div class="verify-row">

                <span>
                    Status
                </span>

                <strong>
                    Not found in official register
                </strong>

            </div>


        </div>
    `;
}


/* ==========================================
   MANUAL VERIFY BUTTON
========================================== */

if (
    manualVerifyBtn &&
    manualCertificateId
) {

    manualVerifyBtn.addEventListener(
        "click",
        function () {

            const certificateId =
                manualCertificateId
                    .value
                    .trim();


            verifyCertificateById(
                certificateId
            );
        }
    );
}


/* ==========================================
   PRESS ENTER TO VERIFY
========================================== */

if (manualCertificateId) {

    manualCertificateId.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                verifyCertificateById(
                    manualCertificateId
                        .value
                        .trim()
                );
            }
        }
    );
}


/* ==========================================
   VERIFY FROM QR / URL
========================================== */

const verificationParams =
    new URLSearchParams(
        window.location.search
    );


const urlCertificateId =
    verificationParams.get(
        "id"
    );


if (urlCertificateId) {

    if (manualCertificateId) {

        manualCertificateId.value =
            urlCertificateId;
    }


    verifyCertificateById(
        urlCertificateId
    );
}


/* ==========================================
   SAFE HTML
========================================== */

function escapeCertificateHtml(
    value
) {

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