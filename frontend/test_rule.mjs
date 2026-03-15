import axios from 'axios';
import fs from 'fs';

async function testRule() {
    try {
        // 1. Login
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'admin@platform.com',
            password: 'Admin@1234'
        });
        const token = loginRes.data.token;
        console.log('Got token:', token ? 'YES' : 'NO');

        // 2. Create Rule
        const payload = {
            name: 'Test Dynamic Rule ' + Date.now(),
            description: 'Test description for NONE',
            ruleType: 'SOFT_PREFERENCE',
            ruleStatus: 'ACTIVE',
            targetScope: 'GLOBAL',
            targetCategoryName: null,
            combinationType: 'NONE',
            dynamicAttribute: 'budget',
            priority: 10,
            weight: 10,
            conditions: []
        };

        const res = await axios.post('http://localhost:8080/api/admin/rules', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Success:', res.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.status);
            fs.writeFileSync('error.json', JSON.stringify(error.response.data, null, 2));
            console.error('Error Data written to error.json');
        } else {
            console.error('Network Error:', error.message);
        }
    }
}

testRule();
