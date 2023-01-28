import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Authenticate User Controller", () => {
  let database: Connection

  beforeAll(async () => {
    database = await createConnection()
    await database.runMigrations()
  })

  afterAll(async () => {
    await database.dropDatabase()
    await database.close()
  })

  it("Should authenticate a existent user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Name Lastname",
      email: "name.lastname@gmail.com",
      password: "password123"
    })

    const authenticate = await request(app).post("/api/v1/sessions").send({
      email: "name.lastname@gmail.com",
      password: "password123"
    })

    expect(authenticate.status).toBe(200)
    expect(authenticate.body).toHaveProperty("user")
    expect(authenticate.body).toHaveProperty("token")
  })

  it(
    "Should return a Unauthorized Exception when trying to authenticate with a invalid email or password",
    async () => {
      const response = await request(app).post("/api/v1/sessions").send({
        email: "nonexistent@email.com",
        password: "password"
      })

      expect(response.status).toBe(401)
    })
})