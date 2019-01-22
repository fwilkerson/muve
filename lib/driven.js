const encode = JSON.stringify;

const initTest = tests => (msg, fn) => {
  tests[msg] = fn;
};

const print = (msg, level = 1) => err => {
  const txt =
    getIndentation(level) +
    (level === 0 ? "" : err ? "✘ " : "✓ ") +
    msg +
    (err
      ? err.message
          .split("\n")
          .map(msg => "\n" + getIndentation(level + 1) + msg)
          .join("")
      : "");
  err ? console.error(txt) : console.log(txt);
  const node = document.createElement("pre");
  node.innerText = txt;
  node.setAttribute("class", level === 0 ? "" : err ? "failure" : "success");
  document.body.appendChild(node);
};

export function describe(description, suite) {
  const tests = {};

  suite(initTest(tests));
  print(description, 0)();

  for (let test in tests) {
    try {
      const res = tests[test]();
      if (!res) print(test)();
      else res.then(print(test)).catch(print(msg));
    } catch (err) {
      print(test)(err);
    }
  }
}

export function expect(actual) {
  return {
    toBe: expected => {
      if (actual === expected) return;
      const err = errorFactory(expected, actual);
      throw err;
    },
    toEqual: expected => {
      if (encode(actual) == encode(expected)) return;
      const err = errorFactory(expected, actual);
      throw err;
    }
  };
}

export function spy(mockImpl = () => {}) {
  function fn(...args) {
    fn.lastArgs = args;
    fn.callCount += 1;
    fn.called = true;
    return mockImpl();
  }

  fn.lastArgs = [];
  fn.callCount = 0;
  fn.called = false;

  return fn;
}

function getIndentation(level) {
  const tab = "  ";
  let indentation = "";
  for (let i = 0; i < level; i++) {
    indentation += tab;
  }

  return indentation;
}

function errorFactory(expected, actual) {
  return new Error(
    `Expected: ${encode(expected)}\n` + `Actual:   ${encode(actual)}`
  );
}
