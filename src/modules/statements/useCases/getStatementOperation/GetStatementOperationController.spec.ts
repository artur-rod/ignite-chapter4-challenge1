import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Get Statement Operation Controller", () => {
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

  it("Should return a statement details", async () => {
    const statement = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Deposit Test"
    }).set({
      Authorization: `Bearer ${token}`
    })
    const { id: statementId } = statement.body

    const response = await request(app).get(`/api/v1/statements/${statementId}`).set({
      Authorization: `Bearer ${token}`
    })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
  })

  it("Should return a Not Found Exception when trying to get a nonexistent statement", async () => {
    const randomUUID = uuidV4()
    const response = await request(app).get(`/api/v1/statements/${randomUUID}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty("message")
  })
})