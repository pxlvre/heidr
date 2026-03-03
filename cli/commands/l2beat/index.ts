import { Command } from 'commander';
import { L2BeatService } from '@/services/l2beat/l2beat.service';
import {
  printScalingTable,
  printScalingJson,
  printTvsTable,
  printTvsJson,
  printProjectTable,
  printProjectJson,
  printActivityTable,
  printActivityJson,
} from '@/cli/printers/l2beat.printer';
import { printError } from '@/utils/formatter';

// scaling subcommand — list all active scaling projects
const scalingCommand = new Command('scaling')
  .description('List all L2Beat scaling projects')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const service = new L2BeatService();
      const summary = await service.getScalingSummary();

      if (options.json) {
        printScalingJson(summary);
      } else {
        printScalingTable(summary);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// tvs subcommand — aggregate Total Value Secured
const tvsCommand = new Command('tvs')
  .description('Get aggregate Total Value Secured (TVS) across all L2s')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const service = new L2BeatService();
      const tvs = await service.getScalingTvs();

      if (options.json) {
        printTvsJson(tvs);
      } else {
        printTvsTable(tvs);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// project subcommand — details for a single project by slug
const projectCommand = new Command('project')
  .description('Get details for a specific L2Beat project')
  .argument('<slug>', 'Project slug (e.g. arbitrum, optimism, base)')
  .option('-j, --json', 'Output as JSON')
  .action(async (slug: string, options) => {
    try {
      const service = new L2BeatService();
      const project = await service.getProject(slug);

      if (options.json) {
        printProjectJson(project);
      } else {
        printProjectTable(project);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

// activity subcommand — aggregate tx activity across all L2s
const activityCommand = new Command('activity')
  .description('Get aggregate transaction activity across all L2s (last 30 days)')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const service = new L2BeatService();
      const activity = await service.getScalingActivity();

      if (options.json) {
        printActivityJson(activity);
      } else {
        printActivityTable(activity);
      }
    } catch (error) {
      printError(error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

export const l2beatCommand = new Command('l2beat')
  .description('L2Beat analytics — scaling projects, TVS, and project details')
  .addCommand(activityCommand)
  .addCommand(projectCommand)
  .addCommand(scalingCommand)
  .addCommand(tvsCommand);
