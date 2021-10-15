import { snapshotEverything } from "../helpers";

snapshotEverything();

// let fixture: HTMLElement;

// beforeEach(() => {
//   fixture = makeTestFixture();
// });

// -----------------------------------------------------------------------------
// t-set
// -----------------------------------------------------------------------------

describe("t-set", () => {
  test.skip("t-set outside modified in t-foreach", async () => {
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="0"/>
    //       <t t-foreach="state.values" t-as="val" t-key="val">
    //         <p>InLoop: <t t-esc="iter"/></p>
    //         <t t-set="iter" t-value="iter + 1"/>
    //       </t>
    //       <p>EndLoop: <t t-esc="iter"/></p>
    //     </div>`;
    //     state = useState({ values: ["a", "b"] });
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>InLoop: 0</p><p>InLoop: 1</p><p>EndLoop: 2</p></div>");
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("t-set outside modified in t-if", async () => {
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="0"/>
    //       <t t-set="flag" t-value="state.flag" />
    //       <t t-if="flag === 'if'">
    //         <t t-set="iter" t-value="2"/>
    //       </t>
    //       <t t-elif="flag === 'elif'">
    //         <t t-set="iter" t-value="3"/>
    //       </t>
    //       <t t-else="">
    //         <t t-set="iter" t-value="4"/>
    //       </t>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //     state = { flag: "if" };
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>2</p></div>");
    //   widget.state.flag = "elif";
    //   await widget.render();
    //   expect(fixture.innerHTML).toBe("<div><p>3</p></div>");
    //   widget.state.flag = "false";
    //   await widget.render();
    //   expect(fixture.innerHTML).toBe("<div><p>4</p></div>");
  });

  test.skip("t-set in t-if", async () => {
    //   // Weird that code block within 'if' leaks outside of it
    //   // Python does the same
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="flag" t-value="state.flag" />
    //       <t t-if="flag === 'if'">
    //         <t t-set="iter" t-value="2"/>
    //       </t>
    //       <t t-elif="flag === 'elif'">
    //         <t t-set="iter" t-value="3"/>
    //       </t>
    //       <t t-else="">
    //         <t t-set="iter" t-value="4"/>
    //       </t>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //     state = { flag: "if" };
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>2</p></div>");
    //   widget.state.flag = "elif";
    //   await widget.render();
    //   expect(fixture.innerHTML).toBe("<div><p>3</p></div>");
    //   widget.state.flag = "false";
    //   await widget.render();
    //   expect(fixture.innerHTML).toBe("<div><p>4</p></div>");
  });

  test.skip("t-set can't alter component", async () => {
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <p><t t-esc="iter"/></p>
    //       <t t-set="iter" t-value="5"/>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //     iter = 1;
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>1</p><p>5</p></div>");
    //   expect(widget.iter).toBe(1);
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("t-set can't alter from within callee", async () => {
    //   env.qweb.addTemplate(
    //     "ChildWidget",
    //     `<div><t t-esc="iter"/><t t-set="iter" t-value="'called'"/><t t-esc="iter"/></div>`
    //   );
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="'source'"/>
    //       <p><t t-esc="iter"/></p>
    //       <t t-call="ChildWidget"/>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>source</p><div>sourcecalled</div><p>source</p></div>");
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("t-set can't alter in t-call body", async () => {
    //   env.qweb.addTemplate(
    //     "ChildWidget",
    //     `<div><t t-esc="iter"/><t t-set="iter" t-value="'called'"/><t t-esc="iter"/></div>`
    //   );
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="'source'"/>
    //       <p><t t-esc="iter"/></p>
    //       <t t-call="ChildWidget">
    //         <t t-set="iter" t-value="'inCall'"/>
    //       </t>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>source</p><div>inCallcalled</div><p>source</p></div>");
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("slot setted value (with t-set) not accessible with t-esc", async () => {
    //   class ChildWidget extends Component {
    //     static template = xml`<div><t t-esc="iter"/><t t-set="iter" t-value="'called'"/><t t-esc="iter"/></div>`;
    //   }
    //   class SomeWidget extends Component {
    //     static components = { ChildWidget };
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="'source'"/>
    //       <p><t t-esc="iter"/></p>
    //       <ChildWidget>
    //         <t t-set="iter" t-value="'inCall'"/>
    //       </ChildWidget>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>source</p><div>called</div><p>source</p></div>");
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("t-set not altered by child widget", async () => {
    //   let child;
    //   class ChildWidget extends Component {
    //     static template = xml`<div><t t-esc="iter"/><t t-set="iter" t-value="'called'"/><t t-esc="iter"/></div>`;
    //     iter = "child";
    //     constructor() {
    //       super(...arguments);
    //       child = this;
    //     }
    //   }
    //   class SomeWidget extends Component {
    //     static components = { ChildWidget };
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="'source'"/>
    //       <p><t t-esc="iter"/></p>
    //       <ChildWidget/>
    //       <p><t t-esc="iter"/></p>
    //     </div>`;
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>source</p><div>childcalled</div><p>source</p></div>");
    //   expect(child.iter).toBe("child");
    //   expect(QWeb.TEMPLATES[SomeWidget.template].fn.toString()).toMatchSnapshot();
  });

  test.skip("t-set outside modified in t-foreach increment-after operator", async () => {
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="0"/>
    //       <t t-foreach="state.values" t-as="val" t-key="val">
    //         <p>InLoop: <t t-esc="iter"/></p>
    //         <t t-set="iter" t-value="iter++"/>
    //       </t>
    //       <p>EndLoop: <t t-esc="iter"/></p>
    //     </div>`;
    //     state = useState({ values: ["a", "b"] });
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>InLoop: 0</p><p>InLoop: 1</p><p>EndLoop: 0</p></div>");
  });

  test.skip("t-set outside modified in t-foreach increment-before operator", async () => {
    //   class SomeWidget extends Component {
    //     static template = xml`
    //     <div>
    //       <t t-set="iter" t-value="0"/>
    //       <t t-foreach="state.values" t-as="val" t-key="val">
    //         <p>InLoop: <t t-esc="iter"/></p>
    //         <t t-set="iter" t-value="++iter"/>
    //       </t>
    //       <p>EndLoop: <t t-esc="iter"/></p>
    //     </div>`;
    //     state = useState({ values: ["a", "b"] });
    //   }
    //   const widget = new SomeWidget();
    //   await widget.mount(fixture);
    //   expect(fixture.innerHTML).toBe("<div><p>InLoop: 0</p><p>InLoop: 1</p><p>EndLoop: 1</p></div>");
  });
});
