// Wait until the page is ready
document.addEventListener("DOMContentLoaded", function () {
  var popup = document.getElementById("emailPopup");
  var backdrop = document.getElementById("popupBackdrop");
  var closeButton = document.getElementById("closePopup");
  var emailForm = document.getElementById("emailForm");
  var emailInput = document.getElementById("emailInput");
  var formMessage = document.getElementById("formMessage");
  var firstFocusableElement = closeButton;

  var popupDelay = 5000;
  var popupStorageKey = "nexusInstitudePopupSeen";
  var emailStorageKey = "nexusInstitudeEmails";
  var popupTimer;
  var popupClosed = false;

  // Show the popup after a short delay
  function showPopup() {
    popup.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    firstFocusableElement.focus();
  }

  function hidePopup() {
    popup.classList.add("hidden");
    backdrop.classList.add("hidden");
  }

  // Remember that the user already saw the popup
  function savePopupState() {
    localStorage.setItem(popupStorageKey, "true");
  }

  // Save submitted emails in localStorage
  function saveEmail(email) {
    var savedEmails = localStorage.getItem(emailStorageKey);
    var emailList = savedEmails ? JSON.parse(savedEmails) : [];

    emailList.push({
      email: email,
      savedAt: new Date().toISOString()
    });

    localStorage.setItem(emailStorageKey, JSON.stringify(emailList));
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    var emailValue = emailInput.value.trim();

    // Basic check before saving the email
    if (!emailValue) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.classList.remove("success");
      return;
    }

    saveEmail(emailValue);
    formMessage.textContent = "Thanks. You are now on the update list.";
    formMessage.classList.add("success");
    savePopupState();
    emailForm.reset();

    window.setTimeout(function () {
      hidePopup();
    }, 1400);
  }

  // Only show the popup once for each browser
  if (!localStorage.getItem(popupStorageKey)) {
    popupTimer = window.setTimeout(function () {
      if (!popupClosed) {
        showPopup();
      }
    }, popupDelay);
  }

  closeButton.addEventListener("click", function () {
    popupClosed = true;
    hidePopup();
  });

  backdrop.addEventListener("click", function () {
    popupClosed = true;
    hidePopup();
  });

  emailForm.addEventListener("submit", handleFormSubmit);

  emailInput.addEventListener("input", function () {
    formMessage.textContent = "";
    formMessage.classList.remove("success");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !popup.classList.contains("hidden")) {
      popupClosed = true;
      hidePopup();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (popupTimer) {
      window.clearTimeout(popupTimer);
    }
  });
});
