import { describe, expect, spy } from "./driven.js";
import { Patch, reconcile } from "./muve.js";

describe("Apply given patches to the DOM tree", it => {
  it("should apply the given patches to the target node", () => {
    let target = document.createElement("div");
    let node = { el: "h2", attributes: {}, children: ["Hello World!"] };
    let insert = new Patch("INSERT", [0], {
      el: "h1",
      attributes: {},
      children: ["Hello World"]
    });
    let replace = new Patch("REPLACE", [0], node);
    let remove = new Patch("DELETE", [0], node);

    reconcile(target, [insert]);
    expect(target.innerHTML).toBe("<h1>Hello World</h1>");

    reconcile(target, [replace]);
    expect(target.innerHTML).toBe("<h2>Hello World!</h2>");

    reconcile(target, [remove]);
    expect(target.innerHTML).toBe("");
  });

  it("should replace a text node with the updated value", () => {
    let target = document.createElement("div");
    target.innerHTML = "<h1>Hello</h1>";

    let patch = new Patch("REPLACE", [0, 0], "Hello, World");
    reconcile(target, [patch]);

    expect(target.innerHTML).toBe("<h1>Hello, World</h1>");
  });

  it("should set the text input's attributes", () => {
    let target = document.createElement("div");
    target.innerHTML = "<input>";
    let mockAttrs = {
      class: "input",
      placeholder: "Enter some text",
      type: "text",
      onInput: spy()
    };
    let node = { el: "input", attributes: mockAttrs, children: [] };
    let patch = new Patch("UPDATE", [0], node, [], mockAttrs);

    reconcile(target, [patch]);

    let el = target.childNodes[0];
    expect(el.placeholder).toBe(mockAttrs.placeholder);
    expect(el.type).toBe(mockAttrs.type);
    expect(el.class).toBe(mockAttrs.class);

    let evt = new Event("input", {});
    el.dispatchEvent(evt);
    expect(mockAttrs.onInput.callCount).toBe(1);
    expect(mockAttrs.onInput.lastArgs[0]).toBe(evt);
  });

  it("should overwrite an event listener if one exists for the same event", () => {
    let target = document.createElement("div");
    let node = { el: "input", attributes: { onInput: spy() }, children: [] };
    let patch = new Patch("INSERT", [0], node);
    reconcile(target, [patch]);

    expect(target.innerHTML).toBe("<input>");

    let el = target.childNodes[0];
    let evt = new Event("input", {});
    el.dispatchEvent(evt);
    expect(node.attributes.onInput.callCount).toBe(1);
    expect(node.attributes.onInput.lastArgs[0]).toBe(evt);

    let updatedAttrs = { onInput: spy() };
    reconcile(target, [new Patch("UPDATE", [0], node, [], updatedAttrs)]);

    el.dispatchEvent(evt);
    expect(node.attributes.onInput.callCount).toBe(1);
    expect(updatedAttrs.onInput.callCount).toBe(1);
    expect(updatedAttrs.onInput.lastArgs[0]).toBe(evt);
  });

  it("should apply inline styles to the element", () => {
    let target = document.createElement("div");
    let node = {
      el: "h1",
      attributes: { style: { margin: "10px" } },
      children: []
    };
    let patch = new Patch("INSERT", [0], node);
    reconcile(target, [patch]);

    let el = target.childNodes[0];
    expect(el.style.margin).toBe(node.attributes.style.margin);
  });

  // TODO: Style Updates & Attribute deletion
});
