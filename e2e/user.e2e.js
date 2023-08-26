import createApp from "../src/app";
import request from "supertest";

describe("/testing the user route", () => {
  let app = null;
  let server = null;
  let api = null;

  beforeAll(() => {
    app = createApp();
    server = app.listen(9000);
    api = request(app);
  });

  describe("POST/ user", () => {
    test("should response with status code 409", async () => {
      const input = {
        username: "facu156890",
        email: "facundo@correo.com",
        password: "fafafa123456"
      }

      const { statusCode } = await api.post("/api/v1/user").send(input);
      expect(statusCode).toEqual(409);
    });
  });

  afterAll(() => {
    server.close();
  });
});
