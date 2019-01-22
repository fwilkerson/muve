import { describe, expect } from "./driven.js";
import { diff } from "./muve.js";

describe("Determine differences between two given virtual DOM trees", it => {
  it("should return an empty array if diff is found", () => {
    expect(diff([], [])).toEqual([]);
  });

  it("should insert a node", () => {
    let next = [{ el: "div", attributes: {}, children: [] }];
    expect(diff([], next)).toEqual([
      {
        type: "INSERT",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should delete a node", () => {
    let deletedNode = { el: "div", attributes: {}, children: [] };
    let prev = [deletedNode];
    expect(diff(prev, [])).toEqual([
      {
        type: "DELETE",
        lookup: [0],
        node: deletedNode,
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should replace a node", () => {
    let next = [{ el: "main", attributes: {}, children: [] }];
    expect(diff([{ el: "div", attributes: {}, children: [] }], next)).toEqual([
      {
        type: "REPLACE",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should patch a node's children", () => {
    let deletedNode = { el: "h1", attributes: {}, children: ["Hello, World"] };
    let next = [
      {
        el: "div",
        attributes: {},
        children: [deletedNode]
      }
    ];
    expect(diff([{ el: "div", attributes: {}, children: [] }], next)).toEqual([
      {
        type: "INSERT",
        lookup: [0, 0],
        node: next[0].children[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);

    let prev = next;
    next = [{ el: "div", attributes: {}, children: [] }];
    expect(diff(prev, next)).toEqual([
      {
        type: "DELETE",
        lookup: [0, 0],
        node: deletedNode,
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should replace a child's text node", () => {
    let prev = [
      {
        el: "div",
        attributes: {},
        children: [{ el: "h1", attributes: {}, children: ["Hello"] }]
      }
    ];
    let next = [
      {
        el: "div",
        attributes: {},
        children: [{ el: "h1", attributes: {}, children: ["Hello, World"] }]
      }
    ];
    expect(diff(prev, next)).toEqual([
      {
        type: "REPLACE",
        lookup: [0, 0, 0],
        node: next[0].children[0].children[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should replace a text node with an element and an element with a text node", () => {
    let prev = [{ el: "h1", attributes: {}, children: ["Hello, World"] }];
    let next = [
      {
        el: "h1",
        attributes: {},
        children: [{ el: "em", attributes: {}, children: ["Hello, World"] }]
      }
    ];

    expect(diff(prev, next)).toEqual([
      {
        type: "REPLACE",
        lookup: [0, 0],
        node: next[0].children[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
    expect(diff(next, prev)).toEqual([
      {
        type: "REPLACE",
        lookup: [0, 0],
        node: prev[0].children[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should diff multiple changes across multiple children", () => {
    const prev = [
      { el: "p", attributes: {}, children: ["Count: 0"] },
      {
        el: "div",
        attributes: {},
        children: [
          { el: "button", attributes: {}, children: ["Increment"] },
          { el: "button", attributes: {}, children: ["Decrement"] }
        ]
      },
      { el: "ol", attributes: {}, children: [] }
    ];
    const next = [
      { el: "p", attributes: {}, children: ["Count: 1"] },
      {
        el: "div",
        attributes: {},
        children: [
          { el: "button", attributes: {}, children: ["Increment"] },
          { el: "button", attributes: {}, children: ["Decrement!"] }
        ]
      },
      {
        el: "ol",
        attributes: {},
        children: [
          {
            el: "li",
            attributes: {},
            children: ["The count was incremented from 0 to 1"]
          }
        ]
      }
    ];

    const patches = diff(prev, next);

    expect(patches.length).toBe(3);
    expect(patches[0]).toEqual({
      type: "REPLACE",
      lookup: [0, 0],
      node: next[0].children[0],
      deletedAttrs: [],
      updatedAttrs: {}
    });
    expect(patches[1]).toEqual({
      type: "REPLACE",
      lookup: [1, 1, 0],
      node: next[1].children[1].children[0],
      deletedAttrs: [],
      updatedAttrs: {}
    });
    expect(patches[2]).toEqual({
      type: "INSERT",
      lookup: [2, 0],
      node: next[2].children[0],
      deletedAttrs: [],
      updatedAttrs: {}
    });
  });

  it("should delete a single element from the middle of a list", () => {
    let deletedNode = { el: "li", attributes: {}, children: ["two"], key: 2 };
    let prev = [
      {
        el: "ul",
        attributes: {},
        children: [
          { el: "li", attributes: {}, children: ["one"], key: 1 },
          deletedNode,
          { el: "li", attributes: {}, children: ["three"], key: 3 }
        ]
      }
    ];

    let next = [
      {
        el: "ul",
        attributes: {},
        children: [
          { el: "li", attributes: {}, children: ["one"], key: 1 },
          { el: "li", attributes: {}, children: ["three"], key: 3 }
        ]
      }
    ];

    expect(diff(prev, next)).toEqual([
      {
        type: "DELETE",
        lookup: [0, 1],
        node: deletedNode,
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should add a single element to the head of the list", () => {
    let prev = [
      {
        el: "ul",
        attributes: {},
        children: [
          { el: "li", attributes: {}, children: ["two"], key: 2 },
          { el: "li", attributes: {}, children: ["one"], key: 1 }
        ]
      }
    ];
    let next = [
      {
        el: "ul",
        attributes: {},
        children: [
          { el: "li", attributes: {}, children: ["three"], key: 3 },
          { el: "li", attributes: {}, children: ["two"], key: 2 },
          { el: "li", attributes: {}, children: ["one"], key: 1 }
        ]
      }
    ];

    expect(diff(prev, next)).toEqual([
      {
        type: "INSERT",
        lookup: [0, 0],
        node: next[0].children[0],
        deletedAttrs: [],
        updatedAttrs: {}
      }
    ]);
  });

  it("should determine which attributes need to be updated", () => {
    let prev = [
      { el: "h1", attributes: { id: "title" }, children: ["Hello, World"] }
    ];
    let next = [
      {
        el: "h1",
        attributes: { id: "title", class: "red" },
        children: ["Hello, World"]
      }
    ];

    expect(diff(prev, next)).toEqual([
      {
        type: "UPDATE",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: { class: "red" }
      }
    ]);
  });

  it("should determine which attributes need to be removed", () => {
    let prev = [
      {
        el: "h1",
        attributes: { id: "title", class: "red" },
        children: ["Hello, World"]
      }
    ];
    let next = [
      { el: "h1", attributes: { id: "title" }, children: ["Hello, World"] }
    ];

    expect(diff(prev, next)).toEqual([
      {
        type: "UPDATE",
        lookup: [0],
        node: next[0],
        deletedAttrs: ["class"],
        updatedAttrs: {}
      }
    ]);
  });

  it("should update the attributes style object is a property is added, updated, or deleted", () => {
    let prev = [
      {
        el: "h1",
        attributes: { style: { margin: 10 } },
        children: ["Hello, World"]
      }
    ];

    let next = [
      {
        el: "h1",
        attributes: { style: { margin: 10 } },
        children: ["Hello, World"]
      }
    ];

    expect(diff(prev, next)).toEqual([]);

    next[0].attributes.style.padding = 10;

    expect(diff(prev, next)).toEqual([
      {
        type: "UPDATE",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: { style: { margin: 10, padding: 10 } }
      }
    ]);

    next[0].attributes.style.padding = 15;

    expect(diff(prev, next)).toEqual([
      {
        type: "UPDATE",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: { style: { margin: 10, padding: 15 } }
      }
    ]);

    next[0].attributes.style.padding = undefined;

    expect(diff(prev, next)).toEqual([
      {
        type: "UPDATE",
        lookup: [0],
        node: next[0],
        deletedAttrs: [],
        updatedAttrs: { style: { margin: 10 } }
      }
    ]);
  });
});
