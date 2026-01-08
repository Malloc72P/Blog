import Express from 'express';
import Path from 'path';
import Livereload from 'livereload';
import ConnectLiveReload from 'connect-livereload';
import connectLivereload from 'connect-livereload';

const app = Express();
const port = 3000;
const root = 'src';

const liveReloadServer = Livereload.createServer();
liveReloadServer.watch(Path.resolve('./src'));
app.use(connectLivereload());

Express.static(root);

app.get('/*', (req, res) => {
  const filePath = Path.resolve(Path.join('./src', req.originalUrl, 'index.html'));

  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
