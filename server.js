// server.js - Backend للتحقق من معاملات Pi Network
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// إعدادات Pi Network
const PI_API_KEY = 'hrsvsmn2ozp0ahcr4v56hivkupdlpovnbavbo7ytb7wsnbyo50dpi77ekh68jggg';
const PI_API_URL = 'https://api.minepi.com';

// Pi Network Validation Key - الكامل
const VALIDATION_KEY = '6de679e360ee0316d9bda8f37a92404118dfffcbd88bc6dad11a5099cd631d10fa6f4e0f4093fa243f141276295f7a21cdcab2944d6ee94e3389ab75c2cfa17d';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chatoo-pi-app.html');
});

// مسار التحقق من Domain لـ Pi Network - مهم جداً!
app.get('/validation-key.txt', (req, res) => {
    res.type('text/plain');
    res.send(VALIDATION_KEY);
});

// مسار بديل للتحقق
app.get('/.well-known/pi-network/validation-key.txt', (req, res) => {
    res.type('text/plain');
    res.send(VALIDATION_KEY);
});

// الموافقة على الدفع (Server Approval)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    
    try {
        console.log('الموافقة على الدفع:', paymentId);
        
        const response = await axios.post(
            `${PI_API_URL}/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('تمت الموافقة بنجاح:', response.data);
        res.json({ success: true, data: response.data });
        
    } catch (error) {
        console.error('خطأ في الموافقة:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data || error.message 
        });
    }
});

// إكمال الدفع (Server Completion)
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    
    try {
        console.log('إكمال الدفع:', paymentId, txid);
        
        const response = await axios.post(
            `${PI_API_URL}/v2/payments/${paymentId}/complete`,
            { txid },
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('تم الإكمال بنجاح:', response.data);
        res.json({ success: true, data: response.data });
        
    } catch (error) {
        console.error('خطأ في الإكمال:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data || error.message 
        });
    }
});

// إلغاء الدفع
app.post('/api/cancel', async (req, res) => {
    const { paymentId } = req.body;
    
    try {
        console.log('إلغاء الدفع:', paymentId);
        
        const response = await axios.post(
            `${PI_API_URL}/v2/payments/${paymentId}/cancel`,
            {},
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('تم الإلغاء بنجاح:', response.data);
        res.json({ success: true, data: response.data });
        
    } catch (error) {
        console.error('خطأ في الإلغاء:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data || error.message 
        });
    }
});

// التحقق من حالة الدفع
app.get('/api/payment/:paymentId', async (req, res) => {
    const { paymentId } = req.params;
    
    try {
        console.log('التحقق من الدفع:', paymentId);
        
        const response = await axios.get(
            `${PI_API_URL}/v2/payments/${paymentId}`,
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`
                }
            }
        );
        
        console.log('حالة الدفع:', response.data);
        res.json({ success: true, data: response.data });
        
    } catch (error) {
        console.error('خطأ في التحقق:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data || error.message 
        });
    }
});

// صفحة اختبار
app.get('/test', (req, res) => {
    res.json({
        status: 'Server is running',
        app: 'Chatoo Pi Network Integration',
        timestamp: new Date().toISOString(),
        validationKey: VALIDATION_KEY
    });
});

app.listen(PORT, () => {
    console.log(`✅ خادم Chatoo يعمل على المنفذ ${PORT}`);
    console.log(`🌐 الوصول: http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${PI_API_KEY.substring(0, 10)}...`);
    console.log(`✅ Validation Key: ${VALIDATION_KEY.substring(0, 20)}...`);
    console.log(`📝 Validation URL: http://localhost:${PORT}/validation-key.txt`);
});

module.exports = app;
