//==============================================================================
// Error classes
//==============================================================================

function NodeGenerationError(url, message) {
    this.url = url;
    this.message = message;
}

// inherit from Error
NodeGenerationError.prototype = Object.create(Error.prototype);
NodeGenerationError.prototype.constructor = Error;
