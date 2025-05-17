import { simpleParser } from 'mailparser';


function isValidEmail(email) {
    const whisperEmailRegex = /^[a-zA-Z0-9._%+-]+@whisper\.eth$/;
    return whisperEmailRegex.test(email);
}

function toString(msg) {
    return msg.asRaw();
}



async function parse(msg) {
    if (typeof (msg) == 'object') {
        msg = toString(msg);
    }
    const parsed = await simpleParser(msg);

    return parsed;
}



export {
    isValidEmail,
    parse
};