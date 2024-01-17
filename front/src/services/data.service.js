export function updateArray(oldArray, newArray) {
  const preparedNewArray = new Map(newArray.map((item) => [item.id, item]));

  return oldArray.map((item) => {
    return preparedNewArray.has(item.id) ? preparedNewArray.get(item.id) : item;
  });
}

export function createFormData(form = {}) {
  const formData = new FormData();

  for (let key in form) {
    if (Array.isArray(form[key])) {
      form[key].forEach((item) => formData.append(key, item));
    } else if (typeof form[key] === "boolean") {
      formData.append(key, Number(form[key]));
    } else {
      formData.append(key, form[key]);
    }
  }

  return formData;
}

export default {
  updateArray,
  createFormData,
};
