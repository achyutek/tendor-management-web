import React from "react";
import { Select } from "antd";
import { debounce } from "lodash";

const { Option } = Select;

export const helperFunctions = {
  convertToOptions,
  convertToOptionsJSON,
  convertArrayForTypeahead,
  convertToOptionsArray,
  convertJsonForTypeahead,
  convertToOptionsTypeahead,
  debounceEventHandler,
};

function convertToOptionsJSON(array: any, field: any) {
  return array.map((element: any, key: any) => {
    return (
      <Option key={key} value={element[field]}>
        {element[field]}
      </Option>
    );
  });
}

function convertToOptionsArray(array: any) {
  return array.map((element: any, key: any) => {
    return (
      <Option key={key} value={element}>
        {element}
      </Option>
    );
  });
}

function convertToOptions(array: any, field = null) {
  let isJson = false;
  if (typeof array[0] === "object") {
    isJson = true;
  }
  if (isJson) {
    return convertToOptionsJSON(array, field);
  } else {
    return convertToOptionsArray(array);
  }
}

function convertArrayForTypeahead(array: any) {
  let tempArray: any = [];
  array.forEach((element: any) => {
    let jsonFormat = { value: element };
    tempArray.push(jsonFormat);
  });
  return tempArray;
}

function convertJsonForTypeahead(array: any) {
  let tempArray: any = [];
  array.forEach((element: any) => {
    let jsonFormat = { value: element.name, id: element.id };
    tempArray.push(jsonFormat);
  });
  return tempArray;
}

function convertToOptionsTypeahead(array: any, field: any, id: any) {
  return array.map((element: any, key: any) => {
    return (
      <Option key={key} value={element[field]} id={element[id]}>
        {element[field]}
      </Option>
    );
  });
}

// function debounce(func, wait, immediate) {
//     var timeout;
//     return function () {
//         var context = this,
//             args = arguments;
//         var later = function () {
//             timeout = null;
//             if (!immediate) func.apply(context, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(context, args);
//     };
// }

function debounceEventHandler(...args: any[]) {
  //   const debounced = debounce(...args);
  return function (e: any) {
    e.persist();
    // return debounced(e);
  };
}
