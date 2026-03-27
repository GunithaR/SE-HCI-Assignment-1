import axios from 'axios';

// Using the same credentials from test_auth.js
const API_URL = 'http://localhost:8080/api';
const ADMIN_EMAIL = 'admin@platform.com'; // as defined in application.yml
const ADMIN_PASSWORD = 'Admin@1234';

async function generateBasicRules() {
    try {
        console.log('1. Authenticating as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        
        const token = loginRes.data.token;
        if (!token) throw new Error('No token received');
        
        console.log('Got token: YES');

        // Fetch existing rules
        console.log('2. Fetching existing rules...');
        const rulesRes = await axios.get(`${API_URL}/admin/rules`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const existingRules = rulesRes.data;
        console.log(`Found ${existingRules.length} existing rules.`);

        // Delete rules we are about to create to avoid Name DataIntegrityViolation
        const dynamicRuleNames = [
            'Climate Preference Dynamic Match',
            'Budget Preference Dynamic Match',
            'Style Preference Dynamic Match',
            'Durability Preference Dynamic Match',
            'Maintainability Preference Dynamic Match'
        ];

        for (const rule of existingRules) {
            if (dynamicRuleNames.includes(rule.name)) {
                console.log(`Deleting old rule: ${rule.name} (ID: ${rule.id})`);
                await axios.delete(`${API_URL}/admin/rules/${rule.id}`, { // Requires a delete endpoint, fallback to toggle if not available
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(async () => {
                   // If delete isn't implemented, just skip the creation process if it already exists to prevent 500
                   console.log(`(Delete endpoint maybe missing, will rename old rules to bypass unique constraint)`);
                   rule.name = rule.name + ' (Old ' + Date.now() + ')';
                   await axios.put(`${API_URL}/admin/rules/${rule.id}`, rule, {
                       headers: { Authorization: `Bearer ${token}` }
                   });
                });
            }
        }

        const rulesToCreate = [
            {
                name: 'Climate Preference Dynamic Match',
                description: 'Matches product climate suitability with user climate preference natively.',
                ruleType: 'SOFT_PREFERENCE',
                ruleStatus: 'ACTIVE',
                targetScope: 'GLOBAL',
                targetCategoryName: null,
                combinationType: 'NONE',
                dynamicAttribute: 'climate',
                priority: 20,
                weight: 15,
                conditions: []
            },
            {
                name: 'Budget Preference Dynamic Match',
                description: 'Matches product budget level with user budget preference.',
                ruleType: 'SOFT_PREFERENCE',
                ruleStatus: 'ACTIVE',
                targetScope: 'GLOBAL',
                targetCategoryName: null,
                combinationType: 'NONE',
                dynamicAttribute: 'budget',
                priority: 25,
                weight: 20,
                conditions: []
            },
            {
                name: 'Style Preference Dynamic Match',
                description: 'Matches product style natively.',
                ruleType: 'SOFT_PREFERENCE',
                ruleStatus: 'ACTIVE',
                targetScope: 'GLOBAL',
                targetCategoryName: null,
                combinationType: 'NONE',
                dynamicAttribute: 'style',
                priority: 15,
                weight: 10,
                conditions: []
            },
            {
                name: 'Durability Preference Dynamic Match',
                description: 'Matches product durability rating.',
                ruleType: 'SOFT_PREFERENCE',
                ruleStatus: 'ACTIVE',
                targetScope: 'GLOBAL',
                targetCategoryName: null,
                combinationType: 'NONE',
                dynamicAttribute: 'durabilityPreference',
                priority: 10,
                weight: 10,
                conditions: []
            },
            {
                name: 'Maintainability Preference Dynamic Match',
                description: 'Matches product maintenance level natively.',
                ruleType: 'SOFT_PREFERENCE',
                ruleStatus: 'ACTIVE',
                targetScope: 'GLOBAL',
                targetCategoryName: null,
                combinationType: 'NONE',
                dynamicAttribute: 'maintenancePreference',
                priority: 10,
                weight: 10,
                conditions: []
            }
        ];

        console.log('2. Creating basic dynamic rules...');
        
        for (const rule of rulesToCreate) {
             const res = await axios.post(`${API_URL}/admin/rules`, rule, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             console.log(`Created: ${res.data.name} (ID: ${res.data.id})`);
        }
        
        console.log('Successfully generated the 5 basic dynamic rules.');

    } catch (err) {
        console.error('Error:', err.response ? err.response.data : err.message);
    }
}

generateBasicRules();
