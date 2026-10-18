const utilities = {
    arrayValidation: (req, res, next) => {
        const array = req?.body?.array;

        if (!array) {
            res.status(400).json({ error: "Body is missing." })
        }

        if (!Array.isArray(array)) {
            res.status(400).json({ error: "Not an Array." })
        }

        const allNumeric = array?.every((element) => typeof element === "number")
        if (!allNumeric) {
            res.status(400).json({ error: "All indices must be numeric." })
        }

        next();
    }
}

module.exports = utilities
