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
  describe("[POST] /api/register", () => {
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
  describe("[GET] /api/jokes", () => {
    it("responds with 200 OK", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(200);
    });
  });
});
