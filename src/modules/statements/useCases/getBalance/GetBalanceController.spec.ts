import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Get Balance Controller", () => {
  let database: Connection
  let token: string
  let user = {
    name: "Name Lastname",
    email: "name.lastname@gmail.com",
    password: "password123"
  }

  beforeAll(async () => {
    database = await createConnection()
    await database.runMigrations()

    await request(app).post("/api/v1/users").send(user)

    const authenticate = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })
    token = authenticate.body.token

    expect(token).toBeDefined()
  })

  afterAll(async () => {
    await database.dropDatabase()
    await database.close()
  })

  it("Should return a user balance", async () => {
    const response = await request(app).get("/api/v1/statements/balance").set({
      Authorization: `Bearer ${token}`
    })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("statement")
    expect(response.body).toHaveProperty("balance")
  })
})