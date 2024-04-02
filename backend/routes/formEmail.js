import express from "express";
import { formMessage } from "../utils.js";
import { mailgun } from "../utils.js";
const emailRouter = express();

emailRouter.post("/", (req, res) => {
  const { subject,email, message } = req.body;
  mailgun()
    .messages()
    .send(
      {subject:`${subject}`,
        from: `${email}`,
        to: "silohiandreea05@gmail.com",
        html: formMessage(message),
      },
      (error, body) => {
        if (error) {
          console.log(error);
          res.status(500).send({ message: "Error in sending email" });
        } else {
          console.log(body);
          res.send({ message: "Email sent successfully" });
        }
      }
    );
});
export default emailRouter;
