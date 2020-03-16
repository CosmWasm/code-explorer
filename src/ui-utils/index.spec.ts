import { ellideMiddle } from ".";

describe("ellideMiddle", () => {
  it("works", () => {
    expect(ellideMiddle("abcde", 1)).toEqual("…");
    expect(ellideMiddle("abcde", 2)).toEqual("a…");
    expect(ellideMiddle("abcde", 3)).toEqual("a…e");
    expect(ellideMiddle("abcde", 4)).toEqual("ab…e");
    expect(ellideMiddle("abcde", 5)).toEqual("abcde");
    expect(ellideMiddle("abcde", 6)).toEqual("abcde");
  });
});
