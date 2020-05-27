export const isEmpty = value => {
  return value === undefined || value === null || value === '' || value.toString().replace(/\s/g, '') === '';
};

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// export const formatPhone = num => {
//   if (!num) {
//     return '';
//   }
//   if (!num[0] && !num[1] && )
//   const number = num.match(/\d/g, '');
//   const joinedNumber = number.join('');
//   const regex = /^(\d{3})(\d{3})(\d{4})$/;
//   const final = joinedNumber.replace(regex, '($1) $2-$3');
//   return final;
// };

export const formatPhone = phoneNumberString => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    // var intlCode = match[1] ? '+1 ' : '';
    return ['(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
};

export const formatPhoneInput = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) {
      return currentValue;
    }
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    }
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};

export const getApiError = error => {
  if (!error.response) {
    return { message: 'Unknown Error', status: null };
  }
  if (error.response.status === 500) {
    return { message: 'Internal Server Error.', status: 500 };
  } else if (error.response.status === 503) {
    return { message: 'Service Unavailable.', status: 503 };
  } else if (error.response.status === 400) {
    return { message: error.response.data.message.error.reason, status: 400 };
  } else {
    if (!error.response.data) {
      return { message: 'Internal Server Error', status: null };
    } else {
      return {
        message: error.response.data.message || error.response.data.error[Object.keys(error.response.data.error)[0]][0],
        status: error.response.status,
      };
    }
  }
};
