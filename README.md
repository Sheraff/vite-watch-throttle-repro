# Vite dev server misses a save made within 50ms of the previous one

```sh
npm install
npm run repro    # two saves 10ms apart: the second is never reported
npm run control  # two saves 100ms apart: both are reported
```

`repro.js` starts a dev server and saves `root/a.js` twice, 10 times in a row, logging what `server.watcher`'s `change` events saw.
