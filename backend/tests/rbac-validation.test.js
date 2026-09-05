const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const User = require("../models/User");
const { connectTestDB, clearTestDB, closeTestDB } = require("./setup");

beforeAll(async () => connectTestDB(), 60000);
afterEach(async () => clearTestDB());
afterAll(async () => closeTestDB());

const tokenFor = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const createUser = async (role) => {
  const user = await User.create({
    name: role === "admin" ? "Admin User" : "Regular User",
    email: `${role}@example.com`,
    password: "secret123",
    role,
  });
  return { user, token: tokenFor(user) };
};

const validDonationPayload = {
  donorName: "Green Grocers",
  donorEmail: "grocer@example.com",
  foodType: "Vegetables",
  quantity: 5,
  unit: "kg",
};

describe("RBAC on admin-only routes", () => {
  it("rejects a non-admin user with 403", async () => {
    const { token } = await createUser("user");
    const res = await request(app)
      .post("/api/food-donations")
      .set("Authorization", `Bearer ${token}`)
      .send(validDonationPayload);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("allows an admin user with a valid payload", async () => {
    const { token } = await createUser("admin");
    const res = await request(app)
      .post("/api/food-donations")
      .set("Authorization", `Bearer ${token}`)
      .send(validDonationPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.foodType).toBe("Vegetables");
  });
});

describe("Input validation on POST /api/food-donations", () => {
  it("rejects an invalid foodType enum with 400", async () => {
    const { token } = await createUser("admin");
    const res = await request(app)
      .post("/api/food-donations")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validDonationPayload, foodType: "NotARealType" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects a missing quantity with 400", async () => {
    const { token } = await createUser("admin");
    const { quantity, ...payloadWithoutQuantity } = validDonationPayload;
    const res = await request(app)
      .post("/api/food-donations")
      .set("Authorization", `Bearer ${token}`)
      .send(payloadWithoutQuantity);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
