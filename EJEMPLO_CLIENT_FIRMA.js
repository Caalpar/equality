/**
 * EJEMPLO: Cómo firmar y enviar transacciones de forma segura
 * El CLIENTE firma localmente - NUNCA envía su private key
 */

const Wallet = require('./src/wallet/Wallet');
const { v4: uuidv4 } = require('uuid');

// 1. CREAR WALLET LOCALMENTE (solo en cliente)
const myPrivateKey = 'tu-private-key-hex-aqui'; // En env, NUNCA en código
const myWallet = new Wallet(myPrivateKey);

console.log('📱 Tu Wallet:');
console.log('   Public Key:', myWallet.PublicKey);
console.log('   Private Key:', myWallet.PrivateKey); // Solo en local

// 2. CREAR TRANSACCIÓN
const recipientPublicKey = 'recipient-public-key-hex';
const amount = 100;
const fee = 0.5;

const transactionData = {
    input: myWallet.PublicKey,    // Tu clave pública (SEGURO enviar)
    outputs: [
        {
            address: recipientPublicKey,
            amount: amount,
            fee: fee
        }
    ]
};

console.log('\n📝 Datos a firmar:');
console.log(JSON.stringify(transactionData, null, 2));

// 3. FIRMAR LOCALMENTE
const signature = myWallet.sign(transactionData);
console.log('\n✍️ Firma generada:');
console.log(signature);

// 4. CREAR OBJECT PARA ENVIAR AL SERVIDOR
const signedTransaction = {
    id: uuidv4(),
    ...transactionData,
    signature: signature
};

console.log('\n📤 Payload a enviar al servidor:');
console.log(JSON.stringify(signedTransaction, null, 2));

// 5. ENVIAR AL SERVIDOR (SEGURO - no contiene private key)
console.log('\n🚀 Enviando a servidor...');

(async () => {
    try {
        const response = await fetch('http://localhost:3000/api/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signedTransaction)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('\n✅ Transacción aceptada!');
            console.log('   ID:', result.transaction.id);
            console.log('   Firma verificada en servidor');
        } else {
            console.log('\n❌ Transacción rechazada:');
            console.log('   Error:', result.error);
        }
    } catch (error) {
        console.error('Error enviando:', error.message);
    }
})();

/**
 * FLUJO DE SEGURIDAD:
 * 
 * CLIENTE (tu máquina):
 *   1. Generas Wallet con private key
 *   2. Creas objeto transacción
 *   3. FIRMAS localmente con tu private key
 *   4. Envías: { id, input, outputs, signature }
 *   ❌ NUNCA envías el private key
 * 
 * SERVIDOR:
 *   1. Recibe: { id, input, outputs, signature }
 *   2. Valida firma usando public key del cliente
 *   3. Si firma es válida → Acepta transacción
 *   4. Si firma es inválida → Rechaza con HTTP 401
 * 
 * ATACANTE intercepta la red:
 *   - Ve: { id, input, outputs, signature }
 *   - ❌ No puede cambiar datos (invalidaría firma)
 *   - ❌ No tiene private key (imposible re-firmar)
 *   - ❌ No puede crear nuevas transacciones válidas
 */
