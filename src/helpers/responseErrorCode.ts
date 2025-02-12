const ErrorInfo = {
    "4001" : "User mobile no is not exist",
    "4002" : "User device id doesn't match",
    "4003" : "User login from one device and then try to refresh from another device",
    "4004" : "Voucher reedem is not success",
    "4005" : "Voucher use is not success",
    "4006" : "Voucher share is not success",
    "4007" : "Point share is not success",
}

export const getErrorOBJ = (error_code) => {

    return {
        errorCode : `${error_code}`,
        errorMessage : ErrorInfo[error_code] || "No message found"
    }
}