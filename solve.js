// csv-reader 1.0.0 compatible fast parser - optimized drop-in replacement
// Must produce IDENTICAL output to vendor/csv-reader/index.js

const COMMA = 'comma';
const LINE_BREAK = 'line break';
const END = 'end';

export function readCsv(input) {
  const text = String(input.text);
  const header = input.header === true;
  const errors = [];
  const rows = [];
  let columns = null;
  let width = -1;

  let pos = 0;
  let line = 1;
  if (text[0] === '\uFEFF') pos = 1;

  let recordLine = 1;
  let recordRow = null;

  function error(code) {
    errors.push({ code, line: recordLine, row: recordRow });
  }

  const len = text.length;
  
  function at(i) {
    return i < len ? text[i] : '';
  }

  // Read unquoted field - optimized with indexOf where possible
  function readUnquoted(value) {
    let added = 0;
    while (pos < len) {
      const c = text[pos];
      if (c === ',') {
        pos++;
        return { value, ended: COMMA, added };
      }
      if (c === '\n') {
        pos++;
        line++;
        return { value, ended: LINE_BREAK, added };
      }
      if (c === '\r') {
        if (pos + 1 < len && text[pos + 1] === '\n') {
          pos += 2;
          line++;
          return { value, ended: LINE_BREAK, added };
        }
        error('stray_cr');
        pos++;
        continue;
      }
      value += c;
      added++;
      pos++;
    }
    return { value, ended: END, added };
  }

  // Read quoted field
  function readQuoted() {
    const open = pos;
    const openLine = line;
    let value = '';
    pos++; // skip opening quote
    let closed = false;
    
    while (pos < len) {
      const c = text[pos];
      if (c === '"') {
        if (pos + 1 < len && text[pos + 1] === '"') {
          value += '"';
          pos += 2;
          continue;
        }
        pos++;
        closed = true;
        break;
      }
      if (c === '\r') {
        value += '\n';
        line++;
        pos += (pos + 1 < len && text[pos + 1] === '\n') ? 2 : 1;
        continue;
      }
      if (c === '\n') line++;
      value += c;
      pos++;
    }
    
    if (!closed) {
      // Unterminated quote: quote is literal, re-read rest as unquoted
      pos = open + 1;
      line = openLine;
      error('unterminated_quote');
      return readUnquoted('"');
    }
    
    if (pos >= len) return { value, ended: END };
    
    const c = text[pos];
    if (c === ',') {
      pos++;
      return { value, ended: COMMA };
    }
    if (c === '\n') {
      pos++;
      line++;
      return { value, ended: LINE_BREAK };
    }
    if (c === '\r' && pos + 1 < len && text[pos + 1] === '\n') {
      pos += 2;
      line++;
      return { value, ended: LINE_BREAK };
    }
    
    // Quote junk: append what follows up to comma/linebreak
    const junk = readUnquoted(value);
    if (junk.added > 0) error('quote_junk');
    return junk;
  }

  while (true) {
    // Skip empty lines (lines with no characters)
    while (pos < len) {
      const c = text[pos];
      if (c === '\n') {
        pos++;
        line++;
      } else if (c === '\r' && pos + 1 < len && text[pos + 1] === '\n') {
        pos += 2;
        line++;
      } else {
        break;
      }
    }
    if (pos >= len) break;

    recordLine = line;
    recordRow = header && columns === null ? null : rows.length;
    const fields = [];
    let field;
    let quoted;
    
    do {
      quoted = text[pos] === '"';
      field = quoted ? readQuoted() : readUnquoted('');
      fields.push(field.value);
    } while (field.ended === COMMA);

    // Line with only stray CRs -> no record (stray_cr errors already recorded)
    if (fields.length === 1 && fields[0] === '' && !quoted) continue;

    if (width < 0) width = fields.length;
    if (header && columns === null) {
      columns = fields;
      continue;
    }
    if (fields.length < width) {
      errors.push({ code: 'short_row', line: recordLine, row: recordRow, fields: fields.length });
      while (fields.length < width) fields.push('');
    } else if (fields.length > width) {
      const extra = fields.splice(width);
      errors.push({ code: 'long_row', line: recordLine, row: recordRow, extra });
    }
    rows.push(fields);
  }
  
  return { columns: header ? (columns ?? []) : null, rows, errors };
}

export function run(input) {
  return readCsv(input);
}