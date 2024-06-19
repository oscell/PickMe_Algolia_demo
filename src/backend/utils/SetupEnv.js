const fs = require('fs');
const readline = require('readline');
const express = require('express');
require('dotenv').config();
const algoliasearch = require('algoliasearch');
const cors = require('cors');
const exp = require('constants');

function setupEnv() {
    return new Promise((resolve, reject) => {
        const envPath = './.env';
        const templatePath = './.env.template';

        if (!fs.existsSync(envPath)) {
            if (fs.existsSync(templatePath)) {
                fs.copyFileSync(templatePath, envPath);
                console.log('.env file created from .env.template');

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                // Prompt for APP_ID
                rl.question('Enter your APP_ID: ', (appId) => {
                    // Prompt for API_KEY
                    rl.question('Enter your API_KEY: ', (apiKey) => {
                        // Write these values to the .env file
                        const envContent = `APP_ID=${appId}\nAPI_KEY=${apiKey}\n`;
                        fs.writeFileSync(envPath, envContent);

                        console.log('APP_ID and API_KEY set in .env file');
                        rl.close();

                        // Resolve the promise to continue the server setup
                        resolve();
                    });
                });
            } else {
                console.error('Error: .env.template file does not exist.');
                reject(new Error('.env.template file does not exist.'));
            }
        } else {
            console.log('.env file already exists.');
            resolve();
        }
    });
}
export default setupEnv;