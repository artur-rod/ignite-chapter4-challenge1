import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Show User Profile Controller", () => {
  let database: Connection
  let token: string

  beforeAll(async () => {
    database = await createConnection()
    await database.runMigrations()

    await request(app).post("/api/v1/users").send({
      name: "Name Lastname",
      email: "name.lastname@gmail.com",
      password: "password123"
    })

    const authenticate = await request(app).post("/api/v1/sessions").send({
      email: "name.lastname@gmail.com",
      password: "password123"
    })
    token = authenticate.body.token

    expect(token).toBeDefined()
  })

  afterAll(async () => {
    await database.dropDatabase()
    await database.close()
  })

  it("Should return a user profile", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.email).toBe("name.lastname@gmail.com")
  })
})