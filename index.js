const password = document.querySelector(".password-display");
const slider = document.querySelector(".slider");
const passwordsOptions = document.querySelectorAll(".password-options input");

const characters_set = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "1234567890",
  symbols: "!@#$%^&*()",
};

const strengthLevel = {
  1: "TOO WEAK!",
  2: "WEAK",
  3: "MEDIUM",
  4: "STRONG",
};

function handleSliderInput(e) {
  const min = e.target.min;
  const max = e.target.max;
  const value = e.target.value;
  const range = ((value - min) * 100) / (max - min) + "%";

  slider.style.setProperty("--range", range);
  document.querySelector(".count").innerText = value;
}

function handlePasswordCopy() {
  if (!password.innerText?.trim()) return;

  navigator.clipboard.writeText(password.innerText);
  document.querySelector(".copy-btn").disabled = true;
  document.querySelector(".copy-btn img.copy").hidden = true;
  document.querySelector(".copy-btn img.copied").hidden = false;
}

function EnableGenerateButton() {
  document.querySelector(".generate-button").disabled = false;

  passwordsOptions.forEach((option) => {
    option.removeEventListener("click", EnableGenerateButton);
  });
}

function getPasswordOptions() {
  const options = [];

  passwordsOptions.forEach((option) => {
    if (option.checked) options.push(option.id);
  });

  return options;
}

function getCharacters() {
  const characters = [];
  const options = getPasswordOptions();

  options.forEach((option) => {
    characters.push(...characters_set[option].split(""));
  });

  return characters;
}

function calculatePasswordStrength(password) {
  let strength;
  const isMinimumLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

  if (!isMinimumLength) strength = 1;
  else if (hasDigit && hasSpecialChar && hasLowerCase && hasUpperCase)
    strength = 4;
  else if (hasDigit || hasSpecialChar) strength = 3;
  else if (hasLowerCase || hasUpperCase) strength = 2;

  document.querySelector("[data-level]").dataset.level = strength;
  document.querySelector(".status").innerText = strengthLevel[strength];
}

function generatePassword() {
  let password = "";
  const passwordLength = slider.value;
  const characters = getCharacters();

  if (!characters.length) return;

  for (let i = 0; i < passwordLength; i++) {
    const index = Math.floor(Math.random() * characters.length);
    password += characters[index];
  }

  calculatePasswordStrength(password);

  document.querySelector(".password-display").innerText = password;
  document.querySelector(".copy-btn").disabled = false;
  document.querySelector(".copy-btn img.copy").hidden = false;
  document.querySelector(".copy-btn img.copied").hidden = true;
}

slider.addEventListener("input", handleSliderInput);
passwordsOptions.forEach((option) => {
  option.addEventListener("click", EnableGenerateButton);
});
