(() => {
  "use strict";

  const messages = window.PROTOTYPE_MESSAGES || {};
  const picker = document.getElementById("locale-picker");
  const live = document.getElementById("live-status");
  const screens = [...document.querySelectorAll("[data-screen]")];
  let locale = ["en", "fr", "de"].includes((navigator.language || "en").slice(0, 2))
    ? navigator.language.slice(0, 2)
    : "en";
  let requestDraft = null;

  function t(key) {
    return (messages[locale] && messages[locale][key]) || (messages.en && messages.en[key]) || key;
  }

  function applyLocale(next) {
    locale = messages[next] ? next : "en";
    document.documentElement.lang = locale;
    picker.value = locale;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (messages[locale] && messages[locale][key]) element.textContent = messages[locale][key];
    });
  }

  function showScreen(name, moveFocus = true) {
    const target = document.getElementById("screen-" + name);
    if (!target) return;
    screens.forEach((screen) => { screen.hidden = screen !== target; });
    if (moveFocus) {
      const heading = target.querySelector("h1");
      if (heading) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
  }

  function setLocalizedText(element, key) {
    element.setAttribute("data-i18n", key);
    element.textContent = t(key);
  }

  function setInlineStatus(container, key, className = "notice") {
    let status = container.querySelector("[data-prototype-status]");
    if (!status) {
      status = document.createElement("p");
      status.setAttribute("data-prototype-status", "");
      status.setAttribute("role", "status");
      status.className = className;
      container.append(status);
    }
    setLocalizedText(status, key);
  }

  function showFormError(element, key = "pleaseCheck") {
    setLocalizedText(element, key);
  }

  function setInvalidState(field, error, key = "pleaseCheck") {
    showFormError(error, key);
    field.setAttribute("aria-invalid", "true");
    if (error.id) {
      const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
      describedBy.add(error.id);
      field.setAttribute("aria-describedby", [...describedBy].join(" "));
    }
  }

  function clearInvalidState(field, error) {
    field.removeAttribute("aria-invalid");
    if (!error || !error.id) return;
    const describedBy = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== error.id);
    if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function validateNativeForm(form) {
    const invalid = form.querySelector(":invalid");
    if (!invalid) return true;
    const error = form.querySelector("[data-prototype-error]");
    if (error) setInvalidState(invalid, error);
    invalid.focus();
    return false;
  }

  function wireInlineValidation(form, errorSelector = "[data-prototype-error]") {
    const clear = (event) => {
      const field = event.target;
      const error = form.querySelector(errorSelector);
      if (field.validity && field.validity.valid) clearInvalidState(field, error);
      if (error && !form.querySelector('[aria-invalid="true"]')) {
        error.removeAttribute("data-i18n");
        error.textContent = "";
      }
    };
    form.addEventListener("input", clear);
    form.addEventListener("change", clear);
  }

  [
    ["signup-form", "#signup-error"],
    ["request-form", "#request-error"],
    ["offer-form"],
    ["report-form"],
    ["moderation-form"],
    ["message-form"],
    ["dispute-form"]
  ].forEach(([id, errorSelector]) => {
    wireInlineValidation(document.getElementById(id), errorSelector);
  });

  applyLocale(locale);

  picker.addEventListener("change", () => applyLocale(picker.value));

  document.addEventListener("click", (event) => {
    const demo = event.target.closest("[data-demo]");
    if (demo) {
      const routes = { requester: "signup", helper: "detail", moderator: "moderation" };
      showScreen(routes[demo.dataset.demo]);
      return;
    }
    const route = event.target.closest("[data-go]");
    if (route) {
      showScreen(route.dataset.go);
      return;
    }
    const action = event.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "share") {
      setLocalizedText(live, "shareNotice");
    } else if (action.dataset.action === "confirm-terms") {
      const requesterConfirmed = document.getElementById("requester-confirm").checked;
      const helperConfirmed = document.getElementById("helper-confirm").checked;
      const error = document.getElementById("agreement-error");
      if (!requesterConfirmed || !helperConfirmed) {
        const missing = requesterConfirmed ? document.getElementById("helper-confirm") : document.getElementById("requester-confirm");
        setInvalidState(missing, error, "bothConfirm");
        missing.focus();
      } else {
        error.removeAttribute("data-i18n");
        error.textContent = "";
        showScreen("chat");
      }
    } else if (action.dataset.action === "complete") {
      setLocalizedText(document.getElementById("outcome-status"), "prototypeOnly");
    } else if (action.dataset.action === "cancel") {
      document.getElementById("outcome-status").textContent = t("prototypeOnly");
    } else if (action.dataset.action === "export") {
      setLocalizedText(document.getElementById("account-status"), "exportResult");
    } else if (action.dataset.action === "delete") {
      setLocalizedText(document.getElementById("delete-status"), "deleteResult");
    }
  });

  ["requester-confirm", "helper-confirm"].forEach((id) => {
    document.getElementById(id).addEventListener("change", (event) => {
      event.currentTarget.removeAttribute("aria-invalid");
      event.currentTarget.removeAttribute("aria-describedby");
      const error = document.getElementById("agreement-error");
      error.removeAttribute("data-i18n");
      error.textContent = "";
    });
  });

  ["requester-confirm", "helper-confirm"].forEach((id) => {
    document.getElementById(id).addEventListener("change", (event) => {
      const error = document.getElementById("agreement-error");
      clearInvalidState(event.currentTarget, error);
      error.removeAttribute("data-i18n");
      error.textContent = "";
    });
  });

  const searchForm = document.getElementById("search-form");
  const feedHeading = document.querySelector("#screen-home .section-heading");
  const feedCard = document.querySelector("#screen-home .request-card");
  const feedPrivacy = document.querySelector("#screen-home .privacy-callout");
  const noResults = document.createElement("div");
  noResults.className = "notice";
  noResults.hidden = true;
  const emptyTitle = document.createElement("h2");
  emptyTitle.setAttribute("data-i18n", "emptyTitle");
  const emptyText = document.createElement("p");
  emptyText.setAttribute("data-i18n", "emptyText");
  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "button button-secondary";
  clearButton.setAttribute("data-action", "clear-search");
  clearButton.setAttribute("data-i18n", "browse");
  noResults.append(emptyTitle, emptyText, clearButton);
  searchForm.after(noResults);

  function filterRequests() {
    const city = document.getElementById("filter-city").value.trim().toLowerCase();
    const category = document.getElementById("filter-category").value;
    const language = document.getElementById("filter-language").value;
    const date = document.getElementById("filter-date").value;
    const matches = (!city || city.includes("berlin")) &&
      (!category || category === "airport") &&
      (!language || language === "en") &&
      (!date || date === "weekday");
    feedHeading.hidden = !matches;
    feedCard.hidden = !matches;
    feedPrivacy.hidden = !matches;
    noResults.hidden = matches;
    if (!matches) {
      noResults.querySelector("[data-i18n]").textContent = t("emptyTitle");
      noResults.querySelectorAll("[data-i18n]")[1].textContent = t("emptyText");
      noResults.querySelector("button").textContent = t("browse");
    }
    setLocalizedText(live, matches ? "requestsFound" : "noRequestsFound");
  }
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterRequests();
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest('[data-action="clear-search"]')) {
      searchForm.reset();
      document.getElementById("filter-city").value = "";
      filterRequests();
    }
  });

  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("account-email");
    const adult = document.getElementById("adult-confirm");
    const error = document.getElementById("signup-error");
    if (!email.checkValidity()) {
      setInvalidState(email, error);
      email.focus();
      return;
    }
    if (!adult.checked) {
      setInvalidState(adult, error);
      adult.focus();
      return;
    }
    error.removeAttribute("data-i18n");
    error.textContent = "";
    showScreen("verification");
  });

  const travelerType = document.getElementById("traveler-type");
  const permissionWrap = document.getElementById("permission-wrap");
  const permissionCheck = document.getElementById("permission-check");
  const amountWrap = document.getElementById("amount-wrap");
  const amount = document.getElementById("amount");
  function updateConditionalFields() {
    const anotherAdult = travelerType.value === "adult";
    permissionWrap.hidden = !anotherAdult;
    permissionCheck.required = anotherAdult;
    const compensated = document.querySelector('input[name="mode"]:checked').value === "compensated";
    amountWrap.hidden = !compensated;
    amount.required = compensated;
    const error = document.getElementById("request-error");
    if (!anotherAdult) clearInvalidState(permissionCheck, error);
    if (!compensated) clearInvalidState(amount, error);
    if (!permissionCheck.getAttribute("aria-invalid") && !amount.getAttribute("aria-invalid") && !document.getElementById("request-form").querySelector('[aria-invalid="true"]')) {
      error.removeAttribute("data-i18n");
      error.textContent = "";
    }
  }
  travelerType.addEventListener("change", updateConditionalFields);
  document.querySelectorAll('input[name="mode"]').forEach((input) => input.addEventListener("change", updateConditionalFields));
  updateConditionalFields();

  const requestForm = document.getElementById("request-form");
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.getElementById("request-error");
    const invalid = requestForm.querySelector(":invalid");
    if (invalid) {
      setInvalidState(invalid, error);
      invalid.focus();
      return;
    }
    error.removeAttribute("data-i18n");
    error.textContent = "";
    const category = document.getElementById("request-category").value;
    const mode = requestForm.querySelector('input[name="mode"]:checked').value;
    const categoryKeys = { airport: "catAirport", newcomer: "catNewcomer", everyday: "catEveryday", appointment: "catAppointment", other: "otherOption" };
    const modeKeys = { free: "free", compensated: "compensated", flexible: "flexible" };
    const proposedAmount = mode === "compensated" ? " · " + amount.value + " EUR" : "";
    requestDraft = {
      category: t(categoryKeys[category]),
      summary: document.getElementById("request-summary").value.trim(),
      mode: t(modeKeys[mode]),
      other: category === "other"
    };
    document.getElementById("preview-category").textContent = requestDraft.category;
    document.getElementById("preview-summary").textContent = requestDraft.summary;
    document.getElementById("preview-mode").textContent = requestDraft.mode + proposedAmount;
    const alert = document.getElementById("preview-alert");
    alert.hidden = !requestDraft.other;
    alert.textContent = requestDraft.other ? t("pendingOther") : "";
    showScreen("preview");
  });

  document.querySelector('[data-action="publish"]').addEventListener("click", () => {
    showScreen(requestDraft && requestDraft.other ? "pending" : "offers");
  });

  document.getElementById("offer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateNativeForm(form)) return;
    setInlineStatus(form, "notSent", "notice");
  });

  document.getElementById("message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("message-input");
    if (!input.value.trim()) {
      const error = event.currentTarget.querySelector("[data-prototype-error]");
      setInvalidState(input, error);
      input.focus();
      return;
    }
    const item = document.createElement("li");
    item.className = "message sent";
    const text = document.createElement("p");
    text.textContent = input.value.trim();
    item.append(text);
    document.getElementById("message-list").append(item);
    input.value = "";
    setLocalizedText(document.getElementById("message-status"), "notSent");
  });

  document.getElementById("dispute-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateNativeForm(event.currentTarget)) return;
    showScreen("dispute-sent");
  });

  document.getElementById("report-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateNativeForm(event.currentTarget)) return;
    showScreen("report-sent");
  });

  document.getElementById("moderation-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateNativeForm(form)) return;
    const decisionKey = event.submitter && event.submitter.dataset.choice === "approve" ? "approvalSaved" : "rejectionSaved";
    setLocalizedText(document.getElementById("moderation-status"), decisionKey);
    form.reset();
  });

  window.addEventListener("offline", () => { setLocalizedText(live, "offlineTitle"); });
})();
