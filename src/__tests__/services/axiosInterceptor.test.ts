import { describe, it, expect, vi, afterEach } from "vitest";
import API from "../../service/axiosInterceptor";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Axios Interceptor", () => {
  it("should return response for success", async () => {
    const mockResponse = { data: { message: "Success" } };
    vi.spyOn(API, "get").mockResolvedValueOnce(mockResponse);

    const response = await API.get("/test");
    expect(response).toEqual(mockResponse);
  });

  it("should not retry non-401 errors", async () => {
    const error = {
      config: {
        url: "/something",
        method: "get",
      },
      response: { status: 500 },
    };

    vi.spyOn(API, "request").mockRejectedValueOnce(error);

    await expect(
      API.request({
        url: "/something",
        method: "get",
      }),
    ).rejects.toEqual(error);
  });
});
