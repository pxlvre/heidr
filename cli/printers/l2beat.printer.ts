import Table from 'cli-table3';
import chalk from 'chalk';
import type {
  L2BeatProject,
  L2BeatScalingSummary,
  L2BeatTvsData,
  L2BeatActivityData,
} from '@/services/l2beat/l2beat.service';

const formatUsd = (value: number): string => `$${(value / 1e9).toFixed(2)}B`;

const sentimentColor = (sentiment: string, text: string): string => {
  if (sentiment === 'good') return chalk.green(text);
  if (sentiment === 'warning') return chalk.yellow(text);
  if (sentiment === 'bad') return chalk.red(text);
  return chalk.gray(text);
};

/**
 * Print scaling projects list as table
 */
export const printScalingTable = (summary: L2BeatScalingSummary): void => {
  const table = new Table({
    head: ['Name', 'Category', 'Stage', 'Type', 'TVS (USD)'].map((h) => chalk.cyan(h)),
    style: { head: [] },
    wordWrap: true,
  });

  const active = Object.values(summary.projects).filter((p) => !p.isArchived && !p.isUpcoming);

  for (const project of active) {
    const tvs = project.tvs ? formatUsd(project.tvs.breakdown.total) : 'N/A';
    const stage = project.isUnderReview
      ? chalk.gray('Under Review')
      : (project.stage ?? chalk.gray('N/A'));
    table.push([project.name, project.category, stage, project.type, tvs]);
  }

  console.log(chalk.bold(`\nScaling Projects (${active.length} active)\n`));
  console.log(table.toString());
};

/**
 * Print scaling projects list as JSON
 */
export const printScalingJson = (summary: L2BeatScalingSummary): void => {
  const active = Object.values(summary.projects)
    .filter((p) => !p.isArchived && !p.isUpcoming)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      type: p.type,
      category: p.category,
      stage: p.stage,
      hostChain: p.hostChain,
      purposes: p.purposes,
      tvs: p.tvs ? { total: p.tvs.breakdown.total, change7d: p.tvs.change7d } : null,
    }));

  console.log(JSON.stringify(active, null, 2));
};

/**
 * Print aggregate TVS as table
 */
export const printTvsTable = (tvs: L2BeatTvsData): void => {
  const table = new Table({
    style: { head: ['cyan'] },
  });

  table.push(
    [chalk.bold('Total Value Secured (USD)'), chalk.green(formatUsd(tvs.usdValue))],
    [chalk.bold('Total Value Secured (ETH)'), `${(tvs.ethValue / 1e6).toFixed(2)}M ETH`],
    [chalk.bold('Data Points'), tvs.chart.data.length.toString()]
  );

  console.log(chalk.bold('\nL2Beat — Aggregate TVS\n'));
  console.log(table.toString());
};

/**
 * Print aggregate TVS as JSON
 */
export const printTvsJson = (tvs: L2BeatTvsData): void => {
  console.log(
    JSON.stringify(
      {
        usdValue: tvs.usdValue,
        ethValue: tvs.ethValue,
        usdFormatted: formatUsd(tvs.usdValue),
      },
      null,
      2
    )
  );
};

/**
 * Print a single project as table
 */
export const printProjectTable = (project: L2BeatProject): void => {
  const table = new Table({
    style: { head: ['cyan'] },
    wordWrap: true,
  });

  table.push(
    [chalk.bold('Name'), project.name],
    [chalk.bold('Slug'), project.slug],
    [chalk.bold('Type'), project.type],
    [chalk.bold('Category'), project.category],
    [chalk.bold('Host Chain'), project.hostChain ?? 'N/A'],
    [chalk.bold('Purposes'), project.purposes.join(', ')],
    [chalk.bold('Stage'), project.stage ?? 'N/A'],
    [chalk.bold('Under Review'), project.isUnderReview ? chalk.yellow('Yes') : chalk.green('No')]
  );

  if (project.tvs) {
    const { breakdown, change7d } = project.tvs;
    const changeStr =
      change7d >= 0
        ? chalk.green(`+${(change7d * 100).toFixed(2)}%`)
        : chalk.red(`${(change7d * 100).toFixed(2)}%`);
    table.push(
      [chalk.bold('TVS (Total)'), chalk.green(formatUsd(breakdown.total))],
      [chalk.bold('TVS (7d Change)'), changeStr],
      [chalk.bold('TVS — Native'), formatUsd(breakdown.native)],
      [chalk.bold('TVS — Canonical'), formatUsd(breakdown.canonical)],
      [chalk.bold('TVS — External'), formatUsd(breakdown.external)]
    );
  }

  if (project.risks.length > 0) {
    const risksStr = project.risks
      .map((r) => `${chalk.bold(r.name)}: ${sentimentColor(r.sentiment, r.value)}`)
      .join('\n');
    table.push([chalk.bold('Risks'), risksStr]);
  }

  console.log(table.toString());
};

/**
 * Print a single project as JSON
 */
export const printProjectJson = (project: L2BeatProject): void => {
  console.log(JSON.stringify(project, null, 2));
};

/**
 * Print scaling activity chart as table (last 30 days)
 */
export const printActivityTable = (activity: L2BeatActivityData): void => {
  const table = new Table({
    head: ['Date', 'Transactions', 'User Ops (UOps)'].map((h) => chalk.cyan(h)),
    style: { head: [] },
  });

  for (const [ts, count, uops] of activity.chart.data) {
    const date = new Date(ts * 1000).toISOString().slice(0, 10);
    table.push([date, count.toLocaleString(), uops.toLocaleString()]);
  }

  console.log(chalk.bold('\nL2Beat — Scaling Activity (last 30 days)\n'));
  console.log(table.toString());
};

/**
 * Print scaling activity chart as JSON
 */
export const printActivityJson = (activity: L2BeatActivityData): void => {
  const data = activity.chart.data.map(([ts, count, uops]) => ({
    date: new Date(ts * 1000).toISOString().slice(0, 10),
    transactions: count,
    userOps: uops,
  }));
  console.log(JSON.stringify(data, null, 2));
};
