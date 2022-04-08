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

  it('scheduler', () => {
    //effect可以传入scheduler 
    //如果传入了scheduler第一次调用的时候执行用户传入的fn
    //之后的reactive值更新调用scheduler
    let dummy;
    let run;
    let obj = reactive({ age: 10 })
    let scheduler = jest.fn(() => {
      run = runner
    })
    let runner = effect(() => {
      dummy = obj.age
    }, { scheduler })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(10)
    obj.age++
    expect(scheduler).toBeCalledTimes(1)
    run()
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(11)
  })
});
