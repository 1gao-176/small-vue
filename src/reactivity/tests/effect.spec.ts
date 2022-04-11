import { effect, stop } from "../effect";
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

  it('runner', () => {
    let bar = 1
    let runner = effect(() => {
      bar++
      return 'bar'
    })
    //验证用户传入的fn执行
    expect(bar).toBe(2)
    let r = runner()
    //验证在执行runner的时候会再次执行用户传入的fn
    expect(bar).toBe(3)
    //验证runner的返回值等于fn的返回值
    expect(r).toBe('bar')
  })
  it('scheduler', () => {
    let dummy
    let info = reactive({ age: 18 })
    //jest 模拟传入的函数
    const scheduler = jest.fn(() => {
      dummy++
    })
    //将scheduler作为第二个参数传入
    effect(() => {
      dummy = info.age
    }, { scheduler })
    //验证第一次是scheduler不被调用
    expect(scheduler).not.toHaveBeenCalled()
    //验证调用传入的fn
    expect(dummy).toBe(18)
    //执行set操作
    info.age = 20
    //验证执行set操作时会执行传入的scheduler
    expect(dummy).toBe(19)
    expect(scheduler).toBeCalledTimes(1)
  })
  it('stop', () => {
    let dummy
    let info = reactive({ age: 18 })
    let runner = effect(() => {
      dummy = info.age
    })
    expect(dummy).toBe(18)
    //将runner传入stop后，更新reactive不会触发fn
    stop(runner)
    info.age = 20
    expect(dummy).toBe(18)
    //再次执行runner的时候会执行fn
    runner()
    expect(dummy).toBe(20)
  })
  it('onStop', () => {
    let dummy
    let info = reactive({ age: 18 })
    //创建一个onStop函数
    const onStop = jest.fn()
    let runner = effect(() => {
      dummy = info.age
      // 将onStop作为第二个参数传入
    }, { onStop })
    expect(dummy).toBe(18)
    //执行stop之后调用onStop
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
});
