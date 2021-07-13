import type { Block } from "../bdom";
import { STATUS } from "../status";
import { OwlNode } from "./owl_node";

export class Fiber {
  node: OwlNode;
  bdom: Block | null = null;

  constructor(node: OwlNode) {
    this.node = node;
  }
}

export class ChildFiber extends Fiber {
  root: RootFiber;
  parent: Fiber;

  constructor(node: OwlNode, parent: ChildFiber | RootFiber) {
    super(node);
    this.parent = parent;
    const root = parent.root;
    root.counter++;
    this.root = root;
  }
}

export class RootFiber extends Fiber {
  counter = 1;
  error = null;
  resolve: any;
  promise: any;
  reject: any;
  root: RootFiber;

  constructor(node: OwlNode) {
    super(node);
    this.root = this;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  complete() {
    this.node.bdom!.patch(this.bdom!);
  }
}

export class MountFiber extends RootFiber {
  target: HTMLElement;

  constructor(node: OwlNode, target: HTMLElement) {
    super(node);
    this.target = target;
  }
  complete() {
    const node = this.node;
    node.bdom = this.bdom;
    const nodes: any[] = [node];
    node.bdom!.mount(this.target, nodes);
    let current;
    while ((current = nodes.pop())) {
      current.status = STATUS.MOUNTED;
      for (let cb of current.mounted) {
        cb();
      }
    }
  }
}
