test('sanity', () => {
  expect(true).toBe(true);
});

const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const sammy = { username: "sammy", password: "1234" };
const jimmy = { username: "jimmy", password: "5678" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
})

describe("server", () => {
  describe("[POST] /api/auth/register", () => {
    it("responds with 201 Created", async () => {
      const res = await request(server).post("/api/auth/register").send(sammy);
      expect(res.status).toBe(201);
    })
    it("responds with the newly created user", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send(sammy);
      expect(res.body.username).toBe("sammy");

      res = await request(server).post("/api/auth/register").send(jimmy);
      expect(res.body.username).toBe("jimmy");
    })
  });
  describe("[POST] /api/auth/login", () => {
    it("responds with 200 OK", async () => {
      await request(server).post("/api/auth/register").send(sammy);
      const res = await request(server).post("/api/auth/login").send(sammy);
      expect(res.status).toBe(200);
    });
    it("responds with the logged in user", async () => {
      let res;
      await request(server).post("/api/auth/register").send(sammy);
      await request(server).post("/api/auth/register").send(jimmy);
      res = await request(server).post("/api/auth/login").send(sammy);
      expect(res.body.message).toBe("Welcome, sammy");

      res = await request(server).post("/api/auth/login").send(jimmy);
      expect(res.body.message).toBe("Welcome, jimmy");
    });
  });
  describe("[GET] /api/jokes", () => {
    it("responds with 200 OK", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(200);
    });
  });
});
