module.exports.registerValidation = (username, password) => {
    const errors = [];
    if (username === "") {
        errors.push({ message: "please fill the username area" })
    }
    if (password === "") {
        errors.push({ message: "please fill the password area" })
    }
    if (password.length < 6) {
        errors.push({ message: "password minum lenght must be 6" })
    }
    return errors;
};