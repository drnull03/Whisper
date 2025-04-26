import fs from 'fs';
import { createMimeMessage } from 'mimetext' // Import the MimeText package using ES Modules
import { simpleParser } from 'mailparser';
// Function to encode image to base64
function encodeImageToBase64(imagePath) {
  // Read the image file into a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Convert the buffer to a base64 encoded string
  return imageBuffer.toString('base64');
}



  const imagePath='./3d.jpg'
  // Encode the image to base64
  const base64Image = encodeImageToBase64(imagePath);

  const msg = createMimeMessage()

  msg.setSender('sender@mail.com')
  msg.setRecipients('recipient@mail.com')
  msg.setSubject('Testing MimeText 🐬 (Plain Text + HTML With Mixed Attachments)')
  
  msg.addMessage({
      contentType: 'text/plain',
      data: 'Hello there,This is a test email sent by MimeText test suite.'
  })

  // two more attachments but they aren't inlined, they are attached
  msg.addAttachment({
      filename: 'sample.jpg',
      contentType: 'image/jpg',
      data: base64Image
  })
 
  
  const raw = msg.asRaw()
  //console.log(raw)




 // Your raw MIME message

simpleParser(raw)
  .then(parsed => {
    //console.log(parsed.subject); // Extract subject
    //console.log(parsed.text); // Extract plain text body
    console.log(parsed.attachments[0].content); // Extract attachments

    const imageBuffer = parsed.attachments[0].content;

      // Save the image to a file (e.g., "reconstructed_image.jpg")
    fs.writeFileSync('reconstructed_image.jpg', imageBuffer);

    console.log('Image saved as "reconstructed_image.jpg"');
  })
  .catch(err => console.error('Error parsing:', err));
