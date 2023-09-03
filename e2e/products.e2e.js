import createApp from "../src/app";
import request from "supertest";

describe("testing the products route", () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("products", () => {
    beforeAll(async () => {
      const input = {
        email: "facundoez@correo.com",
        password: "fafafa1234",
      };
      const { body } = await api.post("/api/v1/login").send(input);
      accessToken = body.accessToken;
    });

    test("should get a status code 200 and a array", async () => {
      const { statusCode, body } = await api.get("/api/v1/product").send();
        expect(statusCode).toEqual(200);
        expect(body).toBeInstanceOf(Array);
    });

    test("should get a status code 401", async () => {
      const { statusCode } = await api.post("/api/v1/product").send(); 
      expect(statusCode).toEqual(401);
    })

    test("should get a status code 400", async () => {
      const { statusCode } = await api.post("/api/v1/product")
        .set('Authorization', `Bearer ${accessToken}`)
        .send(); 
        expect(statusCode).toEqual(400);
    })

    test("should get a status code 201", async () => {
      const { statusCode } = await api.post("/api/v1/product")
        .set('Authorization', `Bearer ${accessToken}`)
        .field("name", "pizza")
        .field("price", "2000")
        .field("description", "con peperoni")
        .attach("image", "./e2e/testFiles/productFile.jpg")
        expect(statusCode).toEqual(201);
    })
  });

  afterAll(async () => {
    await server.close();
  });
});
