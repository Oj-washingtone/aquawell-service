import request from "supertest";
import app from "../app.js";

//  Playig with tests

describe("Todos API", () => {
  it("GET /todos ---> an array of todos", async () => {
    await request(app)
      .get("/todos")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              completed: expect.any(Boolean),
            }),
          ])
        );
      });
  });

  it("GET /todos/:id ----> return a specific todo by ID", async () => {
    return (await request(app).get("/todos/1"))
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            completed: expect.any(Boolean),
          })
        );
      });
  });

  it("POST /todos ---> create todo return a newly create todo", async () => {
    return request(app)
      .post("/todos")
      .send({
        name: "do dishes",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            name: "do dishes",
            completed: false,
          })
        );
      });
  });

  it("POST /todos ---> validates request body ", async () => {
    return (await request(app).post("/todos"))
      .setEncoding({
        name: 123,
      })
      .expect(422);
  });

  it("GET /todos/:id ---> 404 if not found", async () => {
    return request(app).get("/todos/58583").expect(404);
  });
});
