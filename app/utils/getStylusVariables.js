const fs = require('fs').promises;

module.exports = async function(file) {
    let contents;
    try {
        contents = await fs.readFile(file, 'utf-8');
    } catch (e) {
        // file does not exist
        return {};
    }

    return contents.split('\n').reduce((acc, line) => {
        if (line[0] === '$') {
            const [name, value] = line.split(':=');
            if (name && value) {
                acc[name.trim()] = value.trim();
            }
        }
        return acc;
    }, {});
}

