const onlineService = require('./services/online.service');
try {
  onlineService.enqueuePlayer({ id: '1', username: 'test' });
  console.log("Enqueued 1");
  onlineService.enqueuePlayer({ id: '1', username: 'test' });
  console.log("Enqueued 1 again");
} catch(e) {
  console.error("Error:", e.message);
}
