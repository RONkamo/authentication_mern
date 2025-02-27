import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { client, sender } from "./mailtrap.config.js"

export const sendverificationEmail= async (email,verficationToken) => {
    const recipient = [{email}];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify your email!",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verficationToken),
            category: "Email Verification"
        })

    console.log("Email sent successfully",response)
    } catch (error) {
        console.log(`Error sending verification email`,error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}];

    try {
      const response =  await client.send({
            from: sender,
            to: recipient,
            template_uuid:"df0b95a9-c709-4521-a10c-6b21be0b392b",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name,
            },
        });

        console.log("Welcom email sent Successfully",response);
    } catch (error) {
        console.log(`Error sending Welcome email`,error);
        throw new Error(`Error sending Welcome email: ${error}`);
        
    }


};

export const sendPasswordResetEmail = async (email,resetURL) => {
    const recipient = [{email}];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(`{resetURL}`,resetURL),
            category:"Password Reset"
        });

    } catch (error) {
        console.log(`Error sending Password Reset email`,error);
        throw new Error(`Error sending Password Reset email: ${error}`);
        
    }

};

export const sendResetSuccessEmail = async(email)=>{
    const recipient = [{email}];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset"
        });

        console.log(`Password Reset email sent successfully`,response);

    } catch (error) {
        console.log(`Error sending Password Reset succcess email`,error);
        throw new Error(`Error sending Password Reset success email: ${error}`);
        
    }

}

