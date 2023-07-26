export const removeEmptyArrayAttribute = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if (v instanceof Array && v.length === 0) return false;
      else return true;
    })
  );
 }