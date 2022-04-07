import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // update
    user.age++;
    console.log(nextAge);
    expect(nextAge).toBe(12);
  });
  it('should return runner when called effect', () => {
    let age = 10;
    let runner = effect(() => {
      age++
      return 'age'
    })
    expect(age).toBe(11)
    let r = runner()
    expect(age).toBe(12)
    expect(r).toBe('age')
  })
});
