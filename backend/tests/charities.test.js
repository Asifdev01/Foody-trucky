const request = require("supertest");
const app = require("../app");
const Charity = require("../models/Charity");
const { connectTestDB, clearTestDB, closeTestDB } = require("./setup");

beforeAll(async () => connectTestDB(), 60000);
afterEach(async () => clearTestDB());
afterAll(async () => closeTestDB());

const baseCharity = {
  category: "Food",
  description: "A test charity.",
  mission: "Feed people.",
  email: "contact@example.org",
  phone: "555-0100",
  address: "1 Main St",
  city: "Testville",
  zipCode: "00000",
  yearEstablished: 2010,
  status: "Active",
};

const seedCharities = async () => {
  const ratings = [3.5, 4.9, 4.1, 4.6, 4.0];
  return Promise.all(
    ratings.map((rating, i) =>
      Charity.create({ ...baseCharity, name: `Charity ${i}`, rating })
    )
  );
};

describe("GET /api/charities pagination", () => {
  it("paginates results and reports correct totals", async () => {
    await seedCharities();

    const page1 = await request(app).get("/api/charities?page=1&limit=2");
    expect(page1.status).toBe(200);
    expect(page1.body.data).toHaveLength(2);
    expect(page1.body.pagination).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });

    const page3 = await request(app).get("/api/charities?page=3&limit=2");
    expect(page3.body.data).toHaveLength(1);
  });

  it("sorts by rating using a real Mongo sort across the full set, not just the current page", async () => {
    await seedCharities();

    const res = await request(app).get("/api/charities?sortBy=rating&page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data[0].rating).toBe(4.9);
    expect(res.body.data[1].rating).toBe(4.6);
  });
});
