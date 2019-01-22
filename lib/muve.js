export class Patch {
  /**
   * Data class for storing the diff of two nodes
   *
   * @param {string} type The action required to reconcile the DOM.
   * @param {number[]} lookup The location of the node in the DOM.
   * @param {Object} node The virtual node to be patched.
   * @param {string[]} deletedAttrs Attributes to be removed from the DOM node.
   * @param {Object} updatedAttrs Attributes to be updated or added to the DOM node.
   */
  constructor(type, lookup, node, deletedAttrs = [], updatedAttrs = {}) {
    this.type = type;
    this.lookup = lookup;
    this.node = node;
    this.deletedAttrs = deletedAttrs;
    this.updatedAttrs = updatedAttrs;
  }
}

/**
 * Utility function to create a new array
 * from an existing array (if it exists)
 * and any provided elements.
 * @param {*} arr
 * @param  {...any} elements
 */
function concat(arr, ...elements) {
  if (!arr) return elements;
  return arr.concat(elements);
}

/**
 * @param {*} arr
 */
function buildKeyMap(arr) {
  let keyMap = {},
    i = 0,
    l = arr.length;

  if (l === 0) return null;

  for (; i < l; i++) {
    // if any element is missing a key abort
    if (!arr[i].key) return null;
    keyMap[arr[i].key] = arr[i];
  }

  return keyMap;
}

/**
 * @param {*} left
 * @param {*} right
 */
function isEqual(left, right) {
  let obj = Object.assign({}, left, right);
  for (let p in obj) {
    if (
      !left.hasOwnProperty(p) ||
      !right.hasOwnProperty(p) ||
      left[p] !== right[p]
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Given two virtual DOM trees, determine what patches are
 * needed to make the previous tree match the next tree.
 * @param {*} prev
 * @param {*} next
 * @param {number[]} lookup
 */
export function diff(prev, next, lookup) {
  let i = 0,
    j = 0,
    patches = [],
    l = Math.max(prev.length, next.length),
    prevMap = buildKeyMap(prev),
    nextMap = buildKeyMap(next);

  /**
   * If a keyed collection is encountered we can optimize
   * the number of patches needed.
   */
  if (prevMap && nextMap) {
    for (; j < l; j++) {
      if (next[j] && !prevMap[next[j].key]) {
        /**
         * let prev = [{ key: 1 }];
         * let next = [{ key: 0 }, { key: 1 }];
         *
         * In this scenario, insert the zero element into prev
         * and push a patch to INSERT the element.
         */
        patches.push(new Patch("INSERT", concat(lookup, j), next[j]));
        prev.splice(j, 0, next[j]);
      }

      if (prev[j] && !nextMap[prev[j].key]) {
        /**
         * let prev = [{ key: 0 }, { key: 1 }];
         * let next = [{ key: 1 }];
         *
         * In this scenario, remove the zero element from prev
         * and push a patch to DELETE the element.
         */
        patches.push(new Patch("DELETE", concat(lookup, j), prev[j]));
        prev.splice(j, 1);
      }
    }
  }

  for (; i < l; i++) {
    let left = prev[i],
      right = next[i],
      patchLookup = concat(lookup, i);

    // This means a keyed DELETE was performed
    if (!left && !right) continue;

    if (!left && right) {
      // insert right & it's children
      patches.push(new Patch("INSERT", patchLookup, right));
      continue;
    }

    if (left && !right) {
      // delete left & it's children
      patches.push(new Patch("DELETE", patchLookup, left));
      continue;
    }

    if (typeof left == "string" || typeof right == "string") {
      /**
       * Text nodes won't have children or attributes, replace
       * if needed and continue.
       */
      if (left != right) {
        patches.push(new Patch("REPLACE", patchLookup, right));
      }

      continue;
    }

    // update type, attributes, children

    if (left.el != right.el) {
      /**
       * Replace will set attributes & create children so we
       * don't need to diff this node any further
       */
      patches.push(new Patch("REPLACE", patchLookup, right));
      continue;
    }

    let attr = Object.assign({}, left.attributes, right.attributes),
      deletedAttrs = [],
      updatedAttrs = {},
      hasUpdate = false;

    for (let name in attr) {
      if (!right.attributes.hasOwnProperty(name)) {
        // the attribute must be removed
        deletedAttrs.push(name);
      } else if (
        !left.attributes.hasOwnProperty(name) ||
        left.attributes[name] !== right.attributes[name]
      ) {
        // either a new attribute or an updated value
        if (name === "style") {
          // style objects require more than an equality check
          if (isEqual(left.attributes[name], right.attributes[name])) {
            continue;
          }
        }

        updatedAttrs[name] = right.attributes[name];

        if (!hasUpdate) hasUpdate = true;
      }
    }

    if (deletedAttrs.length > 0 || hasUpdate) {
      let patch = new Patch(
        "UPDATE",
        patchLookup,
        right,
        deletedAttrs,
        updatedAttrs
      );
      patches.push(patch);
    }

    let children = diff(left.children, right.children, patchLookup);

    if (children.length > 0) {
      patches.push(...children);
    }
  }

  return patches;
}

/**
 * @param {HTMLElement} target
 * @param {number[]} lookup
 */
function getElement(target, lookup) {
  let node = target;

  for (let i = 0, l = lookup.length; i < l; i++) {
    node = node.childNodes[lookup[i]];
  }

  return node || target;
}

/**
 * @param {Event} evt
 */
function delegateEvent(evt) {
  return this._listeners[evt.type](evt);
}

/**
 * @param {HTMLElement} el
 * @param {*} updatedAttrs
 */
function setAttributes(el, updatedAttrs) {
  for (let prop in updatedAttrs) {
    if (prop.startsWith("on")) {
      let name = prop.slice(2).toLowerCase();
      el.addEventListener(name, delegateEvent);
      el._listeners = el._listeners || {};
      el._listeners[name] = updatedAttrs[prop];
      continue;
    }

    if (prop === "style") {
      for (let name in updatedAttrs[prop]) {
        el.style[name] = updatedAttrs[prop][name];
      }
      continue;
    }

    el[prop] = updatedAttrs[prop];
  }
}

/**
 * @param {*} node
 */
function createElement(node) {
  if (typeof node === "string") return document.createTextNode(node);

  let el = document.createElement(node.el),
    i = 0,
    l = node.children.length;

  for (; i < l; i++) {
    el.appendChild(createElement(node.children[i]));
  }

  setAttributes(el, node.attributes);

  return el;
}

/**
 * @param {*} target
 * @param {*} patches
 */
export function reconcile(target, patches) {
  while (patches.length > 0) {
    let patch = patches.shift(),
      node = getElement(target, patch.lookup),
      parent = node.parentNode;

    switch (patch.type) {
      case "INSERT":
        node.appendChild(createElement(patch.node));
        break;
      case "DELETE":
        // TODO: ? Check patch.node for any event listeners to be removed.
        parent.removeChild(node);
        break;
      case "REPLACE":
        parent.replaceChild(createElement(patch.node), node);
        break;
      case "UPDATE":
        // TODO: Set, Update, Remove attributes
        setAttributes(node, patch.updatedAttrs);
      default:
        break;
    }
  }
}
