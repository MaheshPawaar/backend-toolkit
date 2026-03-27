self.onmessage = function (e) {
  try {
    const json = JSON.parse(e.data);

    if (!Array.isArray(json)) {
      self.postMessage({
        error: 'Input must be a JSON array (starts with [ ])',
      });
      return;
    }

    if (json.length === 0) {
      self.postMessage({ error: 'Array is empty' });
      return;
    }

    // collect all unique keys across every object
    const headers = [...new Set(json.flatMap((row) => Object.keys(row)))];

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const rows = json.map((row) =>
      headers.map((h) => escape(row[h])).join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    self.postMessage({ csv });
  } catch (err) {
    self.postMessage({ error: 'Invalid JSON: ' + err.message });
  }
};
