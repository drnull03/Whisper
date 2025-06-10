import { simpleParser } from 'mailparser';


function isValidEmail(email) {
  const suffix = '@whisper.eth';
  const whisperEmailRegex = /^[a-zA-Z0-9._%+-]+@whisper\.eth$/;

  if (!whisperEmailRegex.test(email)) return false;

  const localPart = email.slice(0, -suffix.length);
  return localPart.length > 0 && localPart.length <= 10;
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