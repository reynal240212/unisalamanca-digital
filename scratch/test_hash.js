import bcrypt from 'bcryptjs';

const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
const pass1 = 'password';
const pass2 = 'Unisalamanca2026*';

console.log('Testing "password":', bcrypt.compareSync(pass1, hash));
console.log('Testing "Unisalamanca2026*":', bcrypt.compareSync(pass2, hash));
