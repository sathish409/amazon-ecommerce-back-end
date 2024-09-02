import nodemailer from 'nodemailer'
//smtp configuration

//email body

//send email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port:  process.env.SMTP_PORT,
    auth: {
        user:  process.env.SMTP_USER,
        pass:  process.env.SMTP_PASS,
    }
});

const emailSender= async(obj)=>{
try {
    
    const info =   await transporter.sendMail(obj)
    console.log("Message sent: %s", info.messageId);
} catch (error) {
    console.log(error)
}
}

export const sendEmailVerificationLinkEmail=async({email, fname, url})=>{
    const body ={
        from: `"Sathish web 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Follow the instructions to verify your email account", // Subject line
        text: `Hello ${fname}, please follow the link to verify your account ${url} \n\n Regards Sathish Web`, // plain text body
        html: `<p>Hello ${fname}</p>
<br />
<br />
<p>Thank yo for creating the account with us, please click the link below to verify your account</p>
<p>
    <a href=${url}>
        <button style="backround: green; padding:2rem;color:white; font-weight:bolder">Verify</button>
    </a>
</p>
<br />
<br />
<br />
<p>
    Regards,
    <br />
    <br />
    <p>Sathish Web</p>
</p>`, // html body
      };
      emailSender(body)
}

export const sendEmailVerifiedNotificationEmail=async({email, fname, url})=>{
    const body ={
        from: `"Sathish web 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your email has been verified", // Subject line
        text: `Hello ${fname}, you may login now \n\n Regards Sathish Web`, // plain text body
        html: `<p>Hello ${fname}</p>
<br />
<br />
<p>Your email has been verified, you may login now</p>

<br />
<br />
<br />
<p>
    Regards,
    <br />
    <br />
    <p>Sathish Web</p>
</p>`, // html body
      };
      emailSender(body)
}

export const sendOtpEmail=async({email, fname, otp})=>{
    const body ={
        from: `"Sathish web 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your email has been verified", // Subject line
        text: `Hello ${fname}, please enter otp to reset your password
         \n\n Regards Sathish Web`, // plain text body
        html: `<p>Hello ${fname}</p>
<br />
<br />
<p>Your email has been verified, please enter otp to reset your password</p>
<p style="font-size:3rem"; color:red;>${otp}<p/>
<br />
<br />
<br />
<p>
    Regards,
    <br />
    <br />
    <p>Sathish Web</p>
</p>`, // html body
      };
      emailSender(body)
}


export const sendPasswordChangeEmail=async({email, fname})=>{
    const body ={
        from: `"Sathish web 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Your email has been verified", // Subject line
        text: `Hello ${fname}, Your password has been changed
         \n\n Regards Sathish Web`, // plain text body
        html: `<p>Hello ${fname}</p>
<br />
<br />
<p>Your email has been verified, Your password has been changed</p>
<br />
<br />
<br />
<p>
    Regards,
    <br />
    <br />
    <p>Sathish Web</p>
</p>`, // html body
      };
      emailSender(body)
}

