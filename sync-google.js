const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

/**
 * Script per la sincronizzazione sequenziale della cartella vendor/google su Aruba FTP.
 * Carica i file uno ad uno per evitare errori 425 e rispetta un file di stato JSON.
 */

const config = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false // Aruba Shared Hosting preferisce FTP standard su porta 21 per evitare problemi di firewall
};

const localDir = path.resolve(process.env.LOCAL_DIR || "backend/vendor/google");
const remoteDir = process.env.FTP_REMOTE_ROOT || "/www.arpelux.it/api/vendor/google";
const stateFile = process.env.STATE_FILE || ".github-ftp-sync-state.json";

function getHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });
    return arrayOfFiles;
}

async function sync() {
    console.log(`🚀 Avvio sincronizzazione sequenziale da: ${localDir}`);
    console.log(`📂 Target remoto: ${remoteDir}`);

    const client = new ftp.Client();
    client.ftp.verbose = false;

    let state = { files: {} };
    if (fs.existsSync(stateFile)) {
        try {
            state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
            console.log(`📝 File di stato caricato: ${Object.keys(state.files).length} file tracciati.`);
        } catch (e) {
            console.error("⚠️ Errore lettura file di stato, ne creerò uno nuovo.");
        }
    }

    try {
        await client.access(config);
        console.log("✅ Connesso al server FTP.");

        const files = getAllFiles(localDir);
        console.log(`🔍 Trovati ${files.length} file locali in ${localDir}.`);

        let uploadedCount = 0;
        let skippedCount = 0;

        for (const localPath of files) {
            const relativePath = path.relative(localDir, localPath);
            // IMPORTANTE: Nel JSON di GitHub Action, i percorsi sono relativi alla root del deploy.
            // Qui usiamo il percorso relativo per semplicità, ma se vuoi compatibilità totale 
            // dovresti aggiungere il prefisso 'api/vendor/google/'.
            const statePath = path.join("api/vendor/google", relativePath).replace(/\\/g, "/");
            const remotePath = path.posix.join(remoteDir, relativePath).replace(/\\/g, "/");
            
            const currentHash = getHash(localPath);

            if (state.files[statePath] === currentHash) {
                skippedCount++;
                continue;
            }

            console.log(`[${uploadedCount + skippedCount + 1}/${files.length}] Caricamento: ${relativePath}...`);
            
            // Assicuriamoci che la cartella remota esista
            const remoteFolder = path.posix.dirname(remotePath);
            await client.ensureDir(remoteFolder);
            
            // Caricamento SEQUENZIALE
            await client.uploadFrom(localPath, remotePath);
            
            // Aggiorna stato
            state.files[statePath] = currentHash;
            uploadedCount++;

            // Salva lo stato ogni 50 file per non perdere progressi in caso di crash
            if (uploadedCount % 50 === 0) {
                fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
            }
        }

        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
        console.log(`\n🎉 Sincronizzazione completata!`);
        console.log(`✅ File caricati: ${uploadedCount}`);
        console.log(`⏩ File saltati (già presenti): ${skippedCount}`);

    } catch (err) {
        console.error("\n❌ Errore durante la sincronizzazione:");
        console.error(err);
        // Salva lo stato prima di chiudere
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    } finally {
        client.close();
    }
}

sync();
