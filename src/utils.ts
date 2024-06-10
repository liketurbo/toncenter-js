import { camelCase, isArray, isObject, transform } from 'lodash';

export function toCamelCase(obj: any): any {
    if (isArray(obj)) {
        return obj.map(toCamelCase);
    } else if (isObject(obj)) {
        return transform(obj, (result, value, key) => {
            if (key === '@type' || key === '@extra') {
                return;
            }
            result[camelCase(key)] = toCamelCase(value);
        });
    }
    return obj;
}