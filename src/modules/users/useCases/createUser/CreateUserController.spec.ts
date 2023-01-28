import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Create User Controller", () => {
  let database: Connection

  beforeAll(async () => {
    database = await createConnection()
    await database.runMigrations()
  })

  afterAll(async () => {
    await database.dropDatabase()
    await database.close()
  })

  it("Should create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Name Lastname",
      email: "name.lastname@gmail.com",
      password: "password123"
    })
    
    expect(response.status).toBe(201)
  })

  it("Should return a Bad Request Exception when trying to create a user with a existent email", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Name Lastname",
      email: "name.lastname@gmail.com",
      password: "password123"
    })
    
    expect(response.status).toBe(400)
  })
})