const request = require("supertest");
const app = require("../app");
const { connectTestDB, clearTestDB, closeTestDB } = require("./setup");

beforeAll(async () => connectTestDB(), 60000);
afterEach(async () => clearTestDB());
afterAll(async () => closeTestDB());

const validUser = {
  name: "Jane Donor",
  email: "jane@example.com",
  password: "secret123",
};

describe("POST /api/auth/signup", () => {
  it("creates a user and returns token + refreshToken", async () => {
    const res = await request(app).post("/api/auth/signup").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
  });

  it("rejects an invalid email with a top-level message", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...validUser, email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(typeof res.body.message).toBe("string");
  });

  it("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/signup").send(validUser);
    const res = await request(app).post("/api/auth/signup").send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/signup").send(validUser);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
  });

  it("rejects a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the user with a valid token", async () => {
    const signup = await request(app).post("/api/auth/signup").send(validUser);
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${signup.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(validUser.email);
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/refresh and /api/auth/logout", () => {
  it("rotates the refresh token and invalidates the old one", async () => {
    const signup = await request(app).post("/api/auth/signup").send(validUser);
    const firstRefreshToken = signup.body.refreshToken;

    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: firstRefreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.token).toBeDefined();
    expect(refreshRes.body.refreshToken).toBeDefined();
    expect(refreshRes.body.refreshToken).not.toBe(firstRefreshToken);

    // Reusing the rotated-out token must now fail
    const reuseRes = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: firstRefreshToken });
    expect(reuseRes.status).toBe(401);
  });

  it("logout revokes the refresh token", async () => {
    const signup = await request(app).post("/api/auth/signup").send(validUser);
    const { refreshToken } = signup.body;

    const logoutRes = await request(app).post("/api/auth/logout").send({ refreshToken });
    expect(logoutRes.status).toBe(200);

    const refreshRes = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(refreshRes.status).toBe(401);
  });
});
