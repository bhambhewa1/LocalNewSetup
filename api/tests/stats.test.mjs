import { describe, it, expect } from 'vitest';
import request from 'supertest';
const statsTest = require("../controllers/stats")
const app = require("../app")


describe('POST /api/mean', () => {
    it("should return error when body is missing", async () => {
        const response = await request(app).post("/api/mean").send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Body is missing.");
    });

    it("should return error when array is not array", async () => {
        const response = await request(app).post("/api/mean").send({ array: "hello" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Not an Array.");
    });

    it("should return error when array contains non-numeric value", async () => {
        const response = await request(app).post("/api/mean").send({ array: [1, 2, "3"] });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("All indices must be numeric.");
    });

    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/mean').send({ array: [1, 2, 3, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(2.5);
    });
});

describe('POST /api/median', () => {
    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/median').send({ array: [1, 2, 3, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(2.5);
    });
});

describe('POST /api/mode', () => {
    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/mode').send({ array: [1, 2, 2, 3, 3, 2, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(2);
    });
});

describe('POST /api/findStandardDeviation', () => {
    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/sd').send({ array: [1, 2, 3, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(0.75);
    });
});

describe('POST /api/min', () => {
    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/min').send({ array: [1, -2, 3, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(-2);
    });
});

describe('POST /api/max', () => {
    it('should return 200 and a JSON body', async () => {
        const response = (await request(app).post('/api/max').send({ array: [1, -2, 3, 4] }));

        expect(response.status).toBe(200);
        expect(response.body).toEqual(4);
    });
});