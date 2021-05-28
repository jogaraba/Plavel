const app = require("../server/server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);

it("gets the test endpoint", () => {
  request.get("/add").then((response) => {
    expect(response.statusCode).toBe(404);
  });
});