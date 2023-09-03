import request from "supertest";
import createApp from "../src/app";

describe("/testing the login route", () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("POST/ login", () => {
    test("it should renponse with status code 400", async () => {
      const { statusCode } = await api.post("/api/v1/login").send();
      expect(statusCode).toEqual(400);
    });

    test("it should renponse with status code 404", async () => {
      const input = {
        email: "myemail@correo.com",
        password: "pass123456",
      };
      const { statusCode } = await api.post("/api/v1/login").send(input);
      expect(statusCode).toEqual(404);
    });

    test("it should response with status code 401", async () => {
      const input = {
        email: "facundoez@correo.com",
        password: "pass123456",
      };
      const { statusCode } = await api.post("/api/v1/login").send(input);
      expect(statusCode).toEqual(401);
    });

    test("it should response with status code 200", async () => {
      const input = {
        email: "facundoez@correo.com",
        password: "fafafa1234",
      };
      const { statusCode, body } = await api.post("/api/v1/login").send(input);
      expect( statusCode ).toEqual(200);
      expect(body.accessToken).toBeTruthy();
    });
  });

  afterAll(async () => {
    await server.close();
  });
});
