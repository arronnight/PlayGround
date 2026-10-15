import { OceanFauna } from '/home/runner/work/PlayGround/PlayGround/src/underwater/OceanFauna.js';
// Kill throughput: distinct victims per 60 sim-seconds per era.
for (const era of ['modern', 'mesozoic', 'paleozoic']) {
  const fauna = new OceanFauna({ seed: 713, era });
  const cam = { x: -140, y: -20, z: 0 };
  const seen = new Set();
  for (let t = 0; t <= 60; t += 1) {
    fauna.update(t, cam, {});
    for (let i = 0; i < fauna.motion.pred.length; i++)
      if (fauna.motion.pred[i].mode !== 0) seen.add(i);
  }
  console.log(era, '| pop:', fauna.population.length, '| victims/60s:', seen.size);
}
