const fs = require('fs');

const logs = (req, _, next) => {
    const log = {
        'Date': new Date().toISOString(),
        'Request URL': req.originalUrl,
        'Request Type': req.method,
    };

    const logPath = 'logs.json';

    fs.access(logPath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(logPath, JSON.stringify([log]), (err) => {
                if (err) {
                    console.log('Error creating logs', err);
                } else {
                    console.log('Log created!');
                }
            });
        } else {
            fs.readFile(logPath, 'utf8', (err, data) => {
                if (err) {
                    console.log('Error retrieving log file', err);
                } else {
                    let existingLogs = [];

                    try {
                        existingLogs = JSON.parse(data);
                    } catch (parseErr) {
                        console.log('Error parsing logs:', parseErr);
                    }

                    existingLogs.push(log);

                    fs.writeFile(logPath, JSON.stringify(existingLogs), (err) => {
                        if (err) {
                            console.log('Error appending log', err);
                        } else {
                            console.log('Log appended correctly!');
                        }
                    });
                }
            });
        }
    });

    next();
};

module.exports = { logs };
