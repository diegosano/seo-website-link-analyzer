import { argv } from 'bun';
import { parseArgs } from 'util';

import { crawlPage } from './crawl';
import { logger } from './utils/logger';
import { printReport } from './report';

async function main() {
  const { positionals } = parseArgs({
    args: argv,
    strict: true,
    allowPositionals: true,
  });

  const args = positionals.slice(2);

  if (args.length === 0) {
    logger.error('No entry URL provided');
    process.exit(1);
  }

  if (args.length > 1) {
    logger.error(
      'Incorrect number of arguments, you should pass only the entry URL'
    );
    process.exit(1);
  }

  const [baseURL] = args;

  logger.info(`Starting to crawl URL: ${baseURL} ...`);

  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
  process.exit(0);
}

main().catch((err) => {
  logger.error('Aborting...');
  if (err instanceof Error) {
    logger.error(err);
  } else {
    logger.error('An unknown error has occurred:');
    console.log(err);
  }
  process.exit(1);
});
