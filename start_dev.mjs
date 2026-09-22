import { dev } from 'astro';

try {
  const server = await dev({
    root: '.',
    server: {
      port: 4321,
      host: true
    }
  });
  console.log(`\n>>> Astro Dev Server is active and listening at http://localhost:${server.address.port} <<<\n`);
} catch (err) {
  console.error('Error starting Astro dev server:', err);
  process.exit(1);
}
