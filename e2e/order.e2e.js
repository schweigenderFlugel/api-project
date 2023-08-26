import request from "supertest";
import createApp from "../src/app";

describe("test for orders", () => {
  let app = null;
  let server = null;
  let api = null;
  let accessToken = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("get order ", () => {
    beforeAll(async () => {
      const input = {
        email: "facundo@correo.com",
        password: "fafafa123456",
      };
      const { body: bodyLogin } = await api.post("/api/v1/login").send(input);
      accessToken = bodyLogin.accessToken;
    });

    test("it should return a status code 404", async () => {
      const { statusCode } = await api.get("/api/v1/order").send();
      expect(statusCode).toEqual(404);
    });
  });

  afterAll(async () => {
    await server.close();
  });
});
