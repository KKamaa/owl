import { Component, mount, useState, xml } from "../../src/core";
import { fromName, makeTestFixture, nextTick, snapshotTemplateCode } from "../helpers";

let fixture: HTMLElement;

beforeEach(() => {
  fixture = makeTestFixture();
});

describe("slots", () => {
  test("simple default slot", async () => {
    class Child extends Component {
      static template = xml`<span><t t-slot="default"/></span>`;
    }

    class Parent extends Component {
      static template = xml`<Child>some text</Child>`;
      static components = { Child };
    }
    await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Parent.template));
    snapshotTemplateCode(fromName(Child.template));
    expect(fixture.innerHTML).toBe("<span>some text</span>");
  });

  test("simple default slot, variation", async () => {
    class Child extends Component {
      static template = xml`<t t-slot="default"/>`;
    }

    class Parent extends Component {
      static template = xml`<Child>some text</Child>`;
      static components = { Child };
    }
    await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Parent.template));
    snapshotTemplateCode(fromName(Child.template));
    expect(fixture.innerHTML).toBe("some text");
  });

  test("fun: two calls to the same slot", async () => {
    class Child extends Component {
      static template = xml`<t t-slot="default"/><t t-slot="default"/>`;
    }

    class Parent extends Component {
      static template = xml`<Child>some text</Child>`;
      static components = { Child };
    }
    await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Parent.template));
    snapshotTemplateCode(fromName(Child.template));
    expect(fixture.innerHTML).toBe("some textsome text");
  });

  test("slot content is bound to caller", async () => {
    class Child extends Component {
      static template = xml`<span><t t-slot="default"/></span>`;
    }

    class Parent extends Component {
      static template = xml`<Child><button t-on-click="inc">some text</button></Child>`;
      static components = { Child };
      state = useState({ value: 0 });
      inc() {
        this.state.value++;
      }
    }
    const parent = await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Parent.template));
    snapshotTemplateCode(fromName(Child.template));
    expect(parent.state.value).toBe(0);
    fixture.querySelector("button")!.click();
    expect(parent.state.value).toBe(1);
  });

  test("can define and call slots", async () => {
    class Dialog extends Component {
      static template = xml`
        <div>
          <div><t t-slot="header"/></div>
          <div><t t-slot="footer"/></div>
        </div>`;
    }

    class Parent extends Component {
      static components = { Dialog };
      static template = xml`
        <div>
          <Dialog>
            <t t-set-slot="header"><span>header</span></t>
            <t t-set-slot="footer"><span>footer</span></t>
          </Dialog>
        </div>`;
    }
    await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));
    expect(fixture.innerHTML).toBe(
      "<div><div><div><span>header</span></div><div><span>footer</span></div></div></div>"
    );
  });

  test("no named slot content => just no children", async () => {
    class Dialog extends Component {
      static template = xml`<span><t t-slot="header"/></span>`;
    }
    class Parent extends Component {
      static template = xml`<Dialog/>`;
      static components = { Dialog };
    }
    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));

    await mount(Parent, { target: fixture });
    expect(fixture.innerHTML).toBe("<span></span>");
  });

  test("named slots can define a default content", async () => {
    class Dialog extends Component {
      static template = xml`
          <span>
            <t t-slot="header">default content</t>
          </span>`;
    }
    class Parent extends Component {
      static template = xml`<div><Dialog/></div>`;
      static components = { Dialog };
    }
    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));

    await mount(Parent, { target: fixture });
    expect(fixture.innerHTML).toBe("<div><span>default content</span></div>");
  });

  test("dafault slots can define a default content", async () => {
    class Dialog extends Component {
      static template = xml`
        <span>
          <t t-slot="default">default content</t>
        </span>`;
    }
    class Parent extends Component {
      static template = xml`<div><Dialog/></div>`;
      static components = { Dialog };
    }
    await mount(Parent, { target: fixture });

    snapshotTemplateCode(fromName(Dialog.template));
    expect(fixture.innerHTML).toBe("<div><span>default content</span></div>");
  });

  test("default content is not rendered if slot is provided", async () => {
    class Dialog extends Component {
      static template = xml`
          <span>
            <t t-slot="default">default content</t>
          </span>`;
    }
    class Parent extends Component {
      static template = xml`<div><Dialog>hey</Dialog></div>`;
      static components = { Dialog };
    }
    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));
    await mount(Parent, { target: fixture });

    expect(fixture.innerHTML).toBe("<div><span>hey</span></div>");
  });

  test("default content is not rendered if named slot is provided", async () => {
    class Dialog extends Component {
      static template = xml`
          <span>
            <t t-slot="header">default content</t>
          </span>`;
    }
    class Parent extends Component {
      static template = xml`<div><Dialog><t t-set-slot="header">hey</t></Dialog></div>`;
      static components = { Dialog };
    }
    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));
    await mount(Parent, { target: fixture });

    expect(fixture.innerHTML).toBe("<div><span>hey</span></div>");
  });

  test("slots are rendered with proper context", async () => {
    class Dialog extends Component {
      static template = xml`<span><t t-slot="footer"/></span>`;
    }

    class Parent extends Component {
      static template = xml`
        <div>
          <span class="counter"><t t-esc="state.val"/></span>
          <Dialog>
            <t t-set-slot="footer">
              <button t-on-click="doSomething">do something</button>
            </t>
          </Dialog>
        </div>`;
      static components = { Dialog };
      state = useState({ val: 0 });
      doSomething() {
        this.state.val++;
      }
    }
    snapshotTemplateCode(fromName(Dialog.template));
    snapshotTemplateCode(fromName(Parent.template));

    await mount(Parent, { target: fixture });

    expect(fixture.innerHTML).toBe(
      '<div><span class="counter">0</span><span><button>do something</button></span></div>'
    );

    fixture.querySelector("button")!.click();
    await nextTick();

    expect(fixture.innerHTML).toBe(
      '<div><span class="counter">1</span><span><button>do something</button></span></div>'
    );
  });

  test("slots are rendered with proper context, part 2", async () => {
    class Link extends Component {
      static template = xml`
          <a t-att-href="props.to">
            <t t-slot="default"/>
          </a>`;
    }

    class App extends Component {
      static template = xml`
        <div>
          <u><li t-foreach="state.users" t-as="user" t-key="user.id">
              <Link to="'/user/' + user.id">User <t t-esc="user.name"/></Link>
          </li></u>
        </div>`;

      state = useState({
        users: [
          { id: 1, name: "Aaron" },
          { id: 2, name: "David" },
        ],
      });
      static components = { Link };
    }
    snapshotTemplateCode(fromName(App.template));
    snapshotTemplateCode(fromName(Link.template));

    const app = await mount(App, { target: fixture });

    expect(fixture.innerHTML).toBe(
      '<div><u><li><a href="/user/1">User Aaron</a></li><li><a href="/user/2">User David</a></li></u></div>'
    );

    // test updateprops here
    app.state.users[1].name = "Mathieu";
    await nextTick();
    expect(fixture.innerHTML).toBe(
      '<div><u><li><a href="/user/1">User Aaron</a></li><li><a href="/user/2">User Mathieu</a></li></u></div>'
    );
  });

  test("slots are rendered with proper context, part 3", async () => {
    class Link extends Component {
      static template = xml`
          <a t-att-href="props.to">
            <t t-slot="default"/>
          </a>`;
    }

    class App extends Component {
      static template = xml`
        <div>
          <u><li t-foreach="state.users" t-as="user" t-key="user.id" >
              <t t-set="userdescr" t-value="'User ' + user.name"/>
              <Link to="'/user/' + user.id"><t t-esc="userdescr"/></Link>
          </li></u>
        </div>`;
      state = useState({
        users: [
          { id: 1, name: "Aaron" },
          { id: 2, name: "David" },
        ],
      });
      static components = { Link };
    }

    snapshotTemplateCode(fromName(App.template));
    snapshotTemplateCode(fromName(Link.template));

    const app = await mount(App, { target: fixture });

    expect(fixture.innerHTML).toBe(
      '<div><u><li><a href="/user/1">User Aaron</a></li><li><a href="/user/2">User David</a></li></u></div>'
    );

    // test updateprops here
    app.state.users[1].name = "Mathieu";
    await nextTick();
    expect(fixture.innerHTML).toBe(
      '<div><u><li><a href="/user/1">User Aaron</a></li><li><a href="/user/2">User Mathieu</a></li></u></div>'
    );
  });

  test("slots are rendered with proper context, part 4", async () => {
    class Link extends Component {
      static template = xml`
          <a t-att-href="props.to">
            <t t-slot="default"/>
          </a>`;
    }

    class App extends Component {
      static template = xml`
        <div>
          <t t-set="userdescr" t-value="'User ' + state.user.name"/>
          <Link to="'/user/' + state.user.id"><t t-esc="userdescr"/></Link>
        </div>`;
      static components = { Link };
      state = useState({ user: { id: 1, name: "Aaron" } });
    }

    snapshotTemplateCode(fromName(App.template));

    const app = await mount(App, { target: fixture });

    expect(fixture.innerHTML).toBe('<div><a href="/user/1">User Aaron</a></div>');

    // test updateprops here
    app.state.user.name = "David";
    await nextTick();
    expect(fixture.innerHTML).toBe('<div><a href="/user/1">User David</a></div>');
  });
});