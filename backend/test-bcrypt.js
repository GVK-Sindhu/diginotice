const bcrypt = require('bcrypt');

async function test() {
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Password:', password);
    console.log('Hash:', hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log('Is Match (same script):', isMatch);

    // Test with a hardcoded hash if possible, but salt makes it hard.
    // Let's test if we can compare with a fresh hash.
    const isMatch2 = await bcrypt.compare('password123', hash);
    console.log('Is Match (redundant check):', isMatch2);
}

test();
