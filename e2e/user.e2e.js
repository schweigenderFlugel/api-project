import request from "supertest";
import createApp from "../src/app";

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
      const { statusCode } = await api.post("/api/v1/user")
        .field("username", "facu1023556")
        .field("email", "facundoez@correo.com")
        .field("password", "fafafa1234")
        .attach("image" , "./e2e/testFiles/userFile.jpg");
      expect(statusCode).toEqual(409);
    });
  });

  afterAll(async () => {
    await server.close();
  });
});
