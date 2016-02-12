export function expectAsync(callback, done) {
    return (...args) => {
        try {
            callback(...args);
        } catch(e) {
            done(e);
        }
    }
}

export function APIError(code, message, meta = {}) {
    return () => [code, {
        message, meta, error: true
    }]
}