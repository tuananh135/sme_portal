import * as XLSX from "xlsx";

export const validateFileTypeAndSize = (file, type, size) => {
  if (!file) return { error: true, message: "No file" };
  const isTooBig = file?.size / 1024 / 1024 > size;
  const fileTypeSupport = type?.includes(file?.type);
  if (!fileTypeSupport && !!type.length) {
    return { error: true, message: "Sorry, uploaded file format is invalid" };
  }
  if (isTooBig) {
    // eslint-disable-next-line no-template-curly-in-string
    return { error: true, message: `Sorry, the uploaded file exceeded the maximum size of ${size}MB` };
  }
  return { error: false };
};

export const readFileToObject = (file) => {
  try {
    return new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.onload = (evt) => { // evt = on_file_select event
          /* Parse data */
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, {type:'binary',cellText:false,cellDates:true});
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert to object */
          const dataObj = XLSX.utils.sheet_to_row_object_array(ws, {raw:false,dateNF:'dd/mm/yyyy', defval: ''});

           /* Filter out empty rows */
           const filteredDataObj = dataObj.filter(row => !Object.values(row).every(val => val === ''));
           console.log("filtered DataObj result",filteredDataObj);

          /* Update state */
          resolve(filteredDataObj);
      };
      reader.onerror = (error) => {
          reject(error);
        };
      reader.readAsBinaryString(file);
  })
  } catch (error) {
    return new Promise((resolve, reject) =>{
      reject(error);
    });
  }
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const mappingFileExtensionToConvention =(type)=>{
  switch(type) {
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return '.xlsx';
    case 'text/csv':
      return '.csv';
    case 'application/vnd.ms-excel':
      return '.xls';
    default:
      return '';
      // code block
  }
}

export const getDataAndExtensionFromBase64=(base64)=>{
  const fileData = base64?.split(',')[1];
  const fileExt = base64?.split(',')[0]?.split(';')[0]?.split('/')[1];
  return {FileData: fileData, FileExt: fileExt}
}

export const constructNewFileName=(currentFileName, newFileName)=>{
  const lastDotIndex = currentFileName?.lastIndexOf('.');
  return `${newFileName}.${currentFileName.substr(lastDotIndex+1)}`
}
