// ----------------------------------------------------------------------

const BRONZE_POINT = 5;
const SILVER_POINT = 20;
const GOLD_POINT = 40;

const TOTAL_RANGE = GOLD_POINT;

// ----------------------------------------------------------------------

const phoneRegExp = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

const censorEmail = (curr_email) => {
    if (curr_email && curr_email.length > 5) {
        const arr = curr_email.split("@");
        return `${censorWord(arr[0])}@${arr[1]}`;
    }
    return "No email was found";
};

const censorWord = (str) => {
    if (str.length < 2) return str;
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
};

const censorPhoneNumber = (phone) => {
    if (!phone || phone.length < 4) return '';
    return `****${phone.slice(-4)}`;
};

// ----------------------------------------------------------------------

const MAX_IMAGE_SIZE = 100 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

// ----------------------------------------------------------------------

export {
    BRONZE_POINT,
    SILVER_POINT,
    GOLD_POINT,
    TOTAL_RANGE,
    phoneRegExp,
    censorEmail,
    censorPhoneNumber,
    MAX_IMAGE_SIZE,
    ALLOWED_IMAGE_TYPES,
};