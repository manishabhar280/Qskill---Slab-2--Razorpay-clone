/* =========================================================
   PAYFLOW - MAIN JAVASCRIPT
   Frontend Demo / Digital Payments Platform
   ========================================================= */

"use strict";

/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);

const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let activeModal = null;
let lastFocusedElement = null;


/* =========================================================
   SAMPLE DATA
   ========================================================= */

let transactions = [
  {
    id: "PF202601",
    customer: "Amazon Store",
    amount: 2499,
    status: "Successful",
    method: "UPI",
    date: "2026-09-11",
  },
  {
    id: "PF202602",
    customer: "College Fees",
    amount: 5000,
    status: "Successful",
    method: "Card",
    date: "2026-09-10",
  },
  {
    id: "PF202603",
    customer: "Web Services",
    amount: 8500,
    status: "Successful",
    method: "Net Banking",
    date: "2026-09-09",
  },
  {
    id: "PF202604",
    customer: "Subscription",
    amount: 999,
    status: "Pending",
    method: "UPI",
    date: "2026-09-08",
  },
  {
    id: "PF202605",
    customer: "Design Studio",
    amount: 3200,
    status: "Failed",
    method: "Card",
    date: "2026-09-07",
  },
];

let paymentLinks = [
  {
    id: "PL1001",
    customer: "Vishal Gautam",
    amount: 2500,
    status: "Active",
    expiry: "2026-09-30",
  },
  {
    id: "PL1002",
    customer: "Prince Gautam",
    amount: 4500,
    status: "Paid",
    expiry: "2026-09-20",
  },
  {
    id: "PL1003",
    customer: "Shubham Kumar",
    amount: 1200,
    status: "Expired",
    expiry: "2026-08-30",
  },
   {
    id: "PL1004",
    customer: "Raushan Kumar singh",
    amount: 1200,
    status: "Expired",
    expiry: "2026-08-30",
  },

  {
    id: "PL1005",
    customer: "Gopal jha",
    amount: 4500,
    status: "Paid",
    expiry: "2026-09-20",
  },
];

let customers = [
  {
    id: "C001",
    name: "Vishal Gautam",
    email: "vishal@example.com",
    phone: "+91 9876543210",
    transactions: 8,
    spent: 18500,
  },
  {
    id: "C002",
    name: "Prince Gautam",
    email: "prince@example.com",
    phone: "+91 9876501234",
    transactions: 5,
    spent: 12400,
  },
  {
    id: "C003",
    name: "Shubham Kumar",
    email: "shubham@example.com",
    phone: "+91 9812345678",
    transactions: 3,
    spent: 6200,
  },
  {
    id: "C004",
    name: "Raushan Kumar singh",
    email: "raushan@example.com",
    phone: "+91 9812345678",
    transactions: 3,
    spent: 6200,
  },
  {
    id: "C005",
    name: "Gopal jha",
    email: "gopal@example.com",
    phone: "+91 9876501234",
    transactions: 5,
    spent: 12400,
  },
];


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, type = "info") {
  const region = $("#toastRegion");

  if (!region) return;

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;
  toast.setAttribute("role", "status");

  toast.innerHTML = `
    <span>${message}</span>
    <button type="button" aria-label="Close notification">&times;</button>
  `;

  const closeButton = $("button", toast);

  if (closeButton) {
    closeButton.addEventListener("click", () => toast.remove());
  }

  region.append(toast);

  window.setTimeout(() => {
    if (toast.isConnected) {
      toast.remove();
    }
  }, 4200);
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  if (activeModal && activeModal !== modal) {
    closeModal(activeModal);
  }

  lastFocusedElement = document.activeElement;

  modal.hidden = false;
  activeModal = modal;

  document.body.classList.add("modal-open");

  const firstInput = $(
    "input, textarea, select, button:not(.modal-close)",
    modal
  );

  if (firstInput) {
    setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal(id) {
  const modal =
    typeof id === "string" ? document.getElementById(id) : id;

  if (!modal) return;

  modal.hidden = true;

  if (activeModal === modal) {
    activeModal = null;
    document.body.classList.remove("modal-open");

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }
}

$$("[data-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modal);
  });
});

$$(".modal-close").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.closest(".modal-overlay"));
  });
});

$$(".modal-overlay").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModal) {
    closeModal(activeModal);
  }
});


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton = $("#menuBtn");
const navLinks = $("#navLinks");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open navigation"
      );
    });
  });
}


/* =========================================================
   THEME
   ========================================================= */

const themeToggle = $("#themeToggle");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle(
    "light-mode",
    isLight
  );

  if (themeToggle) {
    themeToggle.textContent = isLight ? "☀" : "🌙";

    themeToggle.setAttribute(
      "aria-label",
      isLight
        ? "Switch to dark mode"
        : "Switch to light mode"
    );
  }
}

const savedTheme =
  localStorage.getItem("payflow-theme") || "dark";

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme =
      document.body.classList.contains("light-mode")
        ? "dark"
        : "light";

    localStorage.setItem(
      "payflow-theme",
      nextTheme
    );

    applyTheme(nextTheme);

    showToast(
      `${nextTheme === "light" ? "Light" : "Dark"} mode enabled.`,
      "info"
    );
  });
}


/* =========================================================
   VALIDATION
   ========================================================= */

function clearErrors(form) {
  if (!form) return;

  $$(".field-error", form).forEach((error) => {
    error.textContent = "";
  });

  $$("[aria-invalid='true']", form).forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

function showFieldError(input, message) {
  if (!input) return;

  const label = input.closest("label");
  const error = label
    ? $(".field-error", label)
    : null;

  if (error) {
    error.textContent = message;
  }

  input.setAttribute("aria-invalid", "true");
}

function clearFieldError(input) {
  if (!input) return;

  input.removeAttribute("aria-invalid");

  const label = input.closest("label");
  const error = label
    ? $(".field-error", label)
    : null;

  if (error) {
    error.textContent = "";
  }
}

function validateRequired(input, message) {
  if (!input) return false;

  if (!input.value.trim()) {
    showFieldError(input, message);
    return false;
  }

  clearFieldError(input);
  return true;
}

function validateEmail(input) {
  if (!input) return false;

  if (!emailPattern.test(input.value.trim())) {
    showFieldError(
      input,
      "Please enter a valid email."
    );

    return false;
  }

  clearFieldError(input);

  return true;
}


/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

function setupPasswordToggle() {
  const toggle = $(".password-toggle");
  const password = $("#loginPassword");

  if (!toggle || !password) return;

  toggle.addEventListener("click", () => {
    const visible = password.type === "text";

    password.type = visible
      ? "password"
      : "text";

    toggle.setAttribute(
      "aria-label",
      visible
        ? "Show password"
        : "Hide password"
    );
  });
}

setupPasswordToggle();


/* =========================================================
   LOGIN
   ========================================================= */

const forgotPassword = $("#forgotPassword");

if (forgotPassword) {
  forgotPassword.addEventListener("click", () => {
    showToast(
      "Password recovery is available in this frontend demo.",
      "info"
    );
  });
}

const loginForm = $("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = $("#loginEmail");
    const password = $("#loginPassword");

    clearErrors(loginForm);

    const validEmail =
      validateRequired(
        email,
        "Email is required."
      ) &&
      validateEmail(email);

    const passwordRequired =
      validateRequired(
        password,
        "Password is required."
      );

    const passwordValid =
      passwordRequired &&
      password.value.length >= 6;

    if (
      !passwordValid &&
      password.value
    ) {
      showFieldError(
        password,
        "Password must be at least 6 characters."
      );
    }

    if (!validEmail || !passwordValid) {
      return;
    }

    const rememberMe = $("#rememberMe");

    if (rememberMe && rememberMe.checked) {
      localStorage.setItem(
        "payflow-remember",
        "true"
      );
    }

    closeModal("loginModal");

    showToast(
      "Login successful!",
      "success"
    );

    loginForm.reset();
  });
}


/* =========================================================
   SIGN UP
   ========================================================= */

const signupForm = $("#signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#signupName");
    const email = $("#signupEmail");
    const password = $("#signupPassword");
    const confirm = $("#signupConfirm");
    const terms = $("#terms");

    clearErrors(signupForm);

    const validName =
      validateRequired(
        name,
        "Name is required."
      );

    const validEmail =
      validateRequired(
        email,
        "Email is required."
      ) &&
      validateEmail(email);

    const passwordRequired =
      validateRequired(
        password,
        "Password is required."
      );

    const validPassword =
      passwordRequired &&
      password.value.length >= 6;

    if (
      !validPassword &&
      password.value
    ) {
      showFieldError(
        password,
        "Password must be at least 6 characters."
      );
    }

    const confirmRequired =
      validateRequired(
        confirm,
        "Please confirm your password."
      );

    const validConfirm =
      confirmRequired &&
      confirm.value === password.value;

    if (
      !validConfirm &&
      confirm.value
    ) {
      showFieldError(
        confirm,
        "Passwords do not match."
      );
    }

    if (
      terms &&
      !terms.checked
    ) {
      showFieldError(
        terms,
        "Please accept the terms and conditions."
      );
    }

    if (
      !validName ||
      !validEmail ||
      !validPassword ||
      !validConfirm ||
      (terms && !terms.checked)
    ) {
      return;
    }

    closeModal("signupModal");

    showToast(
      "Account created successfully!",
      "success"
    );

    signupForm.reset();
  });
}


/* =========================================================
   PAYMENT
   ========================================================= */

const paySecurely = $("#paySecurely");

if (paySecurely) {
  paySecurely.addEventListener("click", () => {
    openModal("paymentModal");
  });
}

function updatePaymentFields(method) {
  $$(".payment-fields").forEach((fields) => {
    fields.hidden =
      fields.dataset.method !== method;
  });
}

$$("input[name='paymentMethod']").forEach(
  (radio) => {
    radio.addEventListener("change", () => {
      updatePaymentFields(radio.value);
    });
  }
);

const paymentForm = $("#paymentForm");

if (paymentForm) {
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors(paymentForm);

    const selectedMethod = $(
      "input[name='paymentMethod']:checked"
    );

    const method = selectedMethod
      ? selectedMethod.value
      : "upi";

    let valid = true;

    /* UPI */

    if (method === "upi") {
      const upi = $("#upiId");

      const required =
        validateRequired(
          upi,
          "UPI ID is required."
        );

      const formatValid =
        /^[\w.-]+@[\w.-]+$/.test(
          upi.value.trim()
        );

      valid = required && formatValid;

      if (!formatValid && upi.value) {
        showFieldError(
          upi,
          "Enter a valid UPI ID."
        );
      }
    }

    /* CARD */

    if (method === "card") {
      const card = $("#cardNumber");
      const expiry = $("#expiry");
      const cvv = $("#cvv");

      const cardNumber =
        card.value
          .replace(/\s/g, "");

      const cardValid =
        validateRequired(
          card,
          "Card number is required."
        ) &&
        cardNumber.length >= 12;

      const expiryValid =
        validateRequired(
          expiry,
          "Expiry date is required."
        ) &&
        /^\d{2}\/\d{2}$/.test(
          expiry.value.trim()
        );

      const cvvValid =
        validateRequired(
          cvv,
          "CVV is required."
        ) &&
        /^\d{3,4}$/.test(
          cvv.value.trim()
        );

      if (!cardValid && card.value) {
        showFieldError(
          card,
          "Enter a valid card number."
        );
      }

      if (!expiryValid && expiry.value) {
        showFieldError(
          expiry,
          "Use MM/YY format."
        );
      }

      if (!cvvValid && cvv.value) {
        showFieldError(
          cvv,
          "Enter a valid CVV."
        );
      }

      valid =
        cardValid &&
        expiryValid &&
        cvvValid;
    }

    /* NET BANKING */

    if (method === "netbanking") {
      valid = validateRequired(
        $("#bank"),
        "Please select a bank."
      );
    }

    if (!valid) return;

    closeModal("paymentModal");

    const transactionId =
      `PF2026${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    const transactionElement =
      $("#transactionId");

    if (transactionElement) {
      transactionElement.textContent =
        transactionId;
    }

    openModal("paymentSuccessModal");

    paymentForm.reset();

    updatePaymentFields("upi");
  });
}

const paymentDone = $("#paymentDone");

if (paymentDone) {
  paymentDone.addEventListener("click", () => {
    closeModal("paymentSuccessModal");

    showToast(
      "Payment successful!",
      "success"
    );
  });
}


/* =========================================================
   PAYMENT LINK GENERATOR
   ========================================================= */

const linkForm = $("#linkForm");

if (linkForm) {
  linkForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customer = $("#linkCustomer");
    const amount = $("#linkAmount");

    if (
      !customer ||
      !amount ||
      !customer.value.trim() ||
      !amount.value ||
      Number(amount.value) <= 0
    ) {
      showToast(
        "Enter a customer name and a valid amount.",
        "error"
      );

      return;
    }

    const link =
      `payflow.example/pay/PF${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

    const generatedLink =
      $("#generatedLink");

    const linkResult =
      $("#linkResult");

    if (generatedLink) {
      generatedLink.textContent = link;
    }

    if (linkResult) {
      linkResult.hidden = false;
      linkResult.dataset.link = link;
    }

    showToast(
      "Payment link generated!",
      "success"
    );

    addPaymentLink({
      id: `PL${Date.now()}`,
      customer: customer.value.trim(),
      amount: Number(amount.value),
      status: "Active",
      expiry:
        $("#linkExpiry")?.value ||
        "No expiry",
    });
  });
}


/* =========================================================
   COPY PAYMENT LINK
   ========================================================= */

const copyLink = $("#copyLink");

if (copyLink) {
  copyLink.addEventListener(
    "click",
    async () => {
      const result = $("#linkResult");

      const link =
        result?.dataset.link;

      if (!link) {
        showToast(
          "Generate a payment link first.",
          "error"
        );

        return;
      }

      try {
        await navigator.clipboard.writeText(
          link
        );
      } catch (error) {
        const helper =
          document.createElement(
            "textarea"
          );

        helper.value = link;

        document.body.append(helper);

        helper.select();

        document.execCommand("copy");

        helper.remove();
      }

      showToast(
        "Payment link copied!",
        "success"
      );
    }
  );
}


/* =========================================================
   DASHBOARD BUTTONS
   ========================================================= */

const viewTransactions =
  $("#viewTransactions");

if (viewTransactions) {
  viewTransactions.addEventListener(
    "click",
    () => {
      const dashboard =
        $("#dashboard");

      if (dashboard) {
        dashboard.scrollIntoView({
          behavior: "smooth",
        });
      }

      showToast(
        "Showing recent transactions.",
        "info"
      );
    }
  );
}

const exploreBanking =
  $("#exploreBanking");

if (exploreBanking) {
  exploreBanking.addEventListener(
    "click",
    () => {
      showToast(
        "Banking tools are ready to explore in this demo.",
        "info"
      );
    }
  );
}


/* =========================================================
   DOWNLOAD REPORT
   ========================================================= */

const downloadReport =
  $("#downloadReport");

if (downloadReport) {
  downloadReport.addEventListener(
    "click",
    () => {
      const rows = [
        [
          "Transaction",
          "Amount",
          "Status",
        ],
        [
          "Amazon Store",
          "2499",
          "Successful",
        ],
        [
          "College Fees",
          "5000",
          "Successful",
        ],
        [
          "Web Services",
          "8500",
          "Successful",
        ],
        [
          "Subscription",
          "999",
          "Pending",
        ],
      ];

      const csv = rows
        .map((row) =>
          row.join(",")
        )
        .join("\n");

      const blob = new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "payflow-transactions.csv";

      document.body.append(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      showToast(
        "Report downloaded.",
        "success"
      );
    }
  );
}


/* =========================================================
   PRICING
   ========================================================= */

$$("[data-plan]").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        showToast(
          `${button.dataset.plan} plan selected.`,
          "info"
        );
      }
    );
  }
);


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
  $("#contactForm");

if (contactForm) {
  contactForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      clearErrors(contactForm);

      const name =
        $("#contactName");

      const email =
        $("#contactEmail");

      const company =
        $("#contactCompany");

      const message =
        $("#contactMessage");

      const validName =
        validateRequired(
          name,
          "Name is required."
        );

      const validEmail =
        validateRequired(
          email,
          "Email is required."
        ) &&
        validateEmail(email);

      const validCompany =
        validateRequired(
          company,
          "Company is required."
        );

      const validMessage =
        validateRequired(
          message,
          "Message is required."
        );

      if (
        !validName ||
        !validEmail ||
        !validCompany ||
        !validMessage
      ) {
        return;
      }

      closeModal("contactModal");

      showToast(
        "Thank you! Our sales team will contact you soon.",
        "success"
      );

      contactForm.reset();
    }
  );
}


/* =========================================================
   FAQ
   ========================================================= */

$$(".faq-item button").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        const item =
          button.closest(".faq-item");

        if (!item) return;

        $$(".faq-item.open").forEach(
          (openItem) => {
            if (openItem !== item) {
              openItem.classList.remove(
                "open"
              );

              const openButton =
                $("button", openItem);

              if (openButton) {
                openButton.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            }
          }
        );

        const isOpen =
          item.classList.toggle("open");

        button.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );
  }
);


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.12,
        }
      )
    : null;

if (revealObserver) {
  $$(".reveal").forEach(
    (element) =>
      revealObserver.observe(element)
  );
} else {
  $$(".reveal").forEach(
    (element) =>
      element.classList.add("visible")
  );
}


/* =========================================================
   REMEMBER ME
   ========================================================= */

const rememberMe =
  $("#rememberMe");

if (rememberMe) {
  rememberMe.checked =
    localStorage.getItem(
      "payflow-remember"
    ) === "true";
}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

const globalSearch =
  $("#globalSearch");

const globalResults =
  $("#globalResults");

if (globalSearch) {
  globalSearch.addEventListener(
    "input",
    () => {
      const query =
        globalSearch.value
          .trim()
          .toLowerCase();

      if (!globalResults) return;

      if (!query) {
        globalResults.hidden = true;
        globalResults.innerHTML = "";
        return;
      }

      const results = [];

      transactions.forEach(
        (transaction) => {
          if (
            transaction.customer
              .toLowerCase()
              .includes(query) ||
            transaction.id
              .toLowerCase()
              .includes(query)
          ) {
            results.push({
              type: "Transaction",
              title:
                transaction.customer,
              value:
                `₹${transaction.amount}`,
            });
          }
        }
      );

      paymentLinks.forEach(
        (link) => {
          if (
            link.customer
              .toLowerCase()
              .includes(query) ||
            link.id
              .toLowerCase()
              .includes(query)
          ) {
            results.push({
              type: "Payment Link",
              title:
                link.customer,
              value:
                `₹${link.amount}`,
            });
          }
        }
      );

      customers.forEach(
        (customer) => {
          if (
            customer.name
              .toLowerCase()
              .includes(query) ||
            customer.email
              .toLowerCase()
              .includes(query)
          ) {
            results.push({
              type: "Customer",
              title:
                customer.name,
              value:
                customer.email,
            });
          }
        }
      );

      if (!results.length) {
        globalResults.innerHTML = `
          <div class="empty-state">
            No results found.
          </div>
        `;
      } else {
        globalResults.innerHTML =
          results
            .slice(0, 8)
            .map(
              (result) => `
                <div class="search-result">
                  <strong>${result.title}</strong>
                  <span>${result.type} · ${result.value}</span>
                </div>
              `
            )
            .join("");
      }

      globalResults.hidden = false;
    }
  );
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

let notifications = [
  {
    id: 1,
    title: "Payment received",
    message:
      "₹2,499 received from Amazon Store.",
    read: false,
  },
  {
    id: 2,
    title: "Payment link created",
    message:
      "New payment link PL1001 is active.",
    read: false,
  },
  {
    id: 3,
    title: "Weekly report ready",
    message:
      "Your payment report is available.",
    read: true,
  },
];

function renderNotifications() {
  const list =
    $("#notificationList");

  const count =
    $("#notificationCount");

  if (!list) return;

  list.innerHTML = "";

  if (!notifications.length) {
    list.innerHTML = `
      <div class="empty-state">
        No notifications.
      </div>
    `;
  } else {
    notifications.forEach(
      (notification) => {
        const item =
          document.createElement(
            "div"
          );

        item.className =
          `notification-item ${
            notification.read
              ? "read"
              : "unread"
          }`;

        item.innerHTML = `
          <strong>${notification.title}</strong>
          <p>${notification.message}</p>
        `;

        list.append(item);
      }
    );
  }

  const unread =
    notifications.filter(
      (item) => !item.read
    ).length;

  if (count) {
    count.textContent =
      unread > 9 ? "9+" : unread;
    count.hidden = unread === 0;
  }
}

renderNotifications();

const notificationButton =
  $("#notificationButton");

const notificationPanel =
  $("#notificationPanel");

if (notificationButton) {
  notificationButton.addEventListener(
    "click",
    () => {
      if (!notificationPanel) return;

      notificationPanel.hidden =
        !notificationPanel.hidden;
    }
  );
}

const markAllRead =
  $("#markAllRead");

if (markAllRead) {
  markAllRead.addEventListener(
    "click",
    () => {
      notifications =
        notifications.map(
          (item) => ({
            ...item,
            read: true,
          })
        );

      renderNotifications();

      showToast(
        "All notifications marked as read.",
        "success"
      );
    }
  );
}

const clearNotifications =
  $("#clearNotifications");

if (clearNotifications) {
  clearNotifications.addEventListener(
    "click",
    () => {
      notifications = [];

      renderNotifications();

      showToast(
        "Notifications cleared.",
        "info"
      );
    }
  );
}


/* =========================================================
   QUICK ACTIONS
   ========================================================= */

$$("[data-quick-action]").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        const action =
          button.dataset.quickAction;

        switch (action) {
          case "link":
            $("#linkForm")?.scrollIntoView({
              behavior: "smooth",
            });
            break;

          case "transactions":
            $("#transactions")?.scrollIntoView({
              behavior: "smooth",
            });
            break;

          case "invoice":
            openModal("invoiceModal");
            break;

          case "analytics":
            $("#analytics")?.scrollIntoView({
              behavior: "smooth",
            });
            break;

          case "customers":
            $("#customers")?.scrollIntoView({
              behavior: "smooth",
            });
            break;

          default:
            showToast(
              "Quick action selected.",
              "info"
            );
        }
      }
    );
  }
);


/* =========================================================
   ANALYTICS
   ========================================================= */

function calculateAnalytics(range = "today") {
  let multiplier = 1;

  if (range === "7") {
    multiplier = 1.7;
  }

  if (range === "30") {
    multiplier = 4.2;
  }

  if (range === "year") {
    multiplier = 12;
  }

  const successful =
    transactions.filter(
      (item) =>
        item.status === "Successful"
    );

  const revenue =
    successful.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const successfulCount =
    successful.length;

  const pending =
    transactions.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const failed =
    transactions.filter(
      (item) =>
        item.status === "Failed"
    ).length;

  const refunded =
    transactions.filter(
      (item) =>
        item.status === "Refunded"
    ).length;

  return {
    revenue: Math.round(
      revenue * multiplier
    ),
    successful:
      Math.round(
        successfulCount * multiplier
      ),
    pending:
      Math.round(
        pending * multiplier
      ),
    failed:
      Math.round(
        failed * multiplier
      ),
    refunded:
      Math.round(
        refunded * multiplier
      ),
    total:
      Math.round(
        transactions.length *
          multiplier
      ),
  };
}

function updateAnalytics(range = "today") {
  const data =
    calculateAnalytics(range);

  const revenue =
    $("#metricRevenue");

  const successful =
    $("#metricSuccessful");

  const pending =
    $("#metricPending");

  const failed =
    $("#metricFailed");

  const refunded =
    $("#metricRefunded");

  const total =
    $("#metricTotal");

  if (revenue) {
    revenue.textContent =
      `₹${data.revenue.toLocaleString("en-IN")}`;
  }

  if (successful) {
    successful.textContent =
      data.successful;
  }

  if (pending) {
    pending.textContent =
      data.pending;
  }

  if (failed) {
    failed.textContent =
      data.failed;
  }

  if (refunded) {
    refunded.textContent =
      data.refunded;
  }

  if (total) {
    total.textContent =
      data.total;
  }

  const summary =
    $("#analyticsSummary");

  if (summary) {
    summary.textContent =
      `Showing analytics for ${
        range === "today"
          ? "today"
          : range === "7"
          ? "the last 7 days"
          : range === "30"
          ? "the last 30 days"
          : "this year"
      }.`;
  }
}

$$("[data-range]").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        $$("[data-range]").forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add("active");

        updateAnalytics(
          button.dataset.range
        );
      }
    );
  }
);

updateAnalytics("today");


/* =========================================================
   TRANSACTION TABLE
   ========================================================= */

function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString(
    "en-IN"
  )}`;
}

function renderTransactions() {
  const tbody =
    $("#transactionTableBody");

  const empty =
    $("#transactionEmpty");

  if (!tbody) return;

  const search =
    $("#transactionSearch")
      ?.value
      .trim()
      .toLowerCase() || "";

  const status =
    $("#statusFilter")?.value || "";

  const method =
    $("#methodFilter")?.value || "";

  const sort =
    $("#transactionSort")?.value || "";

  let filtered =
    transactions.filter(
      (transaction) => {
        const matchesSearch =
          !search ||
          transaction.customer
            .toLowerCase()
            .includes(search) ||
          transaction.id
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          !status ||
          transaction.status ===
            status;

        const matchesMethod =
          !method ||
          transaction.method ===
            method;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesMethod
        );
      }
    );

  if (sort === "amount-high") {
    filtered.sort(
      (a, b) =>
        b.amount - a.amount
    );
  }

  if (sort === "amount-low") {
    filtered.sort(
      (a, b) =>
        a.amount - b.amount
    );
  }

  if (sort === "newest") {
    filtered.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );
  }

  if (sort === "oldest") {
    filtered.sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );
  }

  tbody.innerHTML = "";

  if (!filtered.length) {
    if (empty) {
      empty.hidden = false;
    }

    return;
  }

  if (empty) {
    empty.hidden = true;
  }

  filtered.forEach(
    (transaction) => {
      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.customer}</td>
        <td>${formatCurrency(transaction.amount)}</td>
        <td>${transaction.method}</td>
        <td>
          <span class="status ${transaction.status.toLowerCase()}">
            ${transaction.status}
          </span>
        </td>
        <td>${transaction.date}</td>
        <td>
          <button
            type="button"
            class="table-action"
            data-transaction-id="${transaction.id}">
            View
          </button>
        </td>
      `;

      tbody.append(row);
    }
  );

  $$("[data-transaction-id]", tbody)
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showTransactionDetails(
            button.dataset.transactionId
          );
        }
      );
    });
}

[
  "#transactionSearch",
  "#statusFilter",
  "#methodFilter",
  "#transactionSort",
].forEach((selector) => {
  const element = $(selector);

  if (element) {
    element.addEventListener(
      "input",
      renderTransactions
    );

    element.addEventListener(
      "change",
      renderTransactions
    );
  }
});

const clearTransactionFilters =
  $("#clearTransactionFilters");

if (clearTransactionFilters) {
  clearTransactionFilters.addEventListener(
    "click",
    () => {
      [
        "#transactionSearch",
        "#statusFilter",
        "#methodFilter",
        "#transactionSort",
      ].forEach((selector) => {
        const element = $(selector);

        if (element) {
          element.value = "";
        }
      });

      renderTransactions();
    }
  );
}

const exportTransactions =
  $("#exportTransactions");

if (exportTransactions) {
  exportTransactions.addEventListener(
    "click",
    () => {
      const rows = [
        [
          "ID",
          "Customer",
          "Amount",
          "Method",
          "Status",
          "Date",
        ],
        ...transactions.map(
          (item) => [
            item.id,
            item.customer,
            item.amount,
            item.method,
            item.status,
            item.date,
          ]
        ),
      ];

      const csv = rows
        .map((row) =>
          row.join(",")
        )
        .join("\n");

      const blob = new Blob(
        [csv],
        {
          type: "text/csv",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "payflow-all-transactions.csv";

      document.body.append(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      showToast(
        "Transactions exported successfully.",
        "success"
      );
    }
  );
}

renderTransactions();


/* =========================================================
   TRANSACTION DETAILS
   ========================================================= */

function showTransactionDetails(id) {
  const transaction =
    transactions.find(
      (item) => item.id === id
    );

  if (!transaction) return;

  const details =
    $("#transactionDetails");

  if (details) {
    details.innerHTML = `
      <div class="detail-list">
        <p>
          <strong>Transaction ID:</strong>
          ${transaction.id}
        </p>

        <p>
          <strong>Customer:</strong>
          ${transaction.customer}
        </p>

        <p>
          <strong>Amount:</strong>
          ${formatCurrency(transaction.amount)}
        </p>

        <p>
          <strong>Payment Method:</strong>
          ${transaction.method}
        </p>

        <p>
          <strong>Status:</strong>
          ${transaction.status}
        </p>

        <p>
          <strong>Date:</strong>
          ${transaction.date}
        </p>
      </div>
    `;
  }

  openModal("transactionModal");
}


/* =========================================================
   REFUND
   ========================================================= */

const refundDetails =
  $("#refundDetails");

if (refundDetails) {
  refundDetails.addEventListener(
    "click",
    () => {
      showToast(
        "Refund details are available in this demo.",
        "info"
      );
    }
  );
}

const confirmRefund =
  $("#confirmRefund");

if (confirmRefund) {
  confirmRefund.addEventListener(
    "click",
    () => {
      closeModal("refundModal");

      showToast(
        "Refund request submitted successfully.",
        "success"
      );
    }
  );
}


/* =========================================================
   PAYMENT LINKS MANAGEMENT
   ========================================================= */

function addPaymentLink(link) {
  paymentLinks.unshift(link);

  renderPaymentLinks();
}

function renderPaymentLinks() {
  const list =
    $("#paymentLinkList");

  if (!list) return;

  const search =
    $("#paymentLinkSearch")
      ?.value
      .trim()
      .toLowerCase() || "";

  const status =
    $("#paymentLinkStatus")?.value ||
    "";

  const filtered =
    paymentLinks.filter(
      (link) => {
        const matchesSearch =
          !search ||
          link.customer
            .toLowerCase()
            .includes(search) ||
          link.id
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          !status ||
          link.status === status;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        No payment links found.
      </div>
    `;

    return;
  }

  filtered.forEach(
    (link) => {
      const item =
        document.createElement("div");

      item.className =
        "payment-link-item";

      item.innerHTML = `
        <div>
          <strong>${link.customer}</strong>
          <p>${link.id}</p>
        </div>

        <div>
          <strong>${formatCurrency(link.amount)}</strong>
          <p>${link.expiry}</p>
        </div>

        <span class="status ${link.status.toLowerCase()}">
          ${link.status}
        </span>

        <button
          type="button"
          class="table-action"
          data-link-copy="${link.id}">
          Copy
        </button>
      `;

      list.append(item);
    }
  );

  $$("[data-link-copy]", list)
    .forEach((button) => {
      button.addEventListener(
        "click",
        async () => {
          const link =
            paymentLinks.find(
              (item) =>
                item.id ===
                button.dataset.linkCopy
            );

          if (!link) return;

          const generated =
            `payflow.example/pay/${link.id}`;

          try {
            await navigator.clipboard.writeText(
              generated
            );

            showToast(
              "Payment link copied.",
              "success"
            );
          } catch {
            showToast(
              generated,
              "info"
            );
          }
        }
      );
    });
}

[
  "#paymentLinkSearch",
  "#paymentLinkStatus",
].forEach((selector) => {
  const element = $(selector);

  if (element) {
    element.addEventListener(
      "input",
      renderPaymentLinks
    );

    element.addEventListener(
      "change",
      renderPaymentLinks
    );
  }
});

renderPaymentLinks();


/* =========================================================
   CUSTOMERS
   ========================================================= */

function renderCustomers() {
  const list =
    $("#customerList");

  if (!list) return;

  const search =
    $("#customerSearch")
      ?.value
      .trim()
      .toLowerCase() || "";

  const filtered =
    customers.filter(
      (customer) =>
        !search ||
        customer.name
          .toLowerCase()
          .includes(search) ||
        customer.email
          .toLowerCase()
          .includes(search)
    );

  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty-state">
        No customers found.
      </div>
    `;

    return;
  }

  filtered.forEach(
    (customer) => {
      const card =
        document.createElement("div");

      card.className =
        "customer-card";

      card.innerHTML = `
        <div class="customer-avatar">
          ${customer.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <h3>${customer.name}</h3>
          <p>${customer.email}</p>
          <small>${customer.phone}</small>
        </div>

        <div class="customer-stats">
          <span>
            ${customer.transactions}
            Transactions
          </span>

          <strong>
            ${formatCurrency(customer.spent)}
          </strong>
        </div>

        <button
          type="button"
          class="table-action"
          data-customer-id="${customer.id}">
          View
        </button>
      `;

      list.append(card);
    }
  );

  $$("[data-customer-id]", list)
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          showCustomerDetails(
            button.dataset.customerId
          );
        }
      );
    });
}

const customerSearch =
  $("#customerSearch");

if (customerSearch) {
  customerSearch.addEventListener(
    "input",
    renderCustomers
  );
}

function showCustomerDetails(id) {
  const customer =
    customers.find(
      (item) => item.id === id
    );

  if (!customer) return;

  const details =
    $("#customerDetails");

  if (details) {
    details.innerHTML = `
      <div class="detail-list">
        <p>
          <strong>Name:</strong>
          ${customer.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${customer.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${customer.phone}
        </p>

        <p>
          <strong>Transactions:</strong>
          ${customer.transactions}
        </p>

        <p>
          <strong>Total Spent:</strong>
          ${formatCurrency(customer.spent)}
        </p>
      </div>
    `;
  }

  openModal("customerModal");
}

renderCustomers();


/* =========================================================
   PROFILE SETTINGS
   ========================================================= */

const profileForm =
  $("#profileForm");

if (profileForm) {
  profileForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const name =
        $("#profileName");

      const email =
        $("#profileEmail");

      const phone =
        $("#profilePhone");

      clearErrors(profileForm);

      const validName =
        validateRequired(
          name,
          "Name is required."
        );

      const validEmail =
        validateRequired(
          email,
          "Email is required."
        ) &&
        validateEmail(email);

      const validPhone =
        validateRequired(
          phone,
          "Phone number is required."
        );

      if (
        !validName ||
        !validEmail ||
        !validPhone
      ) {
        return;
      }

      localStorage.setItem(
        "payflow-profile",
        JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
        })
      );

      showToast(
        "Profile updated successfully.",
        "success"
      );
    }
  );
}

function loadProfile() {
  const saved =
    localStorage.getItem(
      "payflow-profile"
    );

  if (!saved) return;

  try {
    const profile =
      JSON.parse(saved);

    if ($("#profileName")) {
      $("#profileName").value =
        profile.name || "";
    }

    if ($("#profileEmail")) {
      $("#profileEmail").value =
        profile.email || "";
    }

    if ($("#profilePhone")) {
      $("#profilePhone").value =
        profile.phone || "";
    }
  } catch {
    localStorage.removeItem(
      "payflow-profile"
    );
  }
}

loadProfile();


/* =========================================================
   SETTINGS TOGGLES
   ========================================================= */

[
  "#emailNotifications",
  "#paymentNotifications",
  "#twoStep",
].forEach((selector) => {
  const element = $(selector);

  if (!element) return;

  const key =
    `payflow-${selector.replace("#", "")}`;

  const saved =
    localStorage.getItem(key);

  if (saved !== null) {
    element.checked =
      saved === "true";
  }

  element.addEventListener(
    "change",
    () => {
      localStorage.setItem(
        key,
        String(element.checked)
      );

      showToast(
        "Settings updated.",
        "success"
      );
    }
  );
});


/* =========================================================
   SETTINGS THEME
   ========================================================= */

const settingsTheme =
  $("#settingsTheme");

if (settingsTheme) {
  settingsTheme.value =
    localStorage.getItem(
      "payflow-theme"
    ) || "dark";

  settingsTheme.addEventListener(
    "change",
    () => {
      const theme =
        settingsTheme.value;

      localStorage.setItem(
        "payflow-theme",
        theme
      );

      applyTheme(theme);

      showToast(
        "Theme preference updated.",
        "success"
      );
    }
  );
}


/* =========================================================
   PASSWORD CHANGE
   ========================================================= */

const passwordForm =
  $("#passwordForm");

if (passwordForm) {
  passwordForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const current =
        $("#currentPassword");

      const newPassword =
        $("#newPassword");

      clearErrors(passwordForm);

      const currentValid =
        validateRequired(
          current,
          "Current password is required."
        );

      const newRequired =
        validateRequired(
          newPassword,
          "New password is required."
        );

      const newValid =
        newRequired &&
        newPassword.value.length >= 6;

      if (
        !newValid &&
        newPassword.value
      ) {
        showFieldError(
          newPassword,
          "Password must be at least 6 characters."
        );
      }

      if (
        !currentValid ||
        !newValid
      ) {
        return;
      }

      passwordForm.reset();

      showToast(
        "Password updated successfully.",
        "success"
      );
    }
  );
}


/* =========================================================
   INVOICE
   ========================================================= */

const printInvoice =
  $("#printInvoice");

if (printInvoice) {
  printInvoice.addEventListener(
    "click",
    () => {
      window.print();
    }
  );
}

function createInvoicePreview() {
  const preview =
    $("#invoicePreview");

  if (!preview) return;

  preview.innerHTML = `
    <div class="invoice-card">
      <h2>Razorpay Invoice</h2>

      <p>
        Invoice generated from Razorpay
        Digital Payments Platform.
      </p>

      <hr>

      <p>
        <strong>Invoice ID:</strong>
        INV-${Date.now().toString().slice(-6)}
      </p>

      <p>
        <strong>Date:</strong>
        ${new Date().toLocaleDateString("en-IN")}
      </p>

      <p>
        <strong>Status:</strong>
        Paid
      </p>

      <h3>
        Amount: ₹2,499
      </h3>
    </div>
  `;
}

createInvoicePreview();


/* =========================================================
   INITIAL PAYMENT FIELD
   ========================================================= */

updatePaymentFields("upi");


/* =========================================================
   GLOBAL CLICK HANDLERS
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-open-invoice]"
      );

    if (button) {
      createInvoicePreview();
      openModal("invoiceModal");
    }
  }
);


/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

console.log(
  "PayFlow JavaScript loaded successfully."
);