module.exports = {
  validateFile: (filename, mimetype) => {
    const allowedTypes = ["audio/webm", "audio/mpeg"];
    if (!allowedTypes.includes(mimetype)) {
      return { isValid: false, message: "Invalid file type" };
    }

    if (filename.length > 100) {
      return { isValid: false, message: "Filename is too long" };
    }

    return { isValid: true, message: "Valid" };
  },
};
