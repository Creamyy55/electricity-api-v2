const request = require('supertest');
const app = require('../index');

describe('Electricity API Comprehensive Test Suite', () => {

    // API 1: Total electricity usages for each year
    it('should return total electricity usage grouped by year', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
        // ตรวจสอบว่าค่าที่ได้ในแต่ละปีต้องเป็นตัวเลข
        const years = Object.keys(res.body);
        if (years.length > 0) {
            expect(typeof res.body[years[0]]).toBe('number');
        }
    });

    // API 2: Total electricity users for each year
    it('should return total electricity users grouped by year', async () => {
        const res = await request(app).get('/api/users/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    // API 3: Usage of specific province by specific year
    it('should return usage for a specific province and year', async () => {
        // เปลี่ยน 'Bangkok' และ '2023' เป็นข้อมูลที่มีจริงในไฟล์ของคุณ
        const res = await request(app).get('/api/usage/Bangkok/2566');
        if (res.status === 200) {
            expect(res.body).toHaveProperty('province_name', 'Bangkok');
            expect(res.body).toHaveProperty('year', 2566);
        } else {
            expect(res.status).toBe(404);
        }
    });

    // API 4: Users of specific province by specific year
    it('should return users count for a specific province and year', async () => {
        const res = await request(app).get('/api/users/Bangkok/2023');
        if (res.status === 200) {
            expect(typeof res.body).toBe('object');
        } else {
            expect(res.status).toBe(404);
        }
    });

    // API 5: Usage history by specific province
app.get('/api/usage/history/:province', (req, res) => {
    const data = loadData('electricity_usages_en.json'); // เช็คชื่อไฟล์ให้ตรงนะ
    const province = req.params.province;
    
    // กรองเอาทุกปีที่มีชื่อจังหวัดตรงกัน
    const history = data.filter(item => 
        item.province_name.toLowerCase() === province.toLowerCase()
    );

    if (history.length > 0) {
        res.json(history);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

    // API 6: User history by specific province
app.get('/api/users/history/:province', (req, res) => {
    // โหลดข้อมูลจากไฟล์ users (เช็คชื่อไฟล์ให้ตรงกับที่คุณมีนะครับ)
    const data = loadData('electricity_users_en.json'); 
    const province = req.params.province;
    
    // กรองเอาข้อมูลจังหวัดที่ต้องการ (แบบไม่สนตัวพิมพ์ใหญ่-เล็ก)
    const history = data.filter(item => 
        item.province_name.toLowerCase() === province.toLowerCase()
    );

    if (history.length > 0) {
        res.json(history);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

    // Error Handling Test
    it('should return 404 for non-existent province or data', async () => {
        const res = await request(app).get('/api/usage/NonExistentProvince/9999');
        expect(res.status).toBe(404);
        // ตรวจสอบโครงสร้าง Error Message
        expect(res.body).toHaveProperty('message');
    });

    it('should handle invalid routes', async () => {
        const res = await request(app).get('/api/invalid/route');
        expect(res.status).toBe(404);
    });
});