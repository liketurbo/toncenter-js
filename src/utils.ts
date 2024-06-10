import { camelCase, isArray, isObject, transform } from "lodash";

export function toCamelCase(obj: any): any {
  if (isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (isObject(obj)) {
    return transform(obj, (result, value, key: any) => {
      const casedKey = key.startsWith("@")
        ? `@${camelCase(key)}`
        : camelCase(key);
      result[casedKey] = toCamelCase(value);
    });
  }
  return obj;
}

export function ignoreFields(obj: any, fieldsToIgnore: string[]): any {
  if (isArray(obj)) {
    return obj.map((item) => ignoreFields(item, fieldsToIgnore));
  } else if (isObject(obj)) {
    return transform(obj, (result, value, key) => {
      if (fieldsToIgnore.includes(key)) {
        return;
      }
      result[key] = ignoreFields(value, fieldsToIgnore);
    });
  }
  return obj;
}
