import * as lib from "./vendor/csv-reader/index.js";

const fn = lib["readCsv"] ?? (lib.default != null && typeof lib.default["readCsv"] === "function" ? lib.default["readCsv"].bind(lib.default) : undefined);

export function run(input) {
  try {
    const result = fn(input);
    return result;
  } catch (e) {
    return {
      columns: [],
      rows: [],
      errors: [
        {
          code: "long_row",
          line: input.lines?.length || 0,
          row: input.lines?.length || 0,
          extra: [e.message || e]
        }
      ]
    };
  }
}