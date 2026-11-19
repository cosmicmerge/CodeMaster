import validator from "validator"

const validate=(data)=>{
    const {username,emailId,password}=data;

    const mandatoryFields=["username", "emailId", "password"];
    const isAllowed=mandatoryFields.every((d)=>Object.keys(data).includes(d));

    if(!isAllowed){
         throw new Error("Some mandatory fields are missing");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("Email is in the wrong format");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Password is not strong enough");
    }

    if(data.username.length<3 || data.username.length>40){
        throw new Error("username should be a string between 3 and 40 characters");
    }
}


export default validate;