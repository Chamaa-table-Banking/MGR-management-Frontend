const validate = (fullname: string, phone: string, password: string, confirmPassword: string) => {
    const errors: string[] = [];

    if (!fullname || !phone || !password || !confirmPassword) {
        errors.push("All fields are required.");
    }
    if (password !== confirmPassword) {
        errors.push("Password mismatch.");
    }
    if (!/^\d{10}$/.test(phone)) {
        errors.push("Phone number must be exactly 10 digits.");
    }
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        errors.push("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
    }

    return errors.length > 0 ? { message: errors.join(" ") } : true;
};

export default validate;
