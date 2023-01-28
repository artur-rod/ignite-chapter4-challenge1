import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

describe("Create Statement Controller", () => {
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

  it("Should create a new DEPOSIT statement", async () => {
    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Deposit Test"
    }).set({
      Authorization: `Bearer ${token}`
    })
    
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.type).toBe("deposit")
  })

  it("Should create a new WITHDRAW statement", async () => {
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "Withdraw Test"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.type).toBe("withdraw")
  })

  it("Should return a Bad Request Exception when trying to withdraw with insufficient funds", async () => {
    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 500,
      description: "Withdraw Test"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message")
  })
})