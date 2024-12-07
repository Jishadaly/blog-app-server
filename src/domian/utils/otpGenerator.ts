// const otpGenerator = require('otp-generator');

export const otpGeneratorFun = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export const  AddMinutesToDate =(date :Date, minutes:number)=> {
  return new Date(date.getTime() + minutes*60000);
}

