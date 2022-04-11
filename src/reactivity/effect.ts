import { extend } from './../shared/index';
class ReactiveEffect {
  public scheduler: any//添加一个scheduler属性
  public deps = []
  private _fn: any;
  private active = true
  private onStop?: () => void
  constructor(fn, scheduler?) {
    //将传入的scheduler存储起来
    this.scheduler = scheduler
    this._fn = fn;
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this;//用于存储依赖
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this);
      if (this.onStop) {
        this.onStop()
      }
    }
    this.active = false
  }
}
function cleanUpEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}
const targetMap = new Map();
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return
  dep.add(activeEffect);
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options)
  _effect.run();
  let runner: any = _effect.run.bind(_effect)
  //将effect挂载到runner上，以便在stop函数中使用
  runner._effect = _effect
  return runner
}

export const stop = (runner: any) => {
  runner._effect.stop()
}