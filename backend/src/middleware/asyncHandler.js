// Error-handling middleware
// Our services can throw errors. We need to handle those errors centrally instead of writing repetitive try/catch blocks in every controller.

// Create:

// src/middleware/asyncHandler.js
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };
};