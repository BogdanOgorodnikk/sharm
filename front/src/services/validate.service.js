export const PHONE_MIN_LENGTH = 11;
export const PHONE_MAX_LENGTH = 13;
export const PASSWORD_MIN_LENGTH = 6;

// Use "g" flag in RegExp,if want to use in OurInput
export const LETTERS_AND_SYMBOLS_REG_EXP = /\D/g;
export const NUMBER_REG_EXP = /\d*\.?\d*/g;
export const PLUS_AND_SPACE_REG_EXP = /[\s+]/g;
export const KEEP_ONLY_NUMBER_REG_EXP = /[^\d;]/g;

export const phoneMinLength = (value) => {
  const replacePhoneValue = clearPhone(value);

  return replacePhoneValue.length >= PHONE_MIN_LENGTH;
};

export const phoneMaxLength = (value) => {
  const replacePhoneValue = clearPhone(value);

  return replacePhoneValue.length <= PHONE_MAX_LENGTH;
};

export const phoneIsNumber = (value) => {
  const preparedPhone = clearPhone(value);

  return preparedPhone && !preparedPhone.match(LETTERS_AND_SYMBOLS_REG_EXP);
};

export const clearPhone = (value) => {
  return value.replace(KEEP_ONLY_NUMBER_REG_EXP, "");
};

export default {
  PHONE_MIN_LENGTH,
  PHONE_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  LETTERS_AND_SYMBOLS_REG_EXP,
  NUMBER_REG_EXP,
  PLUS_AND_SPACE_REG_EXP,
  phoneMinLength,
  phoneMaxLength,
  clearPhone,
};
