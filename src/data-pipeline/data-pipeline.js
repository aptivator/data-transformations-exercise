import {flattenObject, getMultiFieldFilterer}      from '../_lib/object-utils'; 
import {getMultiFieldSorter, transformObjectValue} from '../_lib/object-utils';
import {identity, sum}                             from '../_lib/utils';

let filterer = getMultiFieldFilterer([['guest_type', 'guest']]);
let sorter = getMultiFieldSorter([['last_name', 'string'], ['first_name', 'string']]);

export const dataPipeline = [{
  elementId: 'original',
  operation: identity
}, {
  elementId: 'flattened-objects',
  operation: (data) => data.map((o) => flattenObject(o))
}, {
  elementId: 'transformed-property',
  operation(data) {
    return data.map((o) => transformObjectValue(o, 'some_array', sum, 'some_total'));
  }
}, {
  elementId: 'filtered-by-property',
  operation: (data) => data.filter(filterer)
}, {
  elementId: 'sorted-by-multiple-properties',
  operation: (data) => data.sort(sorter)
}];
