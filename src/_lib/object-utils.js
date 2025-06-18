import {isObject} from './utils';
import {sorters}  from './sorters';

export function deleteObjectValue(o, address) {
  let normalizedAddress = normalizeAddress(address);
  let parentAddress = normalizedAddress.slice(0, -1);
  let parentValue = getObjectValue(o, parentAddress);

  if(isObject(parentValue)) {
    let deleteAddress = normalizedAddress.at(-1);

    if(Object.hasOwn(parentValue, deleteAddress)) {
      let value = parentValue[deleteAddress];
      delete parentValue[deleteAddress];

      if(value !== undefined) {
        return true;
      }
    }
  }
}

export function flattenObject(o, mutateOriginal, target = mutateOriginal ? o : {}) {
  Object.entries((o)).forEach(([key, value]) => {
    if(isObject(value)) {
      flattenObject(value, mutateOriginal, target);

      if(mutateOriginal) {
        delete target[key];
      }

      return;
    }

    if(!mutateOriginal && Array.isArray(value)) {
      value = value.slice();
    }

    target[key] = value;
  });

  return target;
}

export function getMultiFieldFilterer(filterInfo) {
  return function(o) {
    for(let [address, expectedValue] of filterInfo) {
      let value = getObjectValue(o, address);

      if(value !== expectedValue) {
        return;
      }
    }

    return true;
  }
}

export function getMultiFieldSorter(sortInfo) {
  return function(o1, o2) {
    for(let [address, sorterName, desc] of sortInfo) {
      let value1 = getObjectValue(o1, address);
      let value2 = getObjectValue(o2, address);
  
      if(desc) {
        [value1, value2] = [value2, value1];
      }
  
      let sortResult = sorters[sorterName](value1, value2);
  
      if(sortResult) {
        return sortResult;
      }
    }
  
    return 0;
  }
}

export function getObjectValue(o, address) {
  let normalizedAddress = normalizeAddress(address);

  for(let part of normalizedAddress) {
    if(!Object.hasOwn(o, part)) {
      throw new Error('invalid object value address:', normalizedAddress.join('.'));
    }

    o = o[part];
  }

  return o;
}

function normalizeAddress(address) {
  if(!Array.isArray(address)) {
    address = address.split('.');
  }

  return address;
}

export function setObjectValue(o, address, value) {
  let normalizedAddress = normalizeAddress(address);

  for(var i = 0, lastIndex = normalizedAddress.length - 1; i < lastIndex; i++) {
    let part = normalizedAddress[i];

    if(!isObject(o[part])) {
      o[part] = {};
    }

    o = o[part];
  }

  return (o[normalizedAddress[i]] = value);
}

export function transformObjectValue(o, address, transform, newAddress) {
  let value = getObjectValue(o, address);
  let transformedValue = transform(value);

  if(newAddress) {
    deleteObjectValue(o, address);
    address = newAddress;
  }

  setObjectValue(o, address, transformedValue);
  return o;
}
