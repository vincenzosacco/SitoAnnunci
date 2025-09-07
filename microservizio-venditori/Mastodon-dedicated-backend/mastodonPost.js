import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

const client_id = 'mYk6vMW2968OZijo97RHvdWl_U9y7FCNizm_ge5jE7I';
const client_secret = '7JhLyAXmjBpIZ_BQy2MnfE19CJnro2RjGedNRekj-Lc';
const redirect_uri = 'http://localhost:3001/callback';
const mastodon_instance = 'https://mastodon.social';

let access_token = null;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  if (!access_token) {
    const authUrl = `${mastodon_instance}/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=write+read+follow`;
    res.send(`
      <h1>Mastodon OAuth2 Post Demo</h1>
      <a href="${authUrl}">Login con Mastodon</a>
    `);
  } else {
    res.send(`
      <h1>Posta su Mastodon</h1>
      <form action="/post" method="post" enctype="multipart/form-data">
        Titolo:<br><input type="text" name="title" /><br><br>
        Descrizione:<br><textarea name="description" rows="4" cols="40"></textarea><br><br>
        Immagine:<br><input type="file" name="image" accept="image/*" /><br><br>
        <button type="submit">Posta</button>
      </form>
      <br><a href="/logout">Logout</a>
    `);
  }
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Errore: nessun codice di autorizzazione');

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
    res.redirect('/');
  } catch (err) {
    res.send('Errore durante il token exchange: ' + err.message);
  }
});

app.post('/post', upload.single('image'), async (req, res) => {
  if (!access_token) return res.status(401).send('Non autorizzato');

  const { title, description } = req.body;
  const text = `**${title}**\n${description}`;

  try {
    let media_id = null;
    if (req.file) {
      const mediaData = fs.createReadStream(path.join(__dirname, req.file.path));
      const mediaResp = await axios.post(`${mastodon_instance}/api/v1/media`, mediaData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      media_id = mediaResp.data.id;
      fs.unlinkSync(path.join(__dirname, req.file.path));
    }

const postResp = await axios.post(`${mastodon_instance}/api/v1/statuses`, {
  status: text,
  media_ids: media_id ? [media_id] : [],
}, {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});

// Redirect automatico al post creato
res.redirect(postResp.data.url);

    res.send(`<h2>Post creato!</h2><p>Id: ${postResp.data.id}</p><p><a href="/">Torna indietro</a></p>`);
  } catch (err) {
    res.status(500).send('Errore durante il post: ' + err.message);
  }
});

app.get('/logout', (req, res) => {
  access_token = null;
  res.redirect('/');
});

app.listen(3001, () => {
  console.log('Server avviato su http://localhost:3001');
  open('http://localhost:3001');
});