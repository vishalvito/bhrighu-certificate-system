console.log("Bhrighu Admin App loaded.");


/* =========================================
   ELEMENTS
========================================= */

const loginSection =
    document.getElementById("loginSection");

const adminSection =
    document.getElementById("adminSection");

const adminPin =
    document.getElementById("adminPin");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const enquiryList =
    document.getElementById("enquiryList");

const searchEnquiries =
    document.getElementById("searchEnquiries");

const totalCount =
    document.getElementById("totalCount");

const newCount =
    document.getElementById("newCount");

const confirmedCount =
    document.getElementById("confirmedCount");

const certificateCount =
    document.getElementById("certificateCount");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================
   DATA
========================================= */

let currentAdminPin = "";
let allEnquiries = [];


/* =========================================
   LOGIN
========================================= */

loginBtn.addEventListener(
    "click",
    login
);


adminPin.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            login();
        }

    }
);


async function login() {

    const pin =
        adminPin.value.trim();


    if (!/^\d{6}$/.test(pin)) {

        loginMessage.textContent =
            "Enter your 6-digit admin PIN.";

        return;
    }


    loginBtn.disabled = true;
    loginBtn.textContent = "Checking...";
    loginMessage.textContent = "";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "smooth-api",
                    {
                        body: {
                            action: "login"
                        },

                        headers: {
                            "x-admin-pin": pin
                        }
                    }
                );


        if (
            error ||
            !data ||
            data.success !== true
        ) {

            console.error(
                "Login error:",
                error || data
            );

            loginMessage.textContent =
                "Incorrect PIN.";

            return;
        }


        currentAdminPin = pin;

        adminPin.value = "";

        showAdmin();

        await loadEnquiries();


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        loginMessage.textContent =
            "Unable to connect. Try again.";

    } finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Open Admin App";
    }

}


/* =========================================
   SCREEN
========================================= */

function showLogin() {

    loginSection.hidden = false;
    adminSection.hidden = true;

}


function showAdmin() {

    loginSection.hidden = true;
    adminSection.hidden = false;

}


/* =========================================
   LOAD ENQUIRIES
========================================= */

async function loadEnquiries() {

    enquiryList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ⏳
            </div>

            <h3>
                Loading enquiries...
            </h3>

            <p>
                Connecting to Bhrighu Adventure.
            </p>

        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "smooth-api",
                    {
                        body: {
                            action: "list"
                        },

                        headers: {
                            "x-admin-pin":
                                currentAdminPin
                        }
                    }
                );


        if (
            error ||
            !data ||
            data.success !== true
        ) {

            console.error(
                "Load error:",
                error || data
            );

            showLoadError();

            return;
        }


        allEnquiries =
            data.enquiries || [];


        updateStats();

        renderCurrentView();


    } catch (error) {

        console.error(
            "Enquiry error:",
            error
        );

        showLoadError();
    }

}


/* =========================================
   STATS
========================================= */

function updateStats() {

    totalCount.textContent =
        allEnquiries.length;


    newCount.textContent =
        allEnquiries.filter(
            function(enquiry) {

                return normalizeStatus(
                    enquiry.status
                ) === "new";

            }
        ).length;


    confirmedCount.textContent =
        allEnquiries.filter(
            function(enquiry) {

                return normalizeStatus(
                    enquiry.status
                ) === "confirmed";

            }
        ).length;


    certificateCount.textContent =
        allEnquiries.filter(
            function(enquiry) {

                return Boolean(
                    enquiry.certificate_id
                );

            }
        ).length;

}


/* =========================================
   CURRENT SEARCH VIEW
========================================= */

function renderCurrentView() {

    const searchValue =
        searchEnquiries
            .value
            .trim()
            .toLowerCase();


    const filtered =
        allEnquiries.filter(
            function(enquiry) {

                const name =
                    String(
                        enquiry.name || ""
                    )
                    .toLowerCase();


                const phone =
                    String(
                        enquiry.phone || ""
                    )
                    .toLowerCase();


                return (
                    name.includes(searchValue) ||
                    phone.includes(searchValue)
                );

            }
        );


    renderEnquiries(filtered);

}


/* =========================================
   RENDER ENQUIRIES
========================================= */

function renderEnquiries(enquiries) {

    if (
        !enquiries ||
        enquiries.length === 0
    ) {

        enquiryList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📭
                </div>

                <h3>
                    No enquiries found
                </h3>

                <p>
                    New course enquiries
                    will appear here.
                </p>

            </div>
        `;

        return;
    }


    enquiryList.innerHTML =
        enquiries
            .map(
                function(enquiry) {

                    const status =
                        normalizeStatus(
                            enquiry.status
                        );


                    return `
                        <article class="enquiry-card">

                            <div class="enquiry-card-top">

                                <div>

                                    <div class="enquiry-name">

                                        ${escapeHTML(
                                            enquiry.name ||
                                            "Unknown"
                                        )}

                                    </div>


                                    <div class="enquiry-phone">

                                        ${escapeHTML(
                                            enquiry.phone ||
                                            "No phone"
                                        )}

                                    </div>

                                </div>


                                <span class="status-badge">

                                    ${escapeHTML(
                                        formatStatus(
                                            enquiry.status
                                        )
                                    )}

                                </span>

                            </div>


                            <div class="enquiry-meta">

                                <div class="meta-item">

                                    <span>
                                        Batch
                                    </span>

                                    <strong>

                                        ${formatDate(
                                            enquiry.preferred_date
                                        )}

                                    </strong>

                                </div>


                                <div class="meta-item">

                                    <span>
                                        Participants
                                    </span>

                                    <strong>

                                        ${escapeHTML(
                                            enquiry.participants ||
                                            "1"
                                        )}

                                    </strong>

                                </div>


                                <div class="meta-item">

                                    <span>
                                        Source
                                    </span>

                                    <strong>

                                        ${escapeHTML(
                                            formatSource(
                                                enquiry.source
                                            )
                                        )}

                                    </strong>

                                </div>


                                <div class="meta-item">

                                    <span>
                                        Certificate
                                    </span>

                                    <strong>

                                        ${
                                            enquiry.certificate_id
                                                ? escapeHTML(
                                                    enquiry.certificate_id
                                                )
                                                : "Not Issued"
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div class="status-actions">

                                <button
                                    class="status-action-btn ${
                                        status === "new"
                                            ? "active"
                                            : ""
                                    }"
                                    type="button"
                                    data-enquiry-id="${escapeHTML(
                                        enquiry.id || ""
                                    )}"
                                    data-status="New"
                                >
                                    New
                                </button>


                                <button
                                    class="status-action-btn ${
                                        status === "contacted"
                                            ? "active"
                                            : ""
                                    }"
                                    type="button"
                                    data-enquiry-id="${escapeHTML(
                                        enquiry.id || ""
                                    )}"
                                    data-status="Contacted"
                                >
                                    Contacted
                                </button>


                                <button
                                    class="status-action-btn ${
                                        status === "confirmed"
                                            ? "active"
                                            : ""
                                    }"
                                    type="button"
                                    data-enquiry-id="${escapeHTML(
                                        enquiry.id || ""
                                    )}"
                                    data-status="Confirmed"
                                >
                                    Confirmed
                                </button>

                            </div>


                            <div class="enquiry-actions">

                                <a
                                    class="enquiry-action-btn whatsapp-action"
                                    href="${createWhatsAppLink(
                                        enquiry.phone
                                    )}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    WhatsApp
                                </a>


                             ${
    enquiry.certificate_id
        ? `
            <a
                class="enquiry-action-btn certificate-issued-btn"
                href="https://vishalvito.github.io/bhrighu-certificate-system/verify.html?id=${encodeURIComponent(
                    enquiry.certificate_id
                )}"
                target="_blank"
                rel="noopener"
            >
                ✓ View Certificate
            </a>
        `

        : normalizeStatus(
            enquiry.status
        ) === "confirmed"

        ? `
            <button
                class="enquiry-action-btn certificate-ready-btn"
                type="button"
                disabled
            >
                🎓 Ready for Certificate
            </button>
        `

        : `
            <button
                class="enquiry-action-btn"
                type="button"
                disabled
            >
                No Certificate
            </button>
        `
}   

                            </div>

                        </article>
                    `;

                }
            )
            .join("");


    attachStatusButtons();

}


/* =========================================
   STATUS BUTTON EVENTS
========================================= */

function attachStatusButtons() {

    const statusButtons =
        document.querySelectorAll(
            ".status-action-btn"
        );


    statusButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                async function() {

                    const enquiryId =
                        button.dataset
                            .enquiryId;


                    const newStatus =
                        button.dataset
                            .status;


                    await updateEnquiryStatus(
                        enquiryId,
                        newStatus,
                        button
                    );

                }
            );

        }
    );

}


/* =========================================
   UPDATE STATUS
========================================= */

async function updateEnquiryStatus(
    enquiryId,
    newStatus,
    button
) {

    if (
        !enquiryId ||
        !newStatus
    ) {
        return;
    }


    const buttons =
        document.querySelectorAll(
            `.status-action-btn[data-enquiry-id="${CSS.escape(
                String(enquiryId)
            )}"]`
        );


    buttons.forEach(
        function(item) {
            item.disabled = true;
        }
    );


    const originalText =
        button.textContent;


    button.textContent = "...";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "smooth-api",
                    {
                        body: {

                            action:
                                "update_status",

                            enquiry_id:
                                enquiryId,

                            status:
                                newStatus
                        },

                        headers: {

                            "x-admin-pin":
                                currentAdminPin
                        }
                    }
                );


        if (
            error ||
            !data ||
            data.success !== true
        ) {

            console.error(
                "Status update error:",
                error || data
            );


            alert(
                "Unable to update status."
            );

            return;
        }


        const enquiry =
            allEnquiries.find(
                function(item) {

                    return (
                        String(item.id) ===
                        String(enquiryId)
                    );

                }
            );


        if (enquiry) {

            enquiry.status =
                data.enquiry &&
                data.enquiry.status
                    ? data.enquiry.status
                    : newStatus;

        }


        updateStats();

        renderCurrentView();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );


        alert(
            "Unable to update status."
        );


    } finally {

        button.textContent =
            originalText;

    }

}


/* =========================================
   SEARCH
========================================= */

searchEnquiries.addEventListener(
    "input",
    renderCurrentView
);


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
    "click",
    function() {

        currentAdminPin = "";

        allEnquiries = [];

        searchEnquiries.value = "";

        loginMessage.textContent = "";

        showLogin();

    }
);


/* =========================================
   HELPERS
========================================= */

function normalizeStatus(status) {

    return String(
        status || "New"
    )
        .trim()
        .toLowerCase();

}


function formatStatus(status) {

    const value =
        normalizeStatus(status);


    if (value === "confirmed") {
        return "Confirmed";
    }


    if (value === "contacted") {
        return "Contacted";
    }


    return "New";

}


function createWhatsAppLink(phone) {

    if (!phone) {
        return "#";
    }


    let cleanPhone =
        String(phone)
            .replace(
                /\D/g,
                ""
            );


    if (
        cleanPhone.length === 10
    ) {

        cleanPhone =
            "91" +
            cleanPhone;

    }


    return (
        "https://wa.me/" +
        cleanPhone
    );

}


function formatDate(value) {

    if (!value) {
        return "Not selected";
    }


    const date =
        new Date(
            value +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHTML(value);
    }


    return date
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


function formatSource(source) {

    if (
        source ===
        "instagram_bio"
    ) {
        return "Instagram Bio";
    }


    if (
        source ===
        "instagram_story"
    ) {
        return "Instagram Story";
    }


    if (
        source ===
        "whatsapp"
    ) {
        return "WhatsApp";
    }


    if (!source) {
        return "Direct";
    }


    return String(source)
        .replaceAll(
            "_",
            " "
        );

}


function showLoadError() {

    enquiryList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ⚠️
            </div>

            <h3>
                Unable to load enquiries
            </h3>

            <p>
                Sign out and try again.
            </p>

        </div>
    `;

}


function escapeHTML(value) {

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


/* =========================================
   START
========================================= */

showLogin();