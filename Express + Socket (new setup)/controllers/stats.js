// imports
const utilitiesFunction = require("../middlewares/utilities")

const findStats = {
    findMean: async (req, res, next) => {
        utilitiesFunction?.arrayValidation(req, res, next);

        const arr = req?.body?.array;
        const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

        res.status(200).json(sum / arr?.length);
    },

    findMedian: async (req, res, next) => {
        utilitiesFunction?.arrayValidation(req, res, next);

        const arr = req?.body?.array?.sort();
        const isEvenLength = arr.length % 2;
        if (!isEvenLength) {
            const mid1 = arr[arr.length / 2 - 1]
            const mid2 = arr[arr.length / 2]
            res.json((mid1 + mid2) / 2);
        } else {
            res.json(arr[Math.floor(arr.length / 2)]);
        }
    },

    findMode: async (req, res, next) => {
        utilitiesFunction.arrayValidation(req, res, next);

        const arr = req?.body?.array;
        const frequency = {};
        let maxCount = { element: 0, count: 0 };

        // Count frequency of numbers
        for (const num of arr) {
            frequency[num] = (frequency[num] || 0) + 1;

            if (frequency[num] > maxCount.count) {
                maxCount = { element: arr[num], count: frequency[num] };
            }
        }
        // console.log(frequency)
        res.json(maxCount.element)
    },

    findStandardDeviation: async (req, res, next) => {
        utilitiesFunction.arrayValidation(req, res, next);

        const arr = req?.body?.array;
        const mean = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / arr.length;
        const variance = arr.reduce((acc, curr) => Math.pow(mean - curr, 2)) / arr.length;
        const sd = Math.sqrt(variance);
        res.json(sd)
    },

    findMin: async (req, res, next) => {
        utilitiesFunction.arrayValidation(req, res, next)

        const arr = req.body.array;
        let min = Infinity;
        arr.forEach(element => {
            if (element < min)
                min = element;
        });
        res.json(min);
    },

    findMax: async (req, res, next) => {
        utilitiesFunction.arrayValidation(req, res, next);

        let max = -Infinity;
        const arr = req.body.array;
        arr.forEach(element => {
            if (element > max) {
                max = element;
            }
        });
        res.json(max);
    }
}

module.exports = findStats