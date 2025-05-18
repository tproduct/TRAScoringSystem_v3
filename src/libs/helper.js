export const toUpperCase = (str) => {
  return str.charAt(0, 0).toUpperCase() + str.slice(1);
};

export const sumOfArray = (arr) => {
  return arr.reduce(
    (acc, val) => (val === null || acc === null ? null : acc + val),
    0
  );
};

export const sumOfEntries = (entries) => {
  return (
    Math.round(
      entries.reduce((acc, [skill, val]) => acc + Number(val), 0) * 100
    ) / 100
  );
};

export const isNullObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return false;
  return Object.values(obj).every((value) => {
    if (typeof value === "object" && value !== null) {
      return isNullObject(value); // 再帰的にチェック
    }
    return value === null;
  });
};

export const containsNull = (obj) => {
  if (typeof obj !== "object" || obj === null) return false;
  return Object.values(obj).some((value) => value === null);
};

export const flattenArray = (arr) => {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
    []
  );
};

export const removeKey = (obj, keyName) => {
  const { [keyName]: _, ...rest } = obj;
  return rest;
};

export const removeKeys = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};

export const maxOfObjArray = (arr, field) => {
  const newArr = arr.map((item) => item[field]);
  return Math.max(...newArr);
};

export const isConfigIncomplete = (categories, config, additional = null) => {
  if (!config) return true;

  const roundLabels = {
    1: ["final"],
    2: ["qualify", "final"],
    3: ["qualify", "semifinal", "final"],
  };

  const roundArrays = categories.reduce(
    (acc, category) => ({
      ...acc,
      [category.id]: roundLabels[category.rounds],
    }),
    {}
  );
  const needs = { qualify: 0, semifinal: 0, final: 0 };
  Object.entries(roundArrays).forEach(([categoryId, roundArray]) => {
    roundArray.forEach((round) => {
      if (additional !== null) {
        needs[round] += Number(
          additional[round].find((item) => item.category_id === categoryId)
            ?.routines || 0
        );
      } else {
        needs[round] += 1;
      }
    });
  });

  return !Object.entries(config).every(([key, value]) =>
    value === null ? needs[key] === 0 : value.length === needs[key]
  );
};

export const isWithinOneDay = (dateStr) => {
  const updatedAt = new Date(dateStr.replace(" ", "T"));
  const now = new Date();

  const diffMs = now.getTime() - updatedAt.getTime();

  return diffMs >= 0 && diffMs <= 24 * 60 * 60 * 1000;
};
