import { argv } from 'bun';
import { parseArgs } from 'util';

function main() {
  const { positionals } = parseArgs({
    args: argv,
    strict: true,
    allowPositionals: true,
  });

  const args = positionals.slice(2);

  if (args.length === 0) {
    console.error('No entry URL provided');
    process.exit(1);
  }

  if (args.length > 1) {
    console.error(
      'Incorrect number of arguments, you should pass only the entry URL'
    );
    process.exit(1);
  }

  const [baseURL] = args;
  console.info(`Starting to crawl URL: ${baseURL} ...`);
}

main();
