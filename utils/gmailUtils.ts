const Imap = require("imap-simple");
const { simpleParser } = require("mailparser");
const fs = require("fs");
const path = require("path");

export async function fetchEmails(username:string, password:string, emailFolder:string, subject:string) {
  const config = {
    imap: {
      user: username,
      password: password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      authTimeout: 15000,
      tlsOptions: { rejectUnauthorized: false }
    },
  };

  try {
    const connection = await Imap.connect(config);
    await connection.openBox(emailFolder);

    const searchCriteria = [["HEADER", "SUBJECT", subject]];
    const fetchOptions = { bodies: [""], markSeen: false };

    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log("Total Messages:", messages.length);

    const lastMessages = messages.slice(-10).reverse(); 

    for (const message of lastMessages) {
      const all = message.parts.find((p) => p.which === "");
      if (!all?.body) continue;

      const parsed = await simpleParser(all.body);

      if (parsed.subject && parsed.subject.includes(subject)) {
        console.log("***************************************************");
        console.log("Subject:", parsed.subject);
        console.log("From:", parsed.from?.text);
        console.log("To:", parsed.to?.text);
        console.log("Date:", parsed.date);
        console.log("Body:", parsed.text || parsed.html);

        // attachments (optional)
        if (parsed.attachments?.length > 0) {
          for (const att of parsed.attachments) {
            const destFilePath = path.join(process.cwd(), "Resources", att.filename);
            fs.writeFileSync(destFilePath, att.content);
            console.log("Saved attachment:", destFilePath);
            fs.unlinkSync(destFilePath); // delete after reading
          }
        }

        await connection.end();
        return parsed.text || parsed.html || null; // ✅ return here
      }
    }

    await connection.end();
    return null;

  } catch (error) {
    console.error("Error while fetching emails:", error);
    return null;
  }
}

export async function getEmailBody(username:string, password:string, emailFolder:string, subject:string) {
  const config = {
    imap: {
      user: username,
      password: password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      authTimeout: 15000,
      tlsOptions: { rejectUnauthorized: false }
    },
  };

  const connection = await Imap.connect(config);
  await connection.openBox(emailFolder);

  const searchCriteria = ["ALL"];
  const fetchOptions = { bodies: [""], markSeen: false };
  const messages = await connection.search(searchCriteria, fetchOptions);

  const lastMessages = messages.slice(-10);
  for (const message of lastMessages) {
    const all = message.parts.find((p) => p.which === "");
    if (!all || !all.body) continue;

    const parsed = await simpleParser(all.body);
    if (parsed.subject && parsed.subject.includes(subject)) {
      await connection.end();
      return parsed.text || parsed.html || null;
    }
  }
  await connection.end();
  return null;
}

