import validator from "validator";

export const validateRegisterData = (userData) => {
  const { name, email, password, role } = userData;

  if (!name || name.length < 2) {
    throw new Error("firstName is required with minumum 2 characters");
  }

  if (!email || !validator.isEmail(email.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "A strong password is required, password contains (min 8 chars, with letters, numbers & symbols)"
    );
  }

  if (!role || !["INTERN", "MANAGER"].includes(role)) {
    throw new Error("role is required and must be one of 'INTERN', 'MANAGER'");
  }
};

export const validateLoginData = (userData) => {
  const { email, password } = userData;

  if (!email || !validator.isEmail(email.toLowerCase().trim())) {
    throw new Error("A valid email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};
