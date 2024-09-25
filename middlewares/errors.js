function errorHandler( req, res, next) {
    const statusCode = res.statusCode == 200 ? 500: res.statusCode;
    res.status(statusCode);
    response.json({
        message : err?.message,
        stack : err?.stack,
    });
    };
    const notFound = ( req, res, next) => {
    const error = new Error(`not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
    
    };
    module.exports = {
        errorHandler,
        notFound
    
    }