package org.example.springboot_back.services;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.io.IOException;

@Component
public class MastodonProcessLauncher {

    private Process nodeProcess;

    /**
     * Avvia il server Node.js scrivendo prima il file server.js (se non esiste)
     * e poi eseguendolo tramite 'node'.
     */
    public void startNodeProcess() throws IOException {
        writeNodeServerFile();

        ProcessBuilder pb = new ProcessBuilder("node", "node-server/server.js");
        pb.redirectErrorStream(true);

        nodeProcess = pb.start();

        // Thread per leggere l'output di Node.js e mostrarlo in console
        new Thread(() -> {
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(nodeProcess.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println("[Node.js] " + line);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        System.out.println("Node.js process avviato.");
    }

    /**
     * Termina il processo Node.js se è attivo.
     */
    public void stopNodeProcess() {
        if (nodeProcess != null && nodeProcess.isAlive()) {
            nodeProcess.destroy();
            System.out.println("Node.js process terminato.");
        }
    }

    /**
     * Scrive il file node-server/server.js contenente il codice Node.js.
     * Sovrascrive il file ogni volta (puoi modificare per scrivere solo se non esiste).
     */
    private void writeNodeServerFile() throws IOException {
        String jsCode = """
        import express from 'express';
        import cors from 'cors';
        import axios from 'axios';
        import multer from 'multer';
        import fs from 'fs';
        import path from 'path';
        import FormData from 'form-data';
        import { fileURLToPath } from 'url';
        import { dirname, join } from 'path';

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const uploadDir = join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        const app = express();
        const upload = multer({ dest: 'uploads/' });

        app.use(cors({
          origin: 'http://localhost:4200',
          credentials: true,
        }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        const client_id = 'mYk6vMW2968OZijo97RHvdWl_U9y7FCNizm_ge5jE7I';
        const client_secret = '7JhLyAXmjBpIZ_BQy2MnfE19CJnro2RjGedNRekj-Lc';
        const redirect_uri = 'http://localhost:3001/callback';
        const mastodon_instance = 'https://mastodon.social';

        let access_token = null;

        app.get('/login-url', (req, res) => {
          const authUrl = `${mastodon_instance}/oauth/authorize?` +
            `client_id=${client_id}&` +
            `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
            `response_type=code&scope=write+read+follow`;
          res.json({ authUrl });
        });

        app.get('/callback', async (req, res) => {
          const code = req.query.code;
          if (!code) return res.status(400).send('Errore: nessun codice di autorizzazione');

          try {
            const tokenResp = await axios.post(`${mastodon_instance}/oauth/token`, null, {
              params: {
                client_id,
                client_secret,
                redirect_uri,
                grant_type: 'authorization_code',
                code,
                scope: 'write read follow',
              },
            });

            access_token = tokenResp.data.access_token;
            console.log('Access token salvato');
            res.send(`<script>window.close();</script>Login avvenuto con successo, puoi chiudere questa finestra.`);
          } catch (err) {
            console.error('Errore nel token exchange', err.message);
            res.status(500).send('Errore durante il token exchange: ' + err.message);
          }
        });

        app.post('/post', upload.single('image'), async (req, res) => {
          if (!access_token) return res.status(401).json({ error: 'Non autorizzato, effettua login prima' });

          const { title, description } = req.body;
          const text = `**${title}**\\n${description}`;

          try {
            let media_id = null;
            if (req.file) {
              const filePath = path.resolve(req.file.path);
              const mediaData = fs.createReadStream(filePath);
              const formData = new FormData();
              formData.append('file', mediaData);
              const formHeaders = formData.getHeaders();

              const mediaResp = await axios.post(`${mastodon_instance}/api/v1/media`, formData, {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  ...formHeaders,
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
              });
              media_id = mediaResp.data.id;
              fs.unlinkSync(filePath);
            }

            const postResp = await axios.post(`${mastodon_instance}/api/v1/statuses`, {
              status: text,
              media_ids: media_id ? [media_id] : [],
            }, {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            });

            res.json({ success: true, url: postResp.data.url, id: postResp.data.id });
          } catch (err) {
            console.error('Errore durante il post:', err.message);
            res.status(500).json({ error: 'Errore durante il post: ' + err.message });
          }
        });

        app.get('/logout', (req, res) => {
          access_token = null;
          res.json({ success: true });
        });

        app.listen(3001, () => {
          console.log('Server avviato su http://localhost:3001');
        });
        """;

        File file = new File("node-server/server.js");
        if (!file.getParentFile().exists()) {
            boolean dirsCreated = file.getParentFile().mkdirs();
            if (!dirsCreated) {
                System.err.println("Attenzione: non è stato possibile creare la cartella node-server");
            }
        }

        try (FileWriter writer = new FileWriter(file)) {
            writer.write(jsCode);
        }
    }
}