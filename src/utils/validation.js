const validatePublicKey = (publicKey) => {
    if (!publicKey || typeof publicKey !== 'string') {
        return { valid: false, error: 'Public key debe ser un string no vacío' }
    }
    if (publicKey.length < 50) {  // Clave pública mínima
        return { valid: false, error: 'Public key inválida' }
    }
    return { valid: true }
}

const validateTransaction = (transaction) => {
    const { id, input, outputs, signature } = transaction

    if (!id || typeof id !== 'string') {
        return { valid: false, error: 'id requerido' }
    }
    if (!input || typeof input !== 'string') {
        return { valid: false, error: 'input (publicKey) requerido' }
    }
    if (!Array.isArray(outputs) || outputs.length === 0) {
        return { valid: false, error: 'outputs debe ser array no vacío' }
    }
    if (!signature || typeof signature !== 'string') {
        return { valid: false, error: 'signature requerido' }
    }

    for (const out of outputs) {
        if (typeof out.amount !== 'number' || out.amount <= 0) {
            return { valid: false, error: 'amounts deben ser números positivos' }
        }
        if (!out.address || typeof out.address !== 'string') {
            return { valid: false, error: 'address requerido en outputs' }
        }
    }

    return { valid: true }
}

module.exports = {
    validatePublicKey,
    validateTransaction
}
