import fs from 'fs';
import { createMimeMessage } from 'mimetext' // Import the MimeText package using ES Modules
import { simpleParser } from 'mailparser';
import fs from 'fs';



function encodeFileToBase64(imagePath) {
  // Read the image file into a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Convert the buffer to a base64 encoded string
  return imageBuffer.toString('base64');
}




function createEmail(sender, recipient, subject, text) {
  const msg = createMimeMessage()
  msg.setSender(sender)
  msg.setRecipients(recipient)
  msg.setSubject(subject)

  msg.addMessage({
    contentType: 'text/plain',
    data: text
  })
  return msg;
}


function addCC(msg, _cc) {
  msg.setRecipient(_cc, { type: 'Cc' })

}

function addBCC(msg, _bcc) {
  msg.setRecipient(_bcc, { type: 'Bcc' })
}


function addImage(msg, base64Image, filename) {
  msg.addAttachment({
    filename: filename,
    contentType: 'image/jpg',
    data: base64Image
  })

}

function addText(msg, base64Text, filename) {
  msg.addAttachment({
    filename: filename,
    contentType: 'text/plain',
    data: base64Text
  })
}



function addFile(msg, base64Data, filename, contentType = 'application/octet-stream') {
  msg.addAttachment({
    filename,
    contentType,
    data: base64Data,
  });
}










/*
console.log(raw)



simpleParser(raw)
.then(parsed => {
  //console.log(parsed.subject); // Extract subject
  //console.log(parsed.text); // Extract plain text body
  console.log(parsed)// Extract attachments

  
})
.catch(err => console.error('Error parsing:', err));

*/



/*
async function main(){











}




main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});*/