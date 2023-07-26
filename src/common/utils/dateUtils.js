import moment from "moment";

export const getDoBFromNRIC = (nric) => {
  // Remove non-digit characters from the NRIC
  const cleanedNRIC = nric.replace(/\D/g, '');

  // Extract the year, month, and day from the cleaned NRIC
  const year = cleanedNRIC.substr(0, 2);
  const month = cleanedNRIC.substr(2, 2);
  const day = cleanedNRIC.substr(4, 2);

  // Create a Date object with the extracted DOB
  const fullYear = parseInt(year, 10) < 50 ? `20${year}` : `19${year}`;
  const dob = `${day}/${month}/${fullYear}`;
  return dob.toString();
};

export const getAgeFromDoB = (dateString) => {
  var birthDate = new Date(dateString);
  var age = getAge(birthDate);
  return age;
};

export const getAgeFromNRIC = (nric) => {
  try {
    var birthDate = getDoBFromNRIC(nric)
    var age = getAge(birthDate);
    return age;
  } catch (error) {
    return 0;
  }
};

export const getAge= (birthdate) => {
  const dob = moment(birthdate, 'DD/MM/YYYY');
  const now = moment();
  const diffDuration = moment.duration(now.diff(dob));
  const diffYears = diffDuration.years();
  const diffMonths = diffDuration.months();
  const diffDays = diffDuration.days();
  
  const age = {
    year: diffYears,
    month : diffMonths,
    day: diffDays,
  }; 
  return age;
};

