import bcrypt from 'bcryptjs';

export async function hashPin(pin: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pin, salt);
}

export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
    // If PIN is "1234" and hashedPin is also "1234", it means it's not hashed yet
    // This allows transition from plain text to hash
    if (hashedPin === pin) {
        return true;
    }
    return bcrypt.compare(pin, hashedPin);
}
