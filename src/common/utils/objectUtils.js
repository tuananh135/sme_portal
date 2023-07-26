const updateObjectPropInArray = (arr, objectKey, newValue) => {
  try {
    const recordIndex = arr.findIndex(
      (item) => item[objectKey] === newValue[objectKey]
    );
    arr[recordIndex] = newValue;
    console.log("new arr", arr);
    return arr;
  } catch (error) {
    console.error(error);
    return arr;
  }
};

const sortByProps = (arr, propName, sortOrder = "ASC")=>{
    return arr.sort((a,b)=> 
    {
      if ( a[propName] < b[propName] ){
        return sortOrder === "ASC" ? -1 : 1;
      }
      if ( a[propName] > b[propName] ){
        return  sortOrder === "ASC" ? 1 : -1;
      }
      return 0;
    }
    );
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export { updateObjectPropInArray, sortByProps, blobToBase64 };
