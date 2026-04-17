const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Script di merge DEFINITIVO compatibile con SamKirkland/FTP-Deploy-Action v4.
 * Converte lo stato locale nel formato strutturato richiesto.
 */

const remoteStatePath = ".github-ftp-sync-state-remote.json";
const mergedStatePath = ".github-ftp-sync-state-merged.json";
const localGoogleDir = "backend/vendor/google";

const DESCRIPTION = "DO NOT DELETE THIS FILE. This file is used to keep track of which files have been synced in the most recent deployment. If you delete this file a resync will need to be done (which can take a while) - read more: https://github.com/SamKirkland/FTP-Deploy-Action";

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

try {
    console.log("📂 Caricamento stato remoto...");
    const remoteState = JSON.parse(fs.readFileSync(remoteStatePath, "utf8"));
    
    // Mappa per accesso rapido esistente (nome -> indice)
    const dataMap = new Map();
    remoteState.data.forEach((item, index) => {
        dataMap.set(item.name, index);
    });

    console.log("🔍 Scansione vendor/google per generazione voci compatibili...");
    const googleFiles = getAllFiles(localGoogleDir);
    let addedCount = 0;
    let updatedCount = 0;

    googleFiles.forEach(filePath => {
        const relativePath = path.relative(localGoogleDir, filePath).replace(/\\/g, "/");
        const statePath = "api/vendor/google/" + relativePath;
        const stats = fs.statSync(filePath);
        const hash = getHash(filePath);

        const entry = {
            type: "file",
            name: statePath,
            size: stats.size,
            hash: hash
        };

        if (dataMap.has(statePath)) {
            remoteState.data[dataMap.get(statePath)] = entry;
            updatedCount++;
        } else {
            remoteState.data.push(entry);
            addedCount++;
        }
    });

    // Assicuriamoci che l'header sia perfetto
    remoteState.description = DESCRIPTION;
    remoteState.version = "1.0.0";
    remoteState.generatedTime = Date.now();

    console.log(`✅ Merge completato: ${addedCount} nuovi, ${updatedCount} aggiornati.`);
    console.log(`📊 Totale elementi finali: ${remoteState.data.length}`);

    fs.writeFileSync(mergedStatePath, JSON.stringify(remoteState, null, 2));
    console.log(`💾 Salvato in: ${mergedStatePath}`);

} catch (err) {
    console.error("❌ Errore:", err);
}
