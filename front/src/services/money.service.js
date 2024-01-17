export function separatedMoney(money, decimalPlaces = 2, delimiter = ",") {
  const SPACE_BETWEEN_THREE_SYMBOL_REGEXP = /(\d)(?=(\d{3})+(\D|$))/g;
  const REPLACE_VALUE = "$1 ";

  const preparedMoney = money ? money.toFixed(decimalPlaces) : 0;

  let [integer, penny] = String(preparedMoney).split(".");

  integer = integer.replace(SPACE_BETWEEN_THREE_SYMBOL_REGEXP, REPLACE_VALUE);

  if (preparedMoney === 0) {
    integer = "0";
    penny = "00";
  }

  return { integer, penny, delimiter };
}

export const SYMBOL_MINUS = "–";
export const SINGLE_ZERO = "0";
export const DOUBLE_ZERO = "00";
export const DEBIT_OBLIGATION = "debit";
export const CREDIT_OBLIGATION = "credit";
export const ADD_SPACE_IN_CARD_REG_EX = /(.{4})/g;
export const ADD_SPACE_IN_DINNER_CLUB_CARD_REG_EX = /(.{4})(.{6})(.{4})/g;
export const ADD_SPACE_IN_AMERICAN_EXPRESS_CARD_REG_EX = /(.{4})(.{6})(.{5})/g;
export const ADD_SPACE_IN_IBAN_REG_EX = /(.{2})(.{2})(.{6})(.{5})(.*)/g;
export const ADD_SPACE_IN_MONEY_REG_EX = /(\d)(?=(\d{3})+(\D|$))/g;
export const AMERICAN_EXPRESS_CARD_LENGTH = 15;
export const DINER_CLUB_CARD_LENGTH = 14;
export const MONEY_SIGN_TYPE = {
  positive: "positive",
  negative: "negative",
};

export default {
  SYMBOL_MINUS,
  SINGLE_ZERO,
  DOUBLE_ZERO,
  DEBIT_OBLIGATION,
  CREDIT_OBLIGATION,
  ADD_SPACE_IN_CARD_REG_EX,
  ADD_SPACE_IN_DINNER_CLUB_CARD_REG_EX,
  ADD_SPACE_IN_AMERICAN_EXPRESS_CARD_REG_EX,
  ADD_SPACE_IN_IBAN_REG_EX,
  ADD_SPACE_IN_MONEY_REG_EX,
  AMERICAN_EXPRESS_CARD_LENGTH,
  DINER_CLUB_CARD_LENGTH,
  MONEY_SIGN_TYPE,
  separatedMoney,
};
