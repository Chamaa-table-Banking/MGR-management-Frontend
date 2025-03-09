const validate = (fullname: string, phone: string, password: string, confirmPassword: string) => {
    if (!fullname || !phone || !password || !confirmPassword) {
        return { message: "All fields are required" };
    }
    if (password !== confirmPassword) {
        return { message: "Password Mismatch" };
    }
    if (phone.length !== 10) {
        return { message: "Phone number must be 10 digits" };
    }
    if (password.length < 8) {
        return { message: "Password must be at least 8 characters long" };
    }
    // validate phone number format
    if (!/^\d{10}$/.test(phone)) {
        return { message: "Invalid phone number format" };
    }
    // validate password format
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        return { message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character" };
    }

    return true;
}


export default validate;